import { Transaction } from '@solana/web3.js'
import { CircleQuestionMark } from 'lucide-react'
import React from 'react'

type InfoCardProps = {
    transactionFee: string
    slippage: string
    minimumReceived: string
}

function InfoCard({ transactionFee, slippage, minimumReceived } : InfoCardProps ) {
  return (
    <div className='card-inside p-3 m-3 w-70 text-xs leading-4'>
        <p className='flex items-center gap-1'>
            Transaction fee 
            <span className='relative group'>
                <CircleQuestionMark size="16px" className='cursor-pointer'/>
                <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-80 p-2 rounded-md text-xs hidden group-hover:block bg-[var(--background)] border border-gray-200'>
                     A small fee charged to process your payment securely.
                </span> 
            </span>
          : {transactionFee}
        </p>
        <p className='flex items-center'>
            Slippage 
            <span className='relative group'>
                <CircleQuestionMark size="16px" className='cursor-pointer'/>
                <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-80 p-2 rounded-md text-xs hidden group-hover:block bg-[var(--background)] border border-gray-200'>
                    The difference between the expected price and the actual price
                    when your transaction is executed. Higher during volatile markets.
                </span>
            </span>
             : {slippage}
        </p>
        <p>Minimum received: {minimumReceived}</p>
    </div>
  )
}

export default InfoCard