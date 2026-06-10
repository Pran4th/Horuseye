"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cpu, Database, Brain, Workflow, Cloud, Shield } from "lucide-react";

const architectureLayers = [
  {
    name: "Presentation Layer",
    icon: <Cloud className="h-8 w-8" />,
    components: [
      "Next.js Frontend",
      "shadcn/ui Components",
      "Real-time Dashboard",
    ],
    color: "from-blue-500 to-cyan-400",
    startColor: "blue-500",
    endColor: "cyan-400",
    bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-400/10",
  },
  {
    name: "Orchestration Layer",
    icon: <Workflow className="h-8 w-8" />,
    components: ["Argo Workflows", "Kubernetes Controller", "Scan Scheduler"],
    color: "from-purple-500 to-pink-500",
    startColor: "purple-500",
    endColor: "pink-500",
    bgColor: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
  },
  {
    name: "Tool Execution Layer",
    icon: <Cpu className="h-8 w-8" />,
    components: [
      "Nmap Scanner",
      "Metasploit Module",
      "Nikto Web Scanner",
      "OpenVAS",
    ],
    color: "from-green-500 to-emerald-400",
    startColor: "green-500",
    endColor: "emerald-400",
    bgColor: "bg-gradient-to-br from-green-500/10 to-emerald-400/10",
  },
  {
    name: "AI Analysis Layer",
    icon: <Brain className="h-8 w-8" />,
    components: [
      "LLM Integration",
      "Vulnerability Correlation",
      "Report Generation",
    ],
    color: "from-yellow-500 to-amber-400",
    startColor: "yellow-500",
    endColor: "amber-400",
    bgColor: "bg-gradient-to-br from-yellow-500/10 to-amber-400/10",
  },
  {
    name: "Data Layer",
    icon: <Database className="h-8 w-8" />,
    components: ["Cloud SQL", "Cloud Storage", "Encrypted Logs"],
    color: "from-orange-500 to-red-400",
    startColor: "orange-500",
    endColor: "red-400",
    bgColor: "bg-gradient-to-br from-orange-500/10 to-red-400/10",
  },
  {
    name: "Security Layer",
    icon: <Shield className="h-8 w-8" />,
    components: [
      "Zero-Trust Network",
      "Pod Security Policies",
      "Encryption at Rest",
    ],
    color: "from-gray-500 to-slate-400",
    startColor: "gray-500",
    endColor: "slate-400",
    bgColor: "bg-gradient-to-br from-gray-500/10 to-slate-400/10",
  },
];

export default function Architecture() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="architecture"
      className="relative overflow-hidden pt-20 pb-8 md:pt-28 md:pb-16 lg:pt-32 lg:pb-28"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/10 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl"
          >
            Advanced{" "}
            <span className="from-primary bg-gradient-to-r to-cyan-400 bg-clip-text text-transparent">
              Microservices Architecture
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mx-auto max-w-3xl text-lg"
          >
            Built for scale, security, and reliability with complete isolation
            between penetration tests.
          </motion.p>
        </div>

        <div ref={ref} className="relative">
          {/* Connection lines - Fixed positioning */}
          <div className="absolute top-0 left-1/2 hidden h-full w-1 -translate-x-1/2 transform md:block">
            <div className="from-primary/20 h-full w-full bg-gradient-to-b via-cyan-400/20 to-emerald-400/20"></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-y-16 md:grid-cols-2">
            {architectureLayers.map((layer, index) => {
              const row = Math.floor(index / 2) + 1;
              const col = (index % 2) + 1;
              const isLeft = col === 1;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex ${isLeft ? "justify-end pr-8" : "justify-start pl-8"}`}
                  style={{
                    gridRow: row,
                    gridColumn: col,
                  }}
                >
                  <Card
                    className={`${layer.bgColor} border-border/50 group relative w-full max-w-sm overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
                  >
                    <div
                      className={`h-2 bg-gradient-to-r ${layer.color}`}
                    ></div>
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center">
                        <div
                          className={`mr-3 rounded-lg bg-gradient-to-r p-2 text-white ${layer.color}`}
                        >
                          {layer.icon}
                        </div>
                        <h3 className="text-xl font-semibold">{layer.name}</h3>
                      </div>
                      <ul className="space-y-2">
                        {layer.components.map((component, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={
                              isInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -20 }
                            }
                            transition={{
                              duration: 0.3,
                              delay: index * 0.1 + i * 0.05,
                            }}
                            className="text-muted-foreground flex items-center text-sm"
                          >
                            <div
                              className={`mr-2 h-2 w-2 rounded-full bg-gradient-to-r ${layer.color}`}
                            />
                            {component}
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Animated data flow - Fixed implementation */}
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            {isInView && (
              <>
                {architectureLayers.map((layer, index) => {
                  const position =
                    (index / (architectureLayers.length - 1)) * 80 + 10;
                  return (
                    <motion.div
                      key={index}
                      className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full"
                      style={{
                        top: `${position}%`,
                        transform: "translateY(-50%)",
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 1,
                        times: [0, 0.5, 1],
                        delay: index * 0.3,
                      }}
                    >
                      <div
                        className={`h-full w-full rounded-full bg-gradient-to-r ${layer.color}`}
                      />
                    </motion.div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
