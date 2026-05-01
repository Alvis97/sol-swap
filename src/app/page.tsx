import Image from "next/image";
import SwapInfo from "./components/swapInfo";
import TransactionCard from "./components/transactionCard";

export default function Home() {
  return (
      <main className="flex w-full h-full justify-center items-center bg-sky-500">
        <TransactionCard/>  
      </main>
  );
}
