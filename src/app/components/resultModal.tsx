"use client"

import React, { useEffect } from 'react'
import { CheckCircle, XCircle, ExternalLink, X } from 'lucide-react'

type ResultModalProps = {
    isOpen: boolean
    onClose: () => void
    success: boolean
    txid?: string
    fromAmount: number | null
    fromCurrency: string
    toAmount: number | null
    toCurrency: string
    error?: string
}

function ResultModal({ isOpen, onClose, success, txid, fromAmount, fromCurrency, toAmount, toCurrency, error }: ResultModalProps) {
  
  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])
  
 

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/50'>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        className='relative bg-[var(--background)] border border-[var(--submitBtn)] rounded-2xl p-6 w-80 flex flex-col items-center gap-4'
      >
        
        <button onClick={onClose} aria-label="Close" className='absolute top-4 right-4 text-stone-400 hover:text-stone-600'>
          <X size={18} />
        </button>

        <div className='flex flex-col items-center gap-2'>
            {success 
            ? <CheckCircle size={48} className='text-green-500' />
            : <XCircle size={48} className='text-red-500' />
          }
          <h2 id="result-title" className='font-semibold text-base mt-2'>
            {success ? "Swap was Successful!" : "Swap Failed :("}
          </h2>
        </div>

          {success && (
          <div className='bg-mist-100 dark:bg-neutral-600 rounded-xl p-4 flex flex-col gap-1 text-sm'>
            <div className='flex justify-between'>
              <span className='text-neutral-400'>Sent:</span>
              <span className='font-medium'>{fromAmount?.toFixed(4)} {fromCurrency}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-neutral-400'>Received:</span>
              <span className='font-medium'>{toAmount?.toFixed(4)} {toCurrency}</span>
            </div>
          </div>
        )}

        {!success && error && (
          <p className='text-sm text-center max-h-24 overflow-y-auto'>The price moved too much. Try again or increase slippage</p>
        )}

        {success && txid && (
          <a
            href={`https://solscan.io/tx/${txid}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center gap-2 text-xs text-blue-400 hover:text-blue-500'
          >
            View Transaction on Solscan <ExternalLink size={14} />
          </a>
        )}

        <button 
        className='button-submit p-2 mt-2 w-full '
        onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  )
}

export default ResultModal