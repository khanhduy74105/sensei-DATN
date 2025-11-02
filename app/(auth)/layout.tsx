import React from "react";
interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div className="flex justify-center pt-30">{children}</div>;
};

export default AuthLayout;
