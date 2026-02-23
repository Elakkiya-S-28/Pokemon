import { MainScreen } from "@/src/Container/pages";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <MainScreen />
    </div>
  );
}
