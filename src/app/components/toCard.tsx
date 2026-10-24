"use client"

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { JSX, useEffect, useState } from 'react'
import { getSolBalance, getUsdBalance } from '../../../lib/wallet';
import { getSolPrices } from '../../../lib/prices';
import { stringify } from 'querystring';

type ToCardProps = {
    //newAmount: number | null;
    currency: string;
    usBalance: number | undefined;
    solBalance: number | undefined;
    quoteLoading: boolean;
    shownTo: number | null
}

function ToCard({ currency, usBalance, solBalance, quoteLoading, shownTo }: ToCardProps) {

        const { publicKey } = useWallet();
        const isConnected = !!publicKey
        const balance = currency === "USDC" ? usBalance : solBalance

  return (
        <div className='card-base flex flex-col justify-between w-85 h-25 m-4 p-3'>
        {/* top part */}
        <div className='flex justify-between items-center text-xs'>
            <p className='font-extrabold'>To</p>
            <div className='flex items-center'>
                { isConnected && (
                <p>
                    Balance: {(balance ?? 0).toFixed(2)} {currency}
                </p>
                )}
   
            </div>
        </div>

        {/* bottom part */}
        <div className='flex items-baseline justify-end '>
        { quoteLoading ? (
            <div className='flex h-10 w-30 rounded-xl bg-neutral-300 dark:bg-neutral-50/10 animate-pulse'></div>
        ) : (
        <p className='flex items-baseline justify-end w-100 text-4xl text-[var(--foreground)]/60'> 
            {shownTo != null 
                ? `${!isConnected ? "≈ " : ""}${shownTo.toFixed(4)}`
                 : "0.00"}
            <span className='text-xl'>{currency}</span></p>

        ) }
    
        </div>
    </div>
  )
}

export default ToCard