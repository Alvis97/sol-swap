"use client"

import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react'
import { getSolPrices } from '../../../lib/prices';


function swapInfo() {
  const [ modalOpen, setModalOpen ] = useState(false);
  const [ currentValue, setCurrentValue ] = useState("");
  const [ currentSlippage, setCurrentSlippage ] = useState("0,5");

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
    <div className='flex w-full px-4 pt-2 items-center justify-end'>

          {/* modal */}
        { modalOpen === true && (
        <div 
        onClick={()=> setModalOpen(false)} 
        className='fixed flex inset-0 z-50 bg-black/50 justify-center items-center'>
            <div 
            className='flex flex-col w-md p-5 items-end rounded-sm bg-[var(--background)]'
            onClick={(e) => e.stopPropagation()}>
                <button
                onClick={()=> setModalOpen(false)}>
                    x
                </button>
                <div className='flex flex-col w-full items-start'>
                <p>Select your slippage</p>
                <div className='flex my-5 w-45 justify-between'>
     <button 
                onClick={()=> setCurrentSlippage("0.1")}
                className={`${currentSlippage === "0.1" ? "card-inside" : "button-base"} h-[50px] w-[50px] rounded-full`}>
                    0,1
                </button>
                <button 
                    onClick={() => setCurrentSlippage("0.5")}
                    className={`${currentSlippage === "0.5" ? "card-inside" : "button-base"} h-[50px] w-[50px] rounded-full`}>
                    0,5
                </button>
                <button 
                    onClick={() => setCurrentSlippage("1")}
                    className={ `${currentSlippage === "1" ? "card-inside" : "button-base"} h-[50px] w-[50px] rounded-full`}>
                    1
                    </button>
                </div>
           
                <input 
                className='w-30 p-2 border rounded-md border-gray-300'
                type="number" 
                placeholder='Custom' 
                min="0.1"
                max="100"
                step="0.1"
                onBlur={(e) => setCurrentSlippage(e.target.value)}
                />

                <button className='button-submit bg-[var(--hoverColor)] p-3 mt-5' onClick={()=> setModalOpen(false)}>Submit</button>

                </div>
         </div>
        </div> 
        )}  
         



        <div className='card-inside flex justify-center items-center h-10 p-3 mr-4 w-fit text-xs'>
            <p>1 SOL = {currentValue} USDC</p>
            
        </div>

        <div>
            <button 
            className='flex justify-center items-center h-10 button-base text-xs p-3'
            onClick={()=> setModalOpen(true)}>
                {currentSlippage}%
            </button>
        </div>

    </div>
  )
}

export default swapInfo