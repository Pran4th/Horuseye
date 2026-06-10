"use server";

import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { SignInForm } from "./_components/signin-form";

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return <SignInForm />;
}
