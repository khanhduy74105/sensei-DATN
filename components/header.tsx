// components/header.tsx (SERVER)
import { checkUser } from "@/lib/checkUser";
import HeaderClient from "./header-client";

export default async function Header() {
  await checkUser();

  return (
    <header
      id="main-header"
      className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
    >
      <HeaderClient />
    </header>
  );
}
