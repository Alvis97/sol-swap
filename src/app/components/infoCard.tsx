import { CircleQuestionMark } from 'lucide-react'
import React from 'react'

function InfoCard() {
  return (
    <div className='card-inside p-3 m-3 w-80 text-xs leading-4'>
        <p className='flex items-center'>Transaction fee <CircleQuestionMark size="16px"/> :</p>
        <p className='flex items-center'>Slippage <CircleQuestionMark size="16px"/> : </p>
        <p>Minimum received:</p>
        <p>Route: </p>
    </div>
  )
}

export default InfoCard