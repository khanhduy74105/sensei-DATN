// components/header.tsx (SERVER)
import { checkUser } from "@/lib/checkUser";
import HeaderClient from "./header-client";
import { getUserCredit } from "@/actions/payment";

export default async function Header() {
  await checkUser();
  
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
