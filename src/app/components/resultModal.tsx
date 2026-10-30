"use client"

import React, { useEffect } from 'react'
import { CheckCircle, XCircle, ExternalLink, X, ArrowRight } from 'lucide-react'
import { TokenSOL, TokenUSDC } from '@web3icons/react'

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
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-stone-500/10 backdrop-blur-md'>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        className='relative bg-[var(--darkColor)] rounded-2xl p-6 w-80 flex flex-col items-center gap-4'
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
            {success ? "Swap Completed!" : "Swap Failed :("}
          </h2>

                          {success && txid && (
          <a
            href={`https://solscan.io/tx/${txid}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center gap-2 text-xs text-green-500 hover:text-blue-500'
          >
            View on Solscan <ExternalLink size={14} />
          </a>
        )}
        </div>



          {success && (
          <div className='rounded-xl p-4 flex gap-2 text-sm'>
            <div className='flex justify-between gap-1'>
              { fromCurrency === "USDC" ? (
                <TokenUSDC size={20} variant="branded" />
              ) : (
                <TokenSOL size={20} variant="branded" />
              )}
              <span className='font-medium'>{fromAmount?.toFixed(4)}</span>
            </div>
            <ArrowRight/>
            <div className='flex justify-between gap-1'>
              { toCurrency === "USDC" ? (
                <TokenUSDC size={20} variant="branded" />
              ) : (
                <TokenSOL size={20} variant="branded" />
              )}
              <span className='font-medium'>{toAmount?.toFixed(4)}</span>
            </div>
          </div>
        )}

        {!success && error && (
          <p className='text-sm text-center max-h-24 overflow-y-auto'>The price moved too much. Try again or increase slippage</p>
        )}



        <button 
        className='border border-[var(--foreground)]/60 text-[var(--foreground)]/60 rounded-xl bg-transparent p-2 mt-2 w-full '
        onClick={onClose}
        >
          Close
        </button>

      </div>
    </div>
  )
}

export default ResultModal