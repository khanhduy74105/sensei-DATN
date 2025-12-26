import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { createCheckoutSession } from "@/actions/payment";
import { toast } from "sonner";
import { log } from "node:console";
import { usePathname } from "next/navigation";

const PaymentButton = () => {
  const [pending, startTransition] = useTransition();
  const pathname = usePathname();

  const onClickPayment = () => {
    startTransition(() => {
      createCheckoutSession(pathname)
        .then((response) => {
          if (response) {
            window.location.href = response;
          }
        })
        .catch(() => toast.error("Some went wrong"));
    });
  };
  return (
    <Button
      className="flex-1 bg-white text-black hover:bg-gray-200 font-semibold"
      onClick={onClickPayment}
    >
      Upgrade for $9.99
    </Button>
  );
};

export default PaymentButton;
