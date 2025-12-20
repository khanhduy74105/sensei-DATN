import Header from "@/components/header";
import { UpgradeModalProvider } from "@/contexts/ModalContext";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <UpgradeModalProvider>
        <Header />

        {children}
      </UpgradeModalProvider>
    </div>
  );
};

export default layout;
