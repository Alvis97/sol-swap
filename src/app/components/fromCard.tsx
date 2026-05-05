"use client"

type FromCardProps = {
    amount: string
    setAmount: (amount: string) => void
    currency: string
    setCurrency: (currency: string) => void
}

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react'
import { getSolBalance, getUsdBalance } from '../../../lib/wallet';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

function FromCard({ amount, setAmount, currency, setCurrency }: FromCardProps) {
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);
    const [activeMaxButton, setActiveMaxButton] = useState(false);
    const [insufficientFounds, setInsufficientFunds] = useState(false)
    const { publicKey } = useWallet();
    const { connection } = useConnection()

    useEffect(() => {
 
        if (!publicKey) return;
         
        async function fetchBalance() {
        try{
            if (currency === "USDC") {
               const usdcBal = await getUsdBalance(publicKey!, connection)
               console.log("usdcBal:", usdcBal)
               setBalance(usdcBal)
            } else if (currency === "SOL") {
                const bal= await getSolBalance(publicKey!, connection);
                console.log("Solbalance:", bal)
                setBalance(bal);
            }
        } catch(err) {
            console.error("full error:", err);
        }
    }
    fetchBalance()
    }, [publicKey, connection, currency])

  return (
    <div className='card-base flex flex-col justify-between w-80 h-30 m-4 p-3'>
        {/* top part */}
        <div className='flex justify-between items-start text-xs'>
            <p>From</p>
            <div className='flex items-start'>
                { !publicKey ? (
                    <p className='text-rose-800'>Not Connected</p>
                ) 
                : (
                    <p>Balance: {balance !== null ? balance.toFixed(2): "0.00"} {currency}</p>
                )}
                <button 
                onClick={()=> {
                    if (balance !== null) {
                        setAmount(balance?.toString())
                        setActiveMaxButton(true)
                    }  
                }} 
                className={ `${activeMaxButton === true ? "card-inside" : "button-base"} rounded-lg  p-2 ml-4`}>
                    Max
                </button>
            </div>
        </div>

        {/* bottom part */}
        <div className='flex items-center justify-between '>
            <div className='relative'>
                <button
                 className='button-base flex w-17 items-center justify-between p-3 text-xs rounded-lg'
                 onClick={()=> setDropDownOpen(true)}
                 >{currency}
                 </button>
                 {dropDownOpen === true && (
                    <div className='absolute top-full'>
                        <button
                        className='button-base rounded-lg w-17 p-3 mt-1'
                        onClick={()=> {setCurrency(currency === "USDC" ? "SOL" : "USDC"); setDropDownOpen(false)}}>
                            {currency === "USDC" ? "SOL" : "USDC"}
                        </button>
                    </div>
                 )}
            </div>
            <input 
            value={amount}
            className='flex justify-end text-right w-40 text-4xl'
            type="text"
            inputMode='decimal'
            placeholder='o,00'
            onChange={(e) => {
                const value = e.target.value;
                setAmount(value);
                setActiveMaxButton(false)
                setInsufficientFunds(balance !== null && parseFloat(value) > balance)
            
            }}
             />
        </div>
        {insufficientFounds && (
    <p className="text-red-500 text-xs">Insufficient funds</p>
)}
    </div>
  )
}

export default FromCard