"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { getUserCredit } from "@/actions/payment";
import { useEffect } from "react";
import PaymentButton from "./payment-button";

export function UpgradeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { data, fn } = useFetch(getUserCredit);

  useEffect(() => {
    if (open) {
      fn();
    }
  }, [open]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-950 text-white border border-gray-800 max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-center">
            Go Unlimited 🚀
          </DialogTitle>
          <p className="text-center text-gray-400">
            Unlock unlimited AI usage and premium features
          </p>
        </DialogHeader>

        {/* Price */}
        <div className="my-6 flex flex-col items-center">
          <div className="flex items-end gap-1">
            <span className="text-6xl font-extrabold">$9.99</span>
            <span className="text-gray-400 text-sm mb-1">forever</span>
          </div>
          <span className="text-xs text-gray-500 mt-1">
            No hidden fees
          </span>
        </div>

        {/* Usage info */}
        <div className="rounded-lg border border-gray-800 bg-gray-950 p-4 text-sm text-gray-300">
          {!data?.isPaid && data?.balance <= 0 ? (
            <p>
              ⚠️ You’ve used all your free requests.
              <br />
              Upgrade to continue using AI without limits.
            </p>
          ) : (
            <p>
              You’ve used{" "}
              <span className="font-semibold text-white">
                {10 - (data?.balance ?? 0)} / 10
              </span>{" "}
              premium requests.
              <br />
              Upgrade now for unlimited access.
            </p>
          )}
        </div>

        {/* Benefits */}
        <ul className="mt-5 space-y-2 text-sm text-gray-300">
          <li>✅ Unlimited AI requests</li>
          <li>✅ Priority feature access</li>
          <li>✅ Premium templates & tools</li>
        </ul>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Maybe later
          </Button>
          <PaymentButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
