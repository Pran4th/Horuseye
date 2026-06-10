import json
import logging
from fastapi import HTTPException # Import HTTPException
from kubernetes import client, config
from kubernetes.client.rest import ApiException
from app.models.scan import ToolExecutionBackend # Import backend model

logger = logging.getLogger(__name__)

ARGO_WORKFLOW_NAMESPACE = "argo"
RECON_WORKFLOW_TEMPLATE_NAME = "recon-workflow-template"
API_GROUP = "argoproj.io"
API_VERSION = "v1alpha1"
WORKFLOW_PLURAL = "workflows"

try:
    config.load_incluster_config()
    logger.info("Loaded in-cluster Kubernetes configuration.")
except config.ConfigException:
    try:
        config.load_kube_config()
        logger.info("Loaded local kubeconfig configuration.")
    except config.ConfigException:
        logger.error("Could not configure Kubernetes client.")
        # Handle the error appropriately in a production scenario
        # Maybe raise an exception or exit

custom_api = client.CustomObjectsApi()

def transform_frontend_params_to_backend(frontend_params: dict) -> list[dict]:
    """
    Transforms frontend parameter format (dict) to backend format (list of dicts).
    Assumes frontend format: {"flag": "value", "-boolFlag": "true"}
    Outputs backend format: [{"flag": "flag", "value": "value"}, {"flag": "-boolFlag", "value": "true"}]
    """
    backend_params = []
    if not isinstance(frontend_params, dict):
        logger.warning(f"Expected dict for frontend_params, got {type(frontend_params)}. Returning empty list.")
        return []
        
    for flag_key, flag_value in frontend_params.items():
        param = {"flag": str(flag_key)}
        # Ensure value is always a string, handle None or empty if necessary
        param_value = str(flag_value) if flag_value is not None else "true" # Default to "true" if value is None? Check tool reqs
        param["value"] = param_value
        
        backend_params.append(param)
        
    logger.debug(f"Transformed Frontend Params: {frontend_params} -> Backend Params: {backend_params}")
    return backend_params

def submit_argo_workflow(
    scan_id: str,
    target: str,
    recon_tools: list[dict], 
    vulnr_tools: list[dict]  
) -> dict:
    """
    Submits a new Argo Workflow based on the recon-workflow-template.
    """
    
    try:
        recon_tools_json = json.dumps(recon_tools)
        vulnr_tools_json = json.dumps(vulnr_tools)
    except TypeError as e:
        logger.error(f"Error serializing tool payloads to JSON: {e}")
        raise ValueError("Invalid tool data provided.") from e

    workflow_manifest = {
        "apiVersion": f"{API_GROUP}/{API_VERSION}",
        "kind": "Workflow",
        "metadata": {
            "generateName": "recon-scan-", 
            "namespace": ARGO_WORKFLOW_NAMESPACE,
            "labels": {
                "horuseye-scan-id": scan_id 
            }
        },
        "spec": {
            "workflowTemplateRef": {
                "name": RECON_WORKFLOW_TEMPLATE_NAME
            },
            "arguments": {
                "parameters": [
                    {"name": "scan-id", "value": scan_id},
                    {"name": "target", "value": target},
                    {"name": "recon-tools-payload-json", "value": recon_tools_json},
                    {"name": "vulnr-tools-payload-json", "value": vulnr_tools_json}
                ]
            }
        }
    }

    try:
        logger.info(f"Submitting Argo Workflow for scan_id: {scan_id}")
        api_response = custom_api.create_namespaced_custom_object(
            group=API_GROUP,
            version=API_VERSION,
            namespace=ARGO_WORKFLOW_NAMESPACE,
            plural=WORKFLOW_PLURAL,
            body=workflow_manifest,
        )
        workflow_name = api_response.get("metadata", {}).get("name")
        logger.info(f"Successfully submitted Workflow: {workflow_name}")
        return {"workflow_name": workflow_name, "scan_id": scan_id}
    
    except ApiException as e:
        logger.error(f"Kubernetes API Exception when submitting workflow: {e.status} - {e.reason} - {e.body}")
        raise HTTPException(status_code=500, detail=f"Failed to submit workflow to Argo: {e.reason}") from e
    except Exception as e:
        logger.exception("Unexpected error submitting Argo workflow")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while starting the scan.") from e

