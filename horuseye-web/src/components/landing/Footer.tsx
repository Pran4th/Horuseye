"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-border relative border-t bg-black/40 backdrop-blur-md">
      <motion.div
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-50 via-blue-100 to-indigo-100 dark:bg-linear-to-r dark:from-zinc-500 dark:via-stone-600 dark:to-zinc-900"
      />

      <div className="container mx-auto px-6 pt-10 pb-4 md:pt-12 md:pb-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                HorusEye
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gray-700 dark:text-white/80">
              Next-generation automated penetration testing platform, built for
              scale and security.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              {["Features", "Pricing", "API", "Documentation"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="group relative text-gray-700 hover:text-white dark:text-white/80"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="group relative text-gray-700 hover:text-white dark:text-white/80"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-800 dark:text-white">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              {["Privacy", "Terms", "Security", "Compliance"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="group relative text-gray-700 hover:text-white dark:text-white/80"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-cyan-400 to-purple-500 transition-all group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="via-border mt-6 mb-2 h-px w-full bg-gradient-to-r from-transparent to-transparent" />

        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <p className="text-sm text-gray-700 dark:text-white/80">
            © {new Date().getFullYear()} HorusEye. All rights reserved.
          </p>

          <div className="flex space-x-4">
            {[
              {
                name: "Twitter",
                icon: (
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                ),
              },
              {
                name: "GitHub",
                icon: (
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
              },
              {
                name: "LinkedIn",
                icon: (
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                ),
              },
            ].map((social, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gradient-to-r hover:from-cyan-400/20 hover:to-purple-500/20"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
