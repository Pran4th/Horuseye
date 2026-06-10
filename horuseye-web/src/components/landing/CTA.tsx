"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Zap } from "lucide-react";

export default function CTA() {
  return (
    <section className="w-full px-8 py-8 md:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="from-primary/10 border-border/50 rounded-xl border bg-gradient-to-r to-cyan-400/10 p-8 text-center md:p-12 lg:p-16"
      >
        <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
          Ready to Transform Your{" "}
          <span className="from-primary bg-gradient-to-r to-cyan-400 bg-clip-text text-transparent">
            Security Posture?
          </span>
        </h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
          Join leading security teams who use HorusEye to find and fix
          vulnerabilities before they can be exploited.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" className="text-md rounded-full px-8 py-6">
            Get Started
            <Zap className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-md rounded-full px-8 py-6"
          >
            <Shield className="mr-2 h-4 w-4" />
            Schedule Demo
          </Button>
        </div>
        <p className="text-muted-foreground mt-6 text-sm">
          No credit card required. Free trial includes 1 scans.
        </p>
      </motion.div>
    </section>
  );
}
