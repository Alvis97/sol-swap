"use client"

import React, { useEffect, useState } from 'react'
import SwapCard from './fromCard'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getSolBalance } from '../../../lib/wallet';
import FromCard from './fromCard';
import ToCard from './toCard';
import { getSolPrices } from '../../../lib/prices';
import InfoCard from './infoCard';
import SwapInfo from './swapInfo';
import { ArrowUpDown } from 'lucide-react';

function TransactionCard() {
    const [fromCurrency, setFromCurrency] = useState("USDC")
    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const toCurrency = fromCurrency === "USDC" ? "SOL" : "USDC"
    const [solPrice, setSolPrice] = useState<number | null>(null)

    useEffect(() => {
        async function fetchPrices() {
            try{
                const price = await getSolPrices()
                setSolPrice(price)
            } catch(err) {
                console.error(err)
            }
        }
        fetchPrices()
    }, [])


    useEffect(() => {
        console.log("fromAmount:", fromAmount)
        console.log("solPrice:", solPrice)

        if(!fromAmount || !solPrice) return

        if(fromCurrency === "USDC") {
            const result = ((parseFloat(fromAmount) / solPrice).toString())
            console.log("toAmont:", result)
            setToAmount(result);
        } else {
            setToAmount((parseFloat(fromAmount) * solPrice).toString())
        }
    }, [fromAmount, fromCurrency, solPrice])

  return (
    <div className='flex flex-col w-fit items-center'>

        <SwapInfo/>

       <FromCard
       amount={fromAmount}
       setAmount={setFromAmount}
       currency={fromCurrency}
       setCurrency={setFromCurrency}
       />

        <div className='relative flex flex-col justify-center items-center w-full py-5'>
            <hr  className='w-[80%] text-stone-300'/>
            <button className='absolute button-submit p-3'><ArrowUpDown size={18}/></button>
        </div>
        
       <ToCard
       fromAmount={fromAmount}
       toAmount={toAmount}
       currency={toCurrency}/>

       <InfoCard/>

       <button className='button-submit p-3 m-3 w-80'>Swap Token</button>
    </div>
  )
}

export default TransactionCard