"use client"

import Image from "next/image";
import SwapInfo from "./components/swapInfo";
import TransactionCard from "./components/transactionCard";
import { useState } from "react";
import { ChartSpline, ArrowDownUp, History } from 'lucide-react';

export default function Home() {
   const [selectedCard, setSelectedCard] = useState("swap")
   

  return (
      <main className="flex flex-col w-full h-full p-2 pb-5 justify-center items-center">
        
        {/* card display */}
        <div className="flex-1">
          { selectedCard === "swap" && <TransactionCard/>}
          { selectedCard === "chart" && <p> Chart </p>}
          { selectedCard === "history" && <p> HIstory</p>}
        </div>

        {/* bottom navigation */}
        <div className="card-base flex items-center justify-between p-3 w-40 ">

          <button 
          onClick={() => setSelectedCard("swap")}
          className={selectedCard === "swap" ? "text-black" : "text-stone-400"}
          >
            <ArrowDownUp size={selectedCard === "swap" ? 28 : 24}/>
          </button>

          <button 
          onClick={() => setSelectedCard("chart")}
             className={selectedCard === "chart" ? "text-black" : "text-stone-400"}
          >
            <ChartSpline size={selectedCard === "chart" ? 28 : 24}/>
            </button>

          <button 
          onClick={() => setSelectedCard("history")}
             className={selectedCard === "history" ? "text-black" : "text-stone-400"}
          >
            <History size={selectedCard === "history" ? 28 : 24}/>
            </button>

        </div>
         
      </main>
  );
}
