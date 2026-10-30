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
    <div className='card-base flex flex-col justify-between w-85 h-38 m-3 p-4 px-4 sm:w-100 sm:h-40'>
        <p className='flex font-extrabold text-xs'>You Pay</p>
           
        {/* top part */}
        <div className='flex justify-between gap-7 items-end text-xs w-full mb-2 '>

            <input 
            value={amountText}
            className='flex min-w-0 text-3xl placeholder:text-[var(--foreground)]/60 mb-[-2] sm:text-4xl sm:mb-[-5]'
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
                    className='button-base relative z-10 w-27 flex items-center justify-between gap-0.5 rounded-full text-xs px-2 py-1 h-10 sm:text-base sm:w-30'
                    onClick={()=> setDropDownOpen(!dropDownOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={dropDownOpen}
                    >
                    {currency === "USDC" ? (
                        <TokenUSDC variant="branded" className='h-8 w-8 sm:h-10 sm:w-10 ' />
                    ) : (
                        <TokenSOL variant="branded" className='h-6 w-6 sm:h-8 sm:w-8' />
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
                            className='button-base flex h-10 w-full z-10 bg-[var(--background)] justify-evenly items-center rounded-full py-1 px-2 h-10 text-xs hover:bg-[var(--hoverColor)] sm:text-base'
                            onClick={()=> {
                                setCurrency(currency === "USDC" ? "SOL" : "USDC")
                                setDropDownOpen(false)
                                resetAmount()
                                }}
                            >
                            {currency !== "USDC" ? (
                            <TokenUSDC variant="branded" className='h-5 w-5 sm:h-7 sm:w-7' />
                            ) : (
                                <TokenSOL variant="branded" className='h-5 w-5 sm:h-6 sm:w-6' />
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