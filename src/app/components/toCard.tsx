"use client"

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { JSX, useEffect, useState } from 'react'
import { getSolBalance, getUsdBalance } from '../../../lib/wallet';
import { getSolPrices } from '../../../lib/prices';
import { stringify } from 'querystring';
import { TokenSOL, TokenUSDC } from '@web3icons/react';

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
        <div className='card-base flex flex-col justify-between w-85 h-38 m-3 p-4 px-4 sm:w-100 sm:h-40'>
        {/* top part */}
            <div className='flex justify-between items-center text-xs'>
                <p className='font-extrabold'>You Receive</p>
            </div>

            {/* bottom part */}
            <div className='flex items-baseline justify-between '>
                { quoteLoading ? (
                    <div className='flex h-10 w-30 rounded-xl bg-neutral-300 dark:bg-neutral-50/10 animate-pulse'></div>
                ) : (
                    <p className='flex items-baseline w-100 text-3xl text-[var(--foreground)]/40 min-w-0 sm:text-4xl'> 
                        {shownTo != null 
                            ? `${!isConnected ? "≈ " : ""}${shownTo.toFixed(4)}`
                            : "0.00"}
                    </p>
                ) }

                <p className='flex text-lg items-center gap-1'>
                {currency === "USDC" ? (
                        <TokenUSDC variant="branded" className="h-6 sm:h-10" />
                    ) : (
                        <TokenSOL variant="branded" className="h-6 sm:h-10" />
                    )}
                {currency}
                </p>
            </div>

            <div className='text-[var(--foreground)]/60 flex items-center justify-end text-xs h-8 pt-3 border-t border-stone-400'>
                { isConnected && (
                <p>
                    Balance: {(balance ?? 0).toFixed(2)} {currency}
                </p>
                )}
   
            </div>
    </div>
  )
}

export default ToCard