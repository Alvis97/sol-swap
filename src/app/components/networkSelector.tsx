"use client"

import React, { ReactNode, useState } from 'react'
import { ChevronLeft } from 'lucide-react';
import { useNetwork } from './networkContext';

function NetworkSelector() {
    const [open, setOpen] = useState(false);
    const { selectedNetwork, setSelectedNetwork } = useNetwork()

  return (
    <div className='content-center mx-4'>
        <button
            className='flex button-base w-[95px] p-2.5 text-xs rounded-xl cursor-pointer justify-between items-center'
            onClick={()=> setOpen(!open)}
        >
        {selectedNetwork}
        <ChevronLeft size={"15px"} className={`transition-transform duration-200 ${open ? '-rotate-90' : ''}`}/>
        </button>

    { open && (
    <div 
    className='absolute flex flex-col mt-1 w-[95px]'
    >
        <button
            className='button-base w-fill flex text-xs items-center p-2.5 rounded-md'
            onClick={()=> {
                setSelectedNetwork(
                    selectedNetwork === "Mainnet" ? "Devnet" : "Mainnet")  
                setOpen(false)
            }}>
            {selectedNetwork === "Mainnet" ? "Devnet" : "Mainnet"}
        </button>
    </div>
    )}
    </div>
  )
}

export default NetworkSelector