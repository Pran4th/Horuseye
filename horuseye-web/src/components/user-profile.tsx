"use client";

import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { authenticatedFetch } from "@/lib/api-client";

export default function UserProfile() {
  const { data, status } = useSession();

  const handleLogout = async () => {
    try {
      // Step 1: Invalidate the token on the backend
      await authenticatedFetch("/api/v1/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(
        "Backend logout failed, proceeding with frontend logout.",
        error,
      );
    } finally {
      signOut({ callbackUrl: "/auth/signin" });
    }
  };

  if (status === "loading") {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (status === "unauthenticated") {
    return null;
  }
  console.log(data?.user?.image);
  return (
    <Dialog>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Avatar>
              <AvatarImage src={data?.user?.image || "/default_avatar.png"} />
              <AvatarFallback>{data?.user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="font-medium">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DialogTrigger asChild className="w-full">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild className="w-full">
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This might impact your current session state. You can always log
              back in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Changes to profile are not allowed as it is linked to your google
            account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={data?.user?.name || "No name"}
              disabled
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="username"
              defaultValue={data?.user?.email || "No email"}
              disabled
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
