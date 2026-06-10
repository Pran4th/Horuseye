"use client";

import { useEffect, useState } from "react";
import { BasicScanConfigurationForm } from "./_components/basic-scan-configuration-form";
import { RulesOfEngagementForm } from "./_components/rules-of-engagement-form";
import ReconToolsSelectionForm from "./_components/recon-tools-selection-form";
import VulnrScanToolsSelectionForm from "./_components/vulnr-scan-tools-selection-form";
import ExploitToolsAdvancedForm from "./_components/exploit-tools-adv-form";
import FinalScanPreview from "./_components/final-scan-preview";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

export default function MultiStepForm() {
  const [stepCount, setStepCount] = useState(0);
  const [currentForm, setCurrentForm] = useState<string>("basic-details-form");
  const [mounted, setMounted] = useState(false);
  const progress = (stepCount / 5) * 100;

  const [direction, setDirection] = useState(1);

  const onClickBack = () => {
    setDirection(-1);
    setStepCount((s) => Math.max(s - 1, 0));
  };

  const onClickNext = () => {
    setDirection(1);
    if (stepCount == 5) {
      // Submit the final form or perform any final actions here
    } else {
      if (stepCount < 5) {
        setStepCount((s) => s + 1);
      } else {
      }
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    switch (stepCount) {
      case 0:
        setCurrentForm("basic-details-form");
        break;
      case 1:
        setCurrentForm("roe-form");
        break;
      case 2:
        setCurrentForm("recon-form");
        break;
      case 3:
        setCurrentForm("vulnr-form");
        break;
      case 4:
        setCurrentForm("exploit-form");
        break;
      case 5:
        setCurrentForm("final-preview");
    }
  }, [stepCount]);

  if (!mounted) {
    return <Skeleton className="flex min-h-screen w-full px-8 py-12" />;
  }

  return (
    <div className="flex min-h-screen w-full items-start justify-center pt-16 pb-8">
      <div className="flex min-h-screen w-full flex-col items-center justify-between px-6 py-10">
        <AnimatePresence mode="wait" custom={direction}>
          {stepCount === 0 && (
            <motion.div
              key="basic-form"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <BasicScanConfigurationForm
                setStepCount={setStepCount}
                onClickBack={onClickBack}
                onClickNext={onClickNext}
              />
            </motion.div>
          )}

          {stepCount === 1 && (
            <motion.div
              key="roe-form"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <RulesOfEngagementForm
                setStepCount={setStepCount}
                onClickBack={onClickBack}
                onClickNext={onClickNext}
              />
            </motion.div>
          )}

          {stepCount == 2 && (
            <motion.div
              key="recon-form"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <ReconToolsSelectionForm
                setStepCount={setStepCount}
                onClickBack={onClickBack}
                onClickNext={onClickNext}
              />
            </motion.div>
          )}
          {stepCount == 3 && (
            <motion.div
              key="vulnr-form"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <VulnrScanToolsSelectionForm
                setStepCount={setStepCount}
                onClickBack={onClickBack}
                onClickNext={onClickNext}
              />
            </motion.div>
          )}
          {stepCount == 4 && (
            <motion.div
              key="exploit-form"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <ExploitToolsAdvancedForm
                setStepCount={setStepCount}
                onClickBack={onClickBack}
                onClickNext={onClickNext}
              />
            </motion.div>
          )}
          {stepCount == 5 && (
            <motion.div
              key="final-preview"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <FinalScanPreview
                onClickNext={onClickNext}
                onClickBack={onClickBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div
          className={cn(
            "mt-10 flex w-full max-w-2xl items-center justify-between",
            stepCount === 5 && "invisible",
          )}
        >
          <Button
            disabled={stepCount === 0}
            onClick={onClickBack}
            className="cursor-pointer rounded-md border bg-transparent text-sm text-black/80 hover:bg-white/80 hover:text-black disabled:opacity-40 dark:text-white/80 hover:dark:bg-transparent hover:dark:text-white"
          >
            Back
          </Button>

          <div className="mx-4 h-1 flex-1 overflow-hidden rounded bg-gray-200 dark:bg-gray-600">
            <div
              className="h-1 rounded bg-black transition-all duration-500 ease-in-out dark:bg-white"
              style={{ width: `${progress}%` }}
            />
          </div>

          <Button
            form={currentForm}
            type="submit"
            className="cursor-pointer rounded-md bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-white dark:text-black hover:dark:bg-white/90 hover:dark:text-black"
          >
            {stepCount === 5 ? "Start" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
