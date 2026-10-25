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
    <div className='card-base flex flex-col justify-between w-85 h-fit m-4 p-3'>
        {/* top part */}
        <div className='flex justify-between items-start text-xs mb-4'>
            <p className='font-extrabold'>From</p>
            <div className='flex items-start'>
                <p className='text-[var(--foreground)]/60'>Balance: {balanceText}</p>
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
                className={ `${activeMaxButton === true ? "card-inside" : "card-base"} rounded-lg  p-2 ml-4`}>
                    Max
                </button>
                )}

            </div>
        </div>

        {/* bottom part */}
        <div className='flex items-center justify-between '>
            <div className='relative'>
                <button
                 className='button-base flex w-fit items-center justify-between p-3 text-xs rounded-lg'
                 onClick={()=> setDropDownOpen(true)}
                 >{currency}
                  <CircleDollarSign size={15} className='ml-1'/>
                 </button>
                 {dropDownOpen === true && (
                    <div className='absolute top-full'>
                        <button
                        className='button-base rounded-lg w-17 p-3 mt-1'
                        onClick={()=> {
                            setCurrency(currency === "USDC" ? "SOL" : "USDC")
                            setDropDownOpen(false)
                            resetAmount()}}>
                            {currency === "USDC" ? "SOL" : "USDC"}
                        </button>
                    </div>
                 )}
            </div>
            <input 
            value={amountText}
            className='flex justify-end text-right w-40 text-4xl placeholder:text-[var(--foreground)]/100'
            type="text"
            inputMode='decimal'
            placeholder='o.00'
            onChange={(e) => {
                const value = e.target.value.replace(",", ".");
                if (!/^\d*\.?\d*$/.test(value)) return
                applyAmount(value);
                setActiveMaxButton(false)
            }}
             />
        </div>
    </div>
  )
}

export default FromCard