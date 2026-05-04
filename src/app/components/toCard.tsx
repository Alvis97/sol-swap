"use client"

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react'
import { getSolBalance, getUsdBalance } from '../../../lib/wallet';
import { getSolPrices } from '../../../lib/prices';

type ToCardProps = {
    currency: string
    fromAmount: string
    toAmount: string
}

function ToCard({fromAmount, currency, toAmount}: ToCardProps) {
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);
    const [convertedBalance, setConvertedBalance] = useState<number | null>(null)
    const { publicKey } = useWallet();
    const { connection } = useConnection()
    
    useEffect(() => {
        if (!publicKey) return;
            
        async function fetchBalance() {
        try{
            if (currency === "USDC"){
                const usdcBal = await getUsdBalance(publicKey!, connection)
                const solPrice = await getSolPrices()
                const convertedBal = usdcBal / solPrice
                setBalance(usdcBal)
                setConvertedBalance(convertedBal)

            } else if (currency === "SOL") {
                const bal= await getSolBalance(publicKey!, connection);
                const solPrice = await getSolPrices()
                const convertedBal = bal * solPrice // SOL * price = USDC 
                setBalance(bal);
                setConvertedBalance(convertedBal)
            }

        } catch(err) {
            console.error(err);
        }
    }
    fetchBalance()
    }, [publicKey, connection, currency])

  return (
        <div className='card-base flex flex-col justify-between w-80 h-30 m-4 p-3'>
        {/* top part */}
        <div className='flex justify-between items-center text-xs'>
            <p>To</p>
            <div className='flex items-center'>
                <p>Balance: {balance !== null ? balance.toFixed(2): "0.00"} {currency}</p>
            </div>
        </div>

        {/* bottom part */}
        <div className='flex items-center justify-between '>
            <div className='relative'>
                <div
                 className='button-base flex items-cente text-xs rounded-lg justify-between p-3'
                 >{currency}
                 </div>
            </div>
            <p className='flex justify-end w-40 text-4xl'>{toAmount ? parseFloat(toAmount).toFixed(2) : "0.00"}</p>
        </div>
    </div>
  )
}

export default ToCard