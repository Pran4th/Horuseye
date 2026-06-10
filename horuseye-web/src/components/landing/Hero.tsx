"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Eye, Zap } from "lucide-react";
import { AuroraBackground } from "../ui/aurora-background";
import Link from "next/link";

export default function Hero() {
  return (
    <AuroraBackground>
      <section className="relative container mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-20 lg:pt-32 lg:pb-28">
        <div className="-mt-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl"
          >
            <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 backdrop-blur-3xl dark:bg-gray-900 dark:text-white">
                Next-gen Automated Pentesting Platform
              </span>
            </button>

            <h1 className="dark:text-foreground mt-4 text-4xl font-bold tracking-tighter text-gray-800 sm:text-5xl md:text-6xl lg:text-7xl/none">
              Secure Your Digital Universe with
              <span className="bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent dark:bg-linear-to-r dark:from-yellow-200 dark:via-yellow-500 dark:to-amber-400">
                {" "}
                AI-Powered Insights
              </span>
            </h1>

            <p className="dark:text-muted-foreground text-md mx-auto mt-6 max-w-3xl text-slate-800 md:text-lg">
              Horuseye combines cutting-edge cybersecurity tools with AI
              analysis to provide comprehensive penetration testing and
              actionable intelligence in a scalable, enterprise-ready platform.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="cursor-pointer" asChild>
                <Link href="/">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="cursor-pointer border border-gray-950 bg-transparent text-gray-900 transition-all hover:text-white dark:border-white dark:bg-transparent dark:text-white dark:hover:text-white"
              >
                Request Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </AuroraBackground>
  );
}
