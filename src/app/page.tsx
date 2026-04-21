import Image from "next/image";
import SwapInfo from "./components/swapInfo";

export default function Home() {
  return (
      <main className="flex-1 pt-16 w-full h-full bg-[var(--backgroung)]">
        <SwapInfo/>  
      </main>
  );
}
