"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
      <h1 className="text-6xl font-bold gradient-title mb-4">ERROR</h1>
      <h2 className="text-2xl font-semibold mb-4">Something wrong</h2>
      <p className="text-gray-600 mb-8">
        Oops! The something wrong with application please try again.
      </p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}