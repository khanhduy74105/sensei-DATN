// components/header-client.tsx
"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PenBox,
  Camera,
  StarsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function HeaderClient() {
  return (
    <nav className="container mx-auto flex h-16 items-center justify-between px-4">
      <Link href="/">
        <Image
          width={200}
          height={60}
          alt="Sensei logo"
          src="/logo.png"
          className="h-12 w-auto py-1 object-contain"
        />
      </Link>

      <div className="flex items-center space-x-2">
        <SignedIn>
          <Link href="/dashboard">
            <Button variant="outline">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:block">Industry Insights</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <StarsIcon className="h-4 w-4" />
                <span className="hidden md:block">Growth Tools</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/resume" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Build resume
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/ai-cover-letter" className="flex items-center gap-2">
                  <PenBox className="h-4 w-4" />
                  Cover letter
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/interview" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Interview Prep
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/talk" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Mock interview
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>

        <SignedOut>
          <SignInButton>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
