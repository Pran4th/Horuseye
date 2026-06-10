"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import UserProfile from "../user-profile";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const session = useSession();
  console.log("Session: ", session);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navigation = [
    { name: "Features", href: "#features" },
    { name: "Architecture", href: "#architecture" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="border-border/40 bg-background/60 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b pr-4 pl-3 backdrop-blur dark:bg-gray-900/60 dark:supports-[backdrop-filter]:bg-gray-900/60"
    >
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 ml-2 hidden md:flex">
          <div className="mr-4 flex h-7 w-9 cursor-pointer items-center justify-center rounded-sm bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md dark:from-amber-600 dark:to-amber-500">
            <Eye className="h-6 w-6 text-white dark:text-white" />
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="dark:hover:text-foreground/80 dark:text-foreground/60 text-gray-700 transition-colors hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="px-7">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <div className="from-primary mr-2 h-6 w-6 rounded-full bg-gradient-to-r to-cyan-400" />
                <span className="from-primary bg-gradient-to-r to-cyan-400 bg-clip-text font-bold text-transparent">
                  HorusEye
                </span>
              </Link>
            </div>
            <div className="mt-3 h-full pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Future search bar can go here */}
          </div>
          <nav className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full"
            >
              <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            {session.status === "unauthenticated" ? (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex"
                asChild
              >
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            ) : (
              <UserProfile />
            )}
            <Button size="sm" className="hidden md:inline-flex" asChild>
              <Link href="/u/dashboard">Dashboard</Link>
            </Button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
