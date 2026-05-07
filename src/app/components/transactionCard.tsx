"use client"

import React, { useEffect, useState } from 'react'
import SwapCard from './fromCard'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getSolBalance } from '../../../lib/wallet';
import FromCard from './fromCard';
import ToCard from './toCard';
import { getSolPrices } from '../../../lib/prices';
import InfoCard from './infoCard';
import SwapInfo from './swapInfo';
import { ArrowUpDown } from 'lucide-react';
import { getQuote, SOL_MINT, USDC_MINT } from '../../../lib/jupiter'
import { useNetwork } from './networkContext';
import { PublicKey } from '@solana/web3.js';
import { VersionedTransaction } from '@solana/web3.js'
import ResultModal from './resultModal';

function TransactionCard() {
    const [fromCurrency, setFromCurrency] = useState("USDC")
    const [fromAmount, setFromAmount] = useState("")
    const [toAmount, setToAmount] = useState("")
    const toCurrency = fromCurrency === "USDC" ? "SOL" : "USDC"
    const [solPrice, setSolPrice] = useState<number | null>(null)
    const [slippage, setSlippage] = useState("0.5")
    const [transactionFee, setTransactionFee] = useState("")
    const [minimumReceived, setMinimumReceived] = useState("")
    const [ isLoading, setIsLoading ] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [swapSuccess, setSwapSuccess] = useState(false)
    const [txid, setTxid] = useState("")
    const [swapError, setSwapError] = useState("")
    const { selectedNetwork } = useNetwork()
    const { publicKey, signTransaction } = useWallet()
    const { connection } = useConnection()

    useEffect(() => {
        if (!fromAmount || !slippage) return

        async function fetchQuote() {
            if (selectedNetwork === "Devnet") {

                if (!solPrice) return

                try{
                    const result = fromCurrency === "USDC" 
                    ? parseFloat(fromAmount) / solPrice 
                    : parseFloat(fromAmount) * solPrice

                    setToAmount(result.toString())

                    const slippageNum = parseFloat(slippage)
                    const minReceived = result * (1 - slippageNum / 100)
                    setMinimumReceived(minReceived.toFixed(6))

                    setTransactionFee("0.000005")

                } catch(err) {
                    console.error(err)
                }

            } else {

                try{
                    const inputMint = fromCurrency === "USDC" ? USDC_MINT : SOL_MINT
                    const outputMint = fromCurrency === "USDC" ? SOL_MINT : USDC_MINT
                    const amount = parseFloat(fromAmount) * (fromCurrency === "USDC" ? 1e6 : 1e9)

                    const quote = await getQuote(inputMint, outputMint, amount, slippage)
                    setToAmount((quote.outAmount / 1e9).toString())
                    setMinimumReceived((quote.otherAmountThreshold / 1e9).toString())
                    setTransactionFee("0.000005")
                    console.log("quote:", quote)

                } catch(err) {
                    console.error(err)
                }
            }
        } 
      fetchQuote()
    }, [fromAmount, fromCurrency, slippage, solPrice])


    useEffect(() => {
        async function fetchPrices() {
            try{
                const price = await getSolPrices()
                setSolPrice(price)
            } catch(err) {
                console.error(err)
            }
        }
        fetchPrices()
    }, [])


    function SwitchCards() {
        setFromCurrency(toCurrency)
        setFromAmount(toAmount)
    }

    async function ExecudeSwap() {
        if(!publicKey || !signTransaction) return
        if(!fromAmount || !slippage ) return

        setIsLoading(true)

        try {
            const inputMint = fromCurrency === "USDC" ? USDC_MINT : SOL_MINT 
            const outputMint = fromCurrency === "USDC" ? SOL_MINT : USDC_MINT
            const amount = parseFloat(fromAmount) * (fromCurrency === "USDC" ? 1e6 : 1e9)

            //get quote
            const quote = await getQuote(inputMint, outputMint, amount, slippage)

            //get swaptransaction from jupiter
            const swapRes = await fetch("https://quote-api.jup.ag/v6/swap", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    quoteResponse: quote,
                    userPublickey: publicKey.toString(),
                    wrapAndUnwrapSol: true,
                })
              
            })

        const { swapTransaction } = await swapRes.json()

        //Sign
        const transaction = VersionedTransaction.deserialize(
            Buffer.from(swapTransaction, "base64")
        )

        const signedTx = await signTransaction(transaction)

        //send transaction
        const txid = await connection.sendRawTransaction(signedTx.serialize())

        // confirm
        await connection.confirmTransaction(txid, "confirmed")
        console.log("Successfull Swap", txid)
        setTxid(txid)
        setSwapSuccess(true)
        setModalOpen(true)

        } catch(err) {
            console.error("Swap failed:", err)
            setSwapError(err instanceof Error ? err.message : "Something went wrong")
            setSwapSuccess(false)
            setModalOpen(true)
        }
    }

  return (
    <div className='flex flex-col w-fit items-center'>

        <SwapInfo
          slippage={slippage}
          setSlippage={setSlippage}
        />

       <FromCard
       amount={fromAmount}
       setAmount={setFromAmount}
       currency={fromCurrency}
       setCurrency={setFromCurrency}
       />

        <div className='relative flex flex-col justify-center items-center w-full py-5'>
            <hr  className='w-[80%] text-stone-300'/>
            <button 
                className='absolute button-submit p-3'
                onClick={SwitchCards}>
                <ArrowUpDown size={18}/>
            </button>
        </div>
        
       <ToCard
       fromAmount={fromAmount}
       toAmount={toAmount}
       currency={toCurrency}/>

       <InfoCard 
        transactionFee={transactionFee.toString()}
        slippage={slippage.toString()}
        minimumReceived={minimumReceived}    
        />

       <button 
       className='button-submit p-3 m-3 w-80'
       onClick={ExecudeSwap}
       disabled={!publicKey || !fromAmount || isLoading}
       >
        {isLoading ? "Swapping..." : "Swap Token "}
        </button>


        { modalOpen && (
            <ResultModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                success={swapSuccess}
                txid={txid}
                fromAmount={fromAmount}
                fromCurrency={fromCurrency}
                toAmount={toAmount}
                toCurrency={toCurrency}
                error={swapError}
            />
        )}

    </div>
  )
}

export default TransactionCard