"use client"

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { JSX, useEffect, useState } from 'react'
import { getSolBalance, getUsdBalance } from '../../../lib/wallet';
import { getSolPrices } from '../../../lib/prices';
import { stringify } from 'querystring';

type ToCardProps = {
    newAmount: number | null;
    currency: string;
    usBalance: number | undefined;
    solBalance: number | undefined;
}

function ToCard({newAmount, currency, usBalance, solBalance}: ToCardProps) {

  return (
        <div className='card-base flex flex-col justify-between w-85 h-25 m-4 p-3'>
        {/* top part */}
        <div className='flex justify-between items-center text-xs'>
            <p className='font-extrabold'>To</p>
            <div className='flex items-center'>
                <p>
                    Balance: {currency === "USDC" 
                    ? usBalance ?? "0.00" 
                    : solBalance?.toFixed(2) ?? "0.00"}{" "}
                    {currency}
                </p>
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
            <p className='flex justify-end w-40 text-4xl'>{newAmount ? newAmount.toFixed(2) : "0.00"}</p>
        </div>
    </div>
  )
}

export default ToCard