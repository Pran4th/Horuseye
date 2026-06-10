"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  GitBranch,
  Lock,
  Server,
  ShieldCheck,
  Workflow,
  Zap,
  Eye,
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Analysis",
    description:
      "Leverage advanced machine learning to identify, classify, and prioritize vulnerabilities with unprecedented accuracy.",
    icon: <Brain className="h-8 w-8" />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
    delay: 0,
  },
  {
    title: "Microservices Architecture",
    description:
      "Scalable, isolated testing environments for each penetration test with Kubernetes-powered orchestration.",
    icon: <GitBranch className="h-8 w-8" />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
    delay: 0.1,
  },
  {
    title: "Zero-Trust Security",
    description:
      "Built with security-first principles, ensuring your data and testing environments remain completely isolated.",
    icon: <Lock className="h-8 w-8" />,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
    delay: 0.2,
  },
  {
    title: "Comprehensive Tool Integration",
    description:
      "Seamlessly integrates industry-standard tools like Nmap, Metasploit, OpenVAS, and custom exploitation frameworks.",
    icon: <ShieldCheck className="h-8 w-8" />,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-500/10 to-red-500/10",
    delay: 0.3,
  },
  {
    title: "Automated Workflows",
    description:
      "Customizable testing pipelines that adapt to your infrastructure and security requirements.",
    icon: <Workflow className="h-8 w-8" />,
    color: "from-yellow-500 to-amber-500",
    bgColor: "bg-gradient-to-br from-yellow-500/10 to-amber-500/10",
    delay: 0.4,
  },
  {
    title: "Enterprise Scalability",
    description:
      "Designed for organizations of all sizes, from startups to Fortune 500 companies with dedicated infrastructure.",
    icon: <Server className="h-8 w-8" />,
    color: "from-indigo-500 to-violet-500",
    bgColor: "bg-gradient-to-br from-indigo-500/10 to-violet-500/10",
    delay: 0.5,
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      ref={ref}
      className="relative overflow-hidden py-20 md:py-28 lg:py-36"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/10 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"></div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center rounded-full border px-4 py-1 text-sm font-medium"
          >
            <Zap className="mr-2 h-4 w-4" />
            Cutting-Edge Technology
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            Powerful Features for{" "}
            <span className="from-primary bg-gradient-to-r to-cyan-400 bg-clip-text text-transparent">
              Modern Security
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mx-auto max-w-3xl text-lg md:text-xl"
          >
            Horuseye combines cutting-edge technology with battle-tested
            security tools to deliver comprehensive penetration testing at
            scale.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: feature.delay,
                ease: "easeOut",
              }}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 },
              }}
              className="group relative"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20`}
              ></div>

              <Card
                className={`${feature.bgColor} border-border/50 group-hover:border-primary/30 relative h-full overflow-hidden backdrop-blur-sm transition-all duration-500`}
              >
                <CardContent className="p-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: feature.delay + 0.2, duration: 0.5 }}
                    className={`absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-r ${feature.color} opacity-5`}
                  ></motion.div>

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{
                      delay: feature.delay + 0.1,
                      duration: 0.6,
                      type: "spring",
                      damping: 15,
                      stiffness: 200,
                    }}
                    className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r ${feature.color} p-3 text-white`}
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="mb-3 text-xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100%" } : {}}
                    transition={{ delay: feature.delay + 0.4, duration: 0.8 }}
                    className={`h-0.5 bg-gradient-to-r ${feature.color}`}
                  ></motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute right-4 bottom-4"
                  >
                    <Eye className="text-primary h-4 w-4" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {[
            { number: "99.9%", label: "Uptime" },
            { number: "5min", label: "Average Scan Time" },
            { number: "50+", label: "Security Tools" },
            { number: "24/7", label: "Support" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-primary text-3xl font-bold md:text-4xl">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-sm font-medium tracking-wide uppercase md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
