import Header from "@/components/header";
import { UpgradeModalProvider } from "@/contexts/ModalContext";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <UpgradeModalProvider>
        <Header />
        <Suspense
          fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
        >
          {children}
        </Suspense>
      </UpgradeModalProvider>
    </div>
  );
};

export default layout;
