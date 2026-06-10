"use client";

import * as React from "react";
import { v4 as uuidv4 } from "uuid";

import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { NavData } from "@/data";
import { useRouter } from "next/navigation";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [activeTeam, setActiveTeam] = React.useState(NavData.teams[0]);
  const { data: userData, status } = useSession();

  const handleNewScan = () => {
    const id = uuidv4();

    if (typeof window !== "undefined") {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("scan-")) {
          localStorage.removeItem(key);
        }
      });

      const newScan = {
        id,
        createdAt: Date.now(),
        data: {},
      };
      localStorage.setItem(`scan-${id}`, JSON.stringify(newScan));
    }

    router.push(`/u/new-scan/${id}`);
  };

  const handleRoute = (url: string) => {
    router.push(url);
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="NavData-[state=open]:bg-sidebar-accent NavData-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      {activeTeam && <activeTeam.logo className="size-4" />}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeTeam!.name}
                      </span>
                      <span className="truncate text-xs">
                        {activeTeam!.type}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    Teams
                  </DropdownMenuLabel>
                  {NavData.teams.map((team, index) => (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => setActiveTeam(team)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <team.logo className="size-4 shrink-0" />
                      </div>
                      {team.name}
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                      <Plus className="size-4" />
                    </div>
                    <div className="text-muted-foreground font-medium">
                      Add team
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {NavData.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="group-NavData-[state=open]/collapsible:rotate-90 ml-auto transition-transform duration-200" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a
                                onClick={
                                  subItem.title === "New Scan"
                                    ? handleNewScan
                                    : () => handleRoute(subItem.url)
                                }
                                className="cursor-pointer"
                              >
                                <div className="group flex w-full items-center justify-between">
                                  <span>{subItem.title}</span>
                                  {subItem.title === "New Scan" && (
                                    <div className="ml-auto hidden h-4 w-4 items-center justify-center rounded-full bg-gray-100 group-hover:flex">
                                      <Plus className="ml-auto size-4 text-gray-500" />
                                    </div>
                                  )}
                                </div>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="NavData-[state=open]:bg-sidebar-accent NavData-[state=open]:text-sidebar-accent-foreground"
                  >
                    {status === "loading" ? (
                      <Skeleton className="h-8 w-8 rounded-lg bg-gray-200" />
                    ) : status === "unauthenticated" ? null : (
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={userData?.user.image || "/default_avatar.png"}
                          alt={userData?.user.name?.[0]}
                        />
                        <AvatarFallback className="rounded-lg">
                          {userData?.user.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData?.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {userData?.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      {status === "loading" ? (
                        <Skeleton className="h-8 w-8 rounded-lg bg-gray-200" />
                      ) : status === "unauthenticated" ? null : (
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={userData?.user.image || "/default_avatar.png"}
                            alt={userData?.user.name?.[0]}
                          />
                          <AvatarFallback className="rounded-lg">
                            {userData?.user.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userData?.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {userData?.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {children}
    </>
  );
}
