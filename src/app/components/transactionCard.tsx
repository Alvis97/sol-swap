"use client"

import React, { useEffect, useState } from 'react'
import SwapCard from './fromCard'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getSolBalance, getUsdBalance } from '../../../lib/wallet';
import FromCard from './fromCard';
import ToCard from './toCard';
import { getSolPrices } from '../../../lib/prices';
import InfoCard from './infoCard';
import SwapInfo from './swapInfo';
import { ArrowUpDown } from 'lucide-react';
import { getQuote, SOL_MINT, USDC_MINT } from '../../../lib/jupiter'
import { PublicKey } from '@solana/web3.js';
import { VersionedTransaction } from '@solana/web3.js'
import ResultModal from './resultModal';
import { verifySwapTx } from '../../../lib/verifyTx';
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

const DECIMALS: Record<string, number> = {
  SOL: 1e9,
  USDC: 1e6,
}

type SwapState = "connect" | "loading" | "enter" | "insufficient" | "ready"

function TransactionCard() {
    const { publicKey, signTransaction } = useWallet()
    const { connection } = useConnection()

    const { setVisible } = useWalletModal()

    const [fromCurrency, setFromCurrency] = useState("USDC")
    const toCurrency = fromCurrency === "USDC" ? "SOL" : "USDC"

    const [fromAmount, setFromAmount] = useState<number | null>(null)
    const [toAmount, setToAmount] = useState<number | null>(null)

    const [usBalance, setUsBalance] = useState<number>();
    const [solBalance, setSolBalance] = useState<number>();
    const [newBalance, setNewBalance] = useState<number | null>(null);

    const [solPrice, setSolPrice] = useState<number | null>(null)
    const [slippageBps, setSlippageBps] = useState<number>(50) //0.5 slippage
    const [minimumReceived, setMinimumReceived] = useState<number | null>(null);
    const [quote, setQuote] = useState<any | null>(null)

    const [isLoading, setIsLoading ] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [swapSuccess, setSwapSuccess] = useState(false)
    const [txid, setTxid] = useState("")
    const [swapError, setSwapError] = useState("")

    const BASE_FEE_SOL = 0.000005;
    const isConnected = !!publicKey
    const balance = fromCurrency === "USDC" ? usBalance : solBalance
    const insufficientFunds = balance != null && fromAmount != null && fromAmount > balance
    const isNotReady = isConnected && (!fromAmount || insufficientFunds)

    const swapState: SwapState = !isConnected
  ? "connect"
  : isLoading
  ? "loading"
  : !fromAmount
  ? "enter"
  : insufficientFunds
  ? "insufficient"
  : "ready"

const buttonText: Record<SwapState, string> = {
  connect: "Connect wallet",
  loading: "Swapping...",
  enter: "Swap Token",
  insufficient: "Insufficient balance",
  ready: "Swap Token",
}

const buttonStyle: Record<SwapState, string> = {
  connect: "bg-violet-800 text-white hover:bg-violet-700",
  ready: "bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer",
  loading: "card-inside text-[var(--foreground)]/50 cursor-not-allowed animate-pulse",
  enter: "button-base text-[var(--foreground)]/50 cursor-not-allowed",
  insufficient: "button-base bg-red-800 cursor-not-allowed",
}
  

    //Get quote
    useEffect(() => {
        const fromAmountNum = (fromAmount);
 
        if (!fromAmount || !slippageBps ) return

        let cancelled = false
    
        async function fetchQuote() {

            try{
                const toCurrency = fromCurrency === "USDC" ? "SOL" : "USDC"
                //checking what currency
                const inputMint = fromCurrency === "USDC" ? USDC_MINT : SOL_MINT
                const outputMint = fromCurrency === "USDC" ? SOL_MINT : USDC_MINT
                const inputDecimals = DECIMALS[fromCurrency]
                const outputDecimals = DECIMALS[toCurrency]

                const amount = Math.floor(fromAmount! * inputDecimals)
                const q = await getQuote(inputMint, outputMint, amount, slippageBps)
                if (cancelled) return 

                setQuote(q)
                setToAmount(Number(q.outAmount) / outputDecimals)
                console.log("to amount:", toAmount)
                setMinimumReceived(Number(q.otherAmountThreshold) / outputDecimals)
            } catch (err) {
                console.log(err)
            }    

        } 
        fetchQuote()
        }, [fromAmount, fromCurrency, slippageBps])


        //Fetch SOL-prices
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
                const interval = setInterval(fetchPrices, 30000)
                return () => clearInterval(interval);
        }, [publicKey, connection])

        //fetch USDC balance 
        useEffect(() => {
            async function fetchBalance() {
                const usdcBal = await getUsdBalance(publicKey!, connection)
                setUsBalance(usdcBal);
            }
           fetchBalance()
        }, [publicKey, connection])

        //fetch SOL balance 
        useEffect(() => {
            async function fetchBalance() {
                const solBal = await getSolBalance(publicKey!, connection)
                setSolBalance(solBal);
            }
           fetchBalance()
        }, [publicKey, connection])


        //Switch cards
        function SwitchCards() {
            setFromCurrency(toCurrency)
            setFromAmount(toAmount)
        }

        //Handle swap click
        function handleSwap() {
              console.log("clicked, publicKey:", publicKey?.toString())
            if(!publicKey) {
                setVisible(true)
                return
            }
            ExecudeSwap()
        }

        //ExecudeSwap
        async function ExecudeSwap() {
            if(!publicKey || !signTransaction) return
            if(!fromAmount || !slippageBps ) return

                setIsLoading(true)
                try {
                    const inputMint = fromCurrency === "USDC" ? USDC_MINT : SOL_MINT 
                    const outputMint = fromCurrency === "USDC" ? SOL_MINT : USDC_MINT
                    const amount = (fromAmount) * (fromCurrency === "USDC" ? 1e6 : 1e9)

                    //get quote step 1
                    const quote = await getQuote(inputMint, outputMint, amount, slippageBps)
                    console.log("Step one done", quote);

                    //get swaptransaction from jupiter step 2
                    const swapRes = await fetch("/api/swap", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            quoteResponse: quote,
                            userPublicKey: publicKey.toString(),
                            })
                        })

                        if (!swapRes.ok) {
                            const  { error } = await swapRes.json()
                            throw new Error(error || "Failed to build swap transaction")
                        }

                        const { swapTransaction } = await swapRes.json()
                    console.log("step 2 done", swapRes);

                    //Convert transaction step 3
                    const transaction = VersionedTransaction.deserialize(
                        Buffer.from(swapTransaction, "base64")
                    )
                    console.log("Step 3 done", transaction)

                    verifySwapTx(transaction, publicKey)

                    //Sign Transaction step 4
                    const signedTx = await signTransaction(transaction)
                    console.log("Step 4 done", signedTx);

                    //send transaction step 5
                    const txid = await connection.sendRawTransaction(signedTx.serialize())
                    console.log("step 5 done", txid);

                    // confirm transaction step 6
                    const res = await connection.confirmTransaction(txid, "confirmed")
                    if (res.value.err) {
                        throw new Error("Transaction failed on-chain")
                    }
                    console.log("Successfull Swap step 6", txid)
                    setTxid(txid)
                    setSwapSuccess(true)
                    setModalOpen(true)

                } catch(err) {
                    console.error("Swap failed:", err)
                    setSwapError(err instanceof Error ? err.message : "Something went wrong")
                    setSwapSuccess(false)
                    setModalOpen(true)
                } finally {
                    setIsLoading(true)
                }
        }

  return (
    <div className='flex flex-col w-fit h-full items-center justify-center'>

        <SwapInfo
          slippageBps={slippageBps}
          setSlippageBps={setSlippageBps}
          solPrice={solPrice}
        />

       <FromCard
       amount={fromAmount}
       setAmount={setFromAmount}
       currency={fromCurrency}
       setCurrency={setFromCurrency}
       />

        <div className='relative flex flex-row justify-between items-center w-[90%] py-0'>
            <hr  className='w-full text-stone-400'/>
            <button 
                className='button-submit p-3 mx-3'
                onClick={SwitchCards}>
                <ArrowUpDown size={18}/>
            </button>
            <hr  className='w-full text-stone-400'/>
        </div>
        
       <ToCard
       newAmount={toAmount}
       currency={toCurrency}
       usBalance={usBalance}
       solBalance={solBalance}
       />

       <InfoCard 
        transactionFee={BASE_FEE_SOL}
        slippageBps={slippageBps}
        minimumReceived={minimumReceived}    
        />

        <button
        className={`p-3 m-3 w-80 rounded-2xl font-semibold transition ${buttonStyle[swapState]}`}
        onClick={handleSwap}
        disabled={isLoading || isNotReady}
        >
        {buttonText[swapState]}
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