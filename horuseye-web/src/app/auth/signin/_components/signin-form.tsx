"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { Lock, Shield, Scan, Eye } from "lucide-react";

export const SignInForm = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-8 left-0 h-[520px] w-[520px] -translate-x-1/4 -translate-y-1/4 opacity-5"
          viewBox="0 0 600 600"
          fill="none"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop stopColor="#6366f1" offset="0%" />
              <stop stopColor="#8b5cf6" offset="100%" />
            </linearGradient>
          </defs>
          <circle cx="300" cy="300" r="300" fill="url(#g1)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-3xl"
      >
        <div className="grid grid-cols-1 gap-6 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-md sm:grid-cols-2">
          <div className="flex flex-col justify-between gap-6 p-2 sm:p-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-500 text-white shadow-md">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    HorusEye
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Automated pentesting & vulnerability orchestration
                  </div>
                </div>
              </div>

              <h2 className="mt-6 text-2xl font-semibold text-slate-900">
                Sign in to your account
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Securely access your scans, reports and team workspace.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3">
                  <div className="rounded-md bg-gray-50 p-2 text-slate-700">
                    <Scan className="h-4 w-4" />
                  </div>
                  <div className="text-sm text-slate-900">
                    Enterprise-grade scanning orchestration
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3">
                  <div className="rounded-md bg-gray-50 p-2 text-slate-700">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="text-sm text-slate-900">
                    Role-based access & team collaboration
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3">
                  <div className="rounded-md bg-gray-50 p-2 text-slate-700">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="text-sm text-slate-900">
                    Automated vulnerability reporting & scheduling
                  </div>
                </div>
              </div>
            </div>

            <div className="text-muted-foreground mt-4 text-xs">
              By signing in you agree to our Terms and acknowledge the Privacy
              Policy.
            </div>
          </div>

          <div className="flex flex-col justify-center p-2 sm:p-6">
            <div className="mb-6 text-center">
              <div className="text-sm font-medium text-slate-700">
                Welcome back
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Use your Google account to securely sign in
              </p>
            </div>

            <div className="flex w-full flex-col gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() =>
                    signIn("google", { callbackUrl: "/dashboard" })
                  }
                  className="flex w-full items-center justify-center gap-3 rounded-xl py-6 text-base font-medium text-gray-800 shadow-sm transition-all hover:text-gray-900 hover:shadow-md"
                  variant="outline"
                >
                  <FcGoogle size={22} />
                  Continue with Google
                </Button>
              </motion.div>

              <div className="mt-4 text-center">
                <p className="text-muted-foreground text-xs">
                  Don't have an account?{" "}
                  <button className="font-medium text-indigo-600 transition-colors hover:text-indigo-700">
                    Request access
                  </button>
                </p>
              </div>

              <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                  <div>
                    <p className="text-xs font-medium text-amber-800">
                      Security Notice
                    </p>
                    <p className="mt-1 text-xs text-amber-700">
                      HorusEye is an automated penetration testing tool. All
                      activities are logged and monitored. Use responsibly and
                      only on systems you own or have explicit permission to
                      test.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground mt-6 text-center text-xs">
          © {new Date().getFullYear()} HorusEye Security. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};
