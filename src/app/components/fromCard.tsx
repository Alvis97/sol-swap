"use client"

type FromCardProps = {
    balance: number | null | undefined
    amount: number | null
    setAmount: (amount: number | null) => void
    currency: string
    setCurrency: (currency: string) => void
    amountText: string
    setAmountText: (amountText: string) => void
    activeMaxButton: boolean
    setActiveMaxButton: (activeMaxButton: boolean) => void
    maxAmount: number | null
}

import { useWallet } from '@solana/wallet-adapter-react';
import React, { useState } from 'react'
import { CircleDollarSign } from 'lucide-react'
import { TokenSOL, TokenUSDC } from '@web3icons/react'
import { ChevronDown } from 'lucide-react'

function FromCard({ balance, amount, setAmount, currency, setCurrency, amountText, setAmountText, activeMaxButton, setActiveMaxButton, maxAmount  }: FromCardProps) {
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const { publicKey } = useWallet();
    const balanceText = publicKey && balance != null ? `${balance.toFixed(2)} ${currency}` : "---"
 

        function applyAmount(text: string) {
           setAmountText(text)
           setAmount(text === "" ? null : Number(text))
        }

        function resetAmount() {
            setActiveMaxButton(false)
            applyAmount("")
        }

  return (
    <div className='card-base flex flex-col justify-between w-100 h-40 m-2 p-4 px-4'>
        <p className='flex font-extrabold'>You Pay</p>
           
        {/* top part */}
        <div className='flex justify-between gap-7 items-end text-xs w-full mb-2 '>

            <input 
            value={amountText}
            className='flex min-w-0 text-4xl placeholder:text-[var(--foreground)]/60 mb-[-5]'
            type="text"
            inputMode='decimal'
            placeholder='0.00'
            onChange={(e) => {
                const value = e.target.value.replace(",", ".");
                if (!/^\d*\.?\d*$/.test(value)) return
                applyAmount(value);
                setActiveMaxButton(false)
            }}
             />
            <div className='flex items-center justify-between'>
                <div className='relative'>

                {dropDownOpen && (
                    <div className='absolute -top-2 -left-2 -right-2 -bottom-14 z-0 rounded-3xl bg-stone-500/10 backdrop-blur-xs'/>
                )}    
                    <button
                    className='button-base relative z-10 w-30 flex items-center justify-between gap-0.5 rounded-full text-base px-2 py-1 h-10'
                    onClick={()=> setDropDownOpen(!dropDownOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={dropDownOpen}
                    >
                    {currency === "USDC" ? (
                        <TokenUSDC size={40} variant="branded" />
                    ) : (
                        <TokenSOL size={30} variant="branded" />
                    )}
                {currency}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ease-out ${dropDownOpen ? 'rotate-180' : 'rotate-0'}`}
                />
                </button>


                    {dropDownOpen && (
                        <div className=' absolute left-0 right-0 top-full z-10 mt-2'>
                            <button
                            className='button-base flex h-10 w-full z-10 bg-[var(--background)] justify-evenly items-center rounded-full py-1 px-2 h-10 text-s hover:bg-[var(--hoverColor)]'
                            onClick={()=> {
                                setCurrency(currency === "USDC" ? "SOL" : "USDC")
                                setDropDownOpen(false)
                                resetAmount()
                                }}
                            >
                            {currency !== "USDC" ? (
                            <TokenUSDC size={40} variant="branded" />
                            ) : (
                                <TokenSOL size={30} variant="branded" />
                            )}
                            {currency === "USDC" ? "SOL" : "USDC"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            </div>



            <div className='flex justify-between items-center w-full h-8 pt-3 border-t border-stone-400'>
         
                { publicKey && (
                <button 
                onClick={()=> {
                    if (activeMaxButton) {
                        resetAmount()
                        return
                    }

                    if (balance == null || maxAmount == null) return 

                    const spendable = currency === "SOL"
                        ? Math.max(balance - 0.01, 0)
                        : balance

                    const max = Math.min(spendable, maxAmount)
                    applyAmount((Math.floor(max * 1e6) / 1e6).toFixed(6))
                    setActiveMaxButton(true)
                    }  
                } 
                className={`max-btn rounded-lg text-xs px-2 py-1 ${activeMaxButton ? "is-active" : ""}`}>
                    Max
                </button>
                )}

                 <p className='text-[var(--foreground)]/60 text-xs'>Balance: {balanceText}</p>
                </div>
            </div>
  )
}

export default FromCard