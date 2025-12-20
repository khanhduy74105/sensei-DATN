"use client";

import { UpgradeModal } from "@/components/upgrade-model";
import { createContext, useContext, useState, ReactNode } from "react";

type UpgradeModalContextType = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
  isPaid: boolean;
  setIsPaid: (paid: boolean) => void;
  balanceLeft: number;
  setBalanceLeft: (n: number) => void;
  userId: string;
  setUserId: (u: string) => void;
};

const UpgradeModalContext = createContext<UpgradeModalContextType | null>(null);

export function UpgradeModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [userId, setUserId] = useState('');

  const [balanceLeft, setBalanceLeft] = useState(0);

  return (
    <UpgradeModalContext.Provider
      value={{
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        isOpen: isOpen,
        isPaid,
        setIsPaid,
        balanceLeft,
        setBalanceLeft,
        userId,
        setUserId,
      }}
    >
      {children}
      <UpgradeModal open={isOpen} onOpenChange={setIsOpen} />
    </UpgradeModalContext.Provider>
  );
}

export function useUpgradeModal() {
  const ctx = useContext(UpgradeModalContext);
  if (!ctx) {
    throw new Error("useUpgradeModal must be used within UpgradeModalProvider");
  }
  return ctx;
}
