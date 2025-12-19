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

export default function HeaderAdmin() {
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
