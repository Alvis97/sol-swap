"use client"

import React, { useState } from 'react'
import { X } from 'lucide-react'

type SwapInfoProps = {
  slippageBps: number
  setSlippageBps: (slippage: number) => void
  solPrice: number | null
}

const SLIPPAGE_OPTIONS = [
  { label: '0.1', bps: 10 },
  { label: '0.5', bps: 50 },
  { label: '1', bps: 100 },
]

function SwapInfo({ slippageBps, setSlippageBps, solPrice }: SwapInfoProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className='relative flex w-full px-4 pt-2 mb-2 items-center justify-between'>
        <div className='card-inside flex justify-center items-center p-3 mr-4 w-fit text-xs'>
          <p>1 SOL = {solPrice != null ? solPrice.toFixed(2) : '...'} USDC</p>
        </div>
        <button
          className='flex justify-center items-center button-base text-xs p-3 rounded-xl'
          onClick={() => setModalOpen(true)}
          aria-haspopup="dialog"
        >
          {slippageBps / 100}%
        </button>
      </div>

      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className='fixed inset-0 z-50 flex items-center justify-center bg-stone-500/10 backdrop-blur-md'
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="slippage-title"
            onClick={(e) => e.stopPropagation()}
            className='relative flex w-80 flex-col gap-4 rounded-2xl bg-[var(--darkColor)] p-6 text-sm'
          >
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              className='absolute right-4 top-4 text-stone-400 hover:text-stone-200'
            >
              <X size={18} />
            </button>

            <h2 id="slippage-title" className='font-semibold text-base'>
              Slippage tolerance
            </h2>
            <p className='text-[var(--foreground)]/60 text-xs'>
              The most the price may move against you before the swap is rejected.
            </p>

            <div className='flex justify-between'>
              {SLIPPAGE_OPTIONS.map(({ label, bps }) => (
                <button
                  key={bps}
                  onClick={() => setSlippageBps(bps)}
                  aria-pressed={slippageBps === bps}
                  className={`button-base h-[55px] w-[55px] text-xs rounded-full ${slippageBps === bps ? 'is-active' : ''}`}
                >
                  {label}%
                </button>
              ))}
            </div>

            <button
              className='button-base w-full p-2 text-xs rounded-xl'
              onClick={() => setModalOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default SwapInfo