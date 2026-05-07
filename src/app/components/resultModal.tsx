"use client"

import React from 'react'
import { CheckCircle, XCircle, ExternalLink, X } from 'lucide-react'

type ResultModalProps = {
    isOpen: boolean
    onClose: () => void
    success: boolean
    txid?: string
    fromAmount: string
    fromCurrency: string
    toAmount: string
    toCurrency: string
    error?: string
}

function resultModal({ isOpen, onClose, success, txid, fromAmount, fromCurrency, toAmount, toCurrency, error }: ResultModalProps) {
     if (!isOpen) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/50'>
      <div className='bg-stone-900 border border-stone-700 rounded-2xl p-6 w-80 flex flex-col gap-4'>
        
        <button onClick={onClose} className='absolute top-4 right-4 text-stone-400 hover:text-stone-600'>
          <X size={18} />
        </button>

        <div className='flex flex-col items-center gap-2'>
            {success 
            ? <CheckCircle size={48} className='text-green-500' />
            : <XCircle size={48} className='text-red-500' />
          }
          <h2 className='font-semibold text-lg'>
            {success ? "Swap was Successfull!" : "Swap Failed :("}
          </h2>
        </div>

          {success && (
          <div className='bg-stone-100 dark:bg-stone-900 rounded-xl p-4 flex flex-col gap-1 text-sm'>
            <div className='flex justify-between'>
              <span className='text-stone-500'>Skickade</span>
              <span className='font-medium'>{fromAmount} {fromCurrency}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-stone-500'>Fick</span>
              <span className='font-medium'>{toAmount} {toCurrency}</span>
            </div>
          </div>
        )}

        {!success && error && (
          <p className='text-sm text-red-400 text-center'>{error}</p>
        )}

        {success && txid && (
          <a
            href={`https://solscan.io/tx/${txid}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-500'
          >
            View Transaction on Solscan <ExternalLink size={14} />
          </a>
        )}

        <button className='button-submit p-2 w-full'>
          Stäng
        </button>

      </div>
    </div>
  )
}

export default resultModal