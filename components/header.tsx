// components/header.tsx (SERVER)
import HeaderClient from "./header-client";
import { getUserCredit } from "@/actions/payment";

export default async function Header() {
  
  const userCredit = await getUserCredit();

  return (
    <header
      id="main-header"
      className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
    >
      <HeaderClient userCredit={userCredit} />
    </header>
  );
}
