FROM python:3.11-slim AS builder

WORKDIR /app
COPY requirements.txt .
# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app

# --- FIX: Add this line to force Python to print logs immediately ---
ENV PYTHONUNBUFFERED=1

# Copy dependencies from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

COPY app.py .
COPY argo_run_report.py .
COPY utils/ utils/

# Set new CMD
CMD ["python3", "argo_run_report.py"]

