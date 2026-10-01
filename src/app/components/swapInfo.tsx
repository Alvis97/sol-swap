"use client"

import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react'
import { getSolPrices } from '../../../lib/prices';

type SwapInfoProps = {
    slippageBps: number
    setSlippageBps: (slippage: number) => void
}

const SLIPPAGE_OPTIONS = [
    { label: '0.1', bps: 10 },
    { label: "0.5", bps: 50 },
    { label: "1", bps: 100},
] 

function swapInfo({ slippageBps, setSlippageBps } : SwapInfoProps ) {
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ currentValue, setCurrentValue ] = useState("");

    useEffect(() => {
    async function fetchPrice() {
   try{
        const price = await getSolPrices()
        setCurrentValue(price.toString())
    } catch(err) {
      console.error(err);
    }
    }
 
    fetchPrice()
    const interval = setInterval(fetchPrice, 30000)
    
    return () => clearInterval(interval);
  }, [])

  return (
    <div className='flex w-full px-4 pt-2 mb-2 items-center justify-end'>

    {/* modal */}
    { modalOpen === true && (
        <div 
        onClick={()=> setModalOpen(false)} 
        className='fixed flex inset-0 z-50 bg-black/50 justify-center items-center'>
            
            <div 
            className='flex flex-col w-xs p-5 text-sm items-end rounded-sm bg-[var(--background)]'
            onClick={(e) => e.stopPropagation()}>
                <button
                onClick={()=> setModalOpen(false)}>
                    x
                </button>
                <div className='flex flex-col w-full items-start'>
                <p>Select your slippage:</p>
                <div className='flex my-5 w-45 justify-between'>
         
                {SLIPPAGE_OPTIONS.map(({ label, bps }) => (
                    <button
                    key={bps}
                    onClick={() => setSlippageBps(bps)}
                    className={`${slippageBps === bps ? 'card-inside' : 'button-base'} h-[50px] w-[50px] rounded-full`}
                    >
                    {label}    
                    </button>
                ))}
                </div>
                <button className='button-submit bg-[var(--hoverColor)] text-xs py-3 px-4 mt-5' onClick={()=> setModalOpen(false)}>Select</button>
                </div>
         </div>
        </div> 
        )}  

        <div className='card-inside flex justify-center items-center  p-3 mr-4 w-fit text-xs'>
            <p>1 SOL = {currentValue} USDC</p>
        </div>
        <div>
            <button 
            className='flex justify-center items-center button-base text-xs p-3'
            onClick={()=> setModalOpen(true)}>
                {slippageBps/100}%
            </button>
        </div>
    </div>
  )
}

export default swapInfo