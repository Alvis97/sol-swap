import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { CircleQuestionMark } from 'lucide-react'
import React from 'react'

type InfoCardProps = {
    transactionFee: number | null
    slippageBps: number | null
    minimumReceived: number | null
    currency: string
}

function InfoCard({ transactionFee, slippageBps, minimumReceived, currency } : InfoCardProps ) {
    const { publicKey } = useWallet();
  return (
    <div className='card-inside flex flex-col justify-between px-4 py-3 m-3 w-90 text-xs text-[var(--foreground)]/60 leading-5'>
        <div className='flex justify-between'>
            <p>Minimum received </p>
            <p>{minimumReceived === null ? "---" : minimumReceived.toFixed(4)} {currency}</p>
        </div>

        <div className='flex justify-between'>
        <p className='flex items-center gap-1'>
            Network fee 
            <span className='relative group'>
                <CircleQuestionMark size="16px" className='cursor-pointer'/>
                <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-80 p-2 rounded-md text-xs hidden group-hover:block bg-[var(--hoverColor)] border border-[var(--borderColor)]'>
                     A small fee charged to process your payment securely.
                </span> 
            </span>
        </p>
        <p>{!publicKey ? "---" : transactionFee + " SOL"}</p>
        </div>

        <div className='flex justify-between'>
            <p className='flex items-center'>
            Slippage  
                <span className='relative group'>
                    <CircleQuestionMark size="16px" className='cursor-pointer mx-1'/>
                    <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-80 p-2 rounded-md text-xs hidden group-hover:block bg-[var(--hoverColor)] border border-[var(--borderColor)]'>
                        The difference between the expected price and the actual price
                        when your transaction is executed. Higher during volatile markets.
                    </span>
                </span>
            </p>
            <p>{slippageBps!/100}%</p>
        </div>

    </div>
  )
}

export default InfoCard