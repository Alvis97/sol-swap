"use client"

import React, { ReactNode, useState } from 'react'
import Providers from './providers'
import { ChevronLeft } from 'lucide-react';

function navigation({children} : {children : ReactNode }) {
    const [open, setOpen] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState("Mainet");
  return (
    <div className='flex fixed top-0 left-0 w-full z-50 justify-end content-center p-2 bg-[var(--background)]'>
        <div className='content-center mx-4'>
        <button
        className='flex button-base w-[105px] p-3 rounded-xl cursor-pointer justify-between items-center'
        onClick={()=> setOpen(!open)}
        >
           {selectedNetwork}
            <ChevronLeft size={"15px"} className={`transition-transform duration-200 ${open ? '-rotate-90' : ''}`}/>
        </button>
        { open && (
        <div 
        className='absolute flex flex-col mt-1 w-[105px]'
        >
            <button
                className='button-base w-fill flex items-center p-3 rounded-md'
                onClick={()=> {
                    setSelectedNetwork(selectedNetwork === "Mainet" ? "Devnet" : "Mainet")  
                    setOpen(false)
                }}>
                {selectedNetwork === "Mainet" ? "Devnet" : "Mainet"}
            </button>
        </div>
        )}
   
        </div>
     
        <Providers selectedNetwork={selectedNetwork}>
          {children}
        </Providers>
    </div>
  )
}

export default navigation