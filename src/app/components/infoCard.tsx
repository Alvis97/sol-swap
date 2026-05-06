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
        <p className='flex items-center'>Transaction fee <CircleQuestionMark size="16px"/> : {transactionFee}</p>
        <p className='flex items-center'>Slippage <CircleQuestionMark size="16px"/> : {slippage}</p>
        <p>Minimum received: {minimumReceived}</p>
        <p>Route: </p>
    </div>
  )
}

export default InfoCard