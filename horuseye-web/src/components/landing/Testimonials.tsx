"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Alex Morgan",
    role: "CTO, TechSecure Inc.",
    content:
      "HorusEye has transformed our security testing process. What used to take days now takes hours, with far more comprehensive results.",
    color: "from-pink-200 via-rose-400 to-red-600",
  },
  {
    name: "Sarah Jenkins",
    role: "Security Lead, FinCorp",
    content:
      "The AI-powered analysis is a game-changer. It doesn't just find vulnerabilities—it tells us which ones actually matter for our specific infrastructure.",
    color: "from-purple-500 via-indigo-500 to-blue-500",
  },
  {
    name: "Michael Chen",
    role: "DevOps Engineer, CloudNova",
    content:
      "The microservices architecture means we can run multiple penetration tests simultaneously without any performance degradation.",
    color: "from-lime-200 via-green-400 to-emerald-600",
  },
];

export default function FuturisticTestimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <motion.div
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 -z-20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 bg-[length:200%_200%]"
      />

      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/20"
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -200],
              x: [0, i % 2 === 0 ? 40 : -40],
            }}
            transition={{
              duration: 10 + i,
              delay: i * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
          Voices{" "}
          <span className="from-primary bg-gradient-to-r to-cyan-400 bg-clip-text text-transparent">
            of Innovation
          </span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          How HorusEye empowers next-gen security teams.
        </p>
      </div>

      <div className="relative mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) next();
              if (info.offset.x > 50) prev();
            }}
          >
            <Card className="relative rounded-3xl border border-cyan-400/30 px-12 shadow-2xl shadow-cyan-500/20 backdrop-blur-md dark:bg-black/40 dark:backdrop-blur-xl">
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${testimonials[index]!.color} opacity-60 dark:opacity-40 dark:blur-2xl`}
              />
              <CardContent className="relative p-10">
                <motion.p
                  className="mb-8 text-xl leading-relaxed text-white/90 italic md:text-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  “{testimonials[index]!.content}”
                </motion.p>
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-lg font-bold text-white shadow-lg shadow-cyan-500/40">
                    {testimonials[index]!.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {testimonials[index]!.name}
                    </h3>
                    <p className="text-sm text-cyan-200/80">
                      {testimonials[index]!.role}
                    </p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-y-0 left-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className="h-12 w-12 rounded-full bg-white/80 shadow-md backdrop-blur-md hover:bg-white dark:border-0 dark:bg-black/60 dark:hover:bg-black/80"
          >
            <ChevronLeft className="h-10 w-10 dark:text-cyan-400" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="h-12 w-12 rounded-full bg-white/80 shadow-md backdrop-blur-md hover:bg-white dark:bg-black/60 dark:hover:bg-black/80"
          >
            <ChevronRight className="h-10 w-10 dark:text-cyan-400" />
          </Button>
        </div>
      </div>
    </section>
  );
}
