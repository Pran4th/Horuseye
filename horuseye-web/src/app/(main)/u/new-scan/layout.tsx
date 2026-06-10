"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useScanStore } from "@/stores/useScanStore";

export default function NewScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentScan, setCurrentScan } = useScanStore();

  useEffect(() => {
    const scanId = pathname.split("/").pop();

    if (!scanId) {
      router.replace("/u/dashboard");
      return;
    }

    if (!currentScan || currentScan.id !== scanId) {
      const stored = localStorage.getItem(`scan-${scanId}`);
      if (stored) {
        setCurrentScan(JSON.parse(stored));
      } else {
        router.replace("/u/dashboard");
      }
    }
  }, [pathname, currentScan, setCurrentScan, router]);

  return <div className="flex flex-1">{children}</div>;
}
