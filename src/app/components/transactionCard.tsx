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
import { ArrowUpDown, LoaderCircle } from 'lucide-react';
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

type SwapState = "connect" | "loading" | "enter" | "insufficient" | "limit" | "ready"

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
    //const [newBalance, setNewBalance] = useState<number | null>(null);
    const [solPrice, setSolPrice] = useState<number | null>(null)
    const [slippageBps, setSlippageBps] = useState<number>(50) //0.5 slippage
    const [minimumReceived, setMinimumReceived] = useState<number | null>(null);
    const [quote, setQuote] = useState<any | null>(null)

    //Fromcard
    const [amountText, setAmountText] = useState("")
    const [activeMaxButton, setActiveMaxButton] = useState(false);

    const [ isQuoteLoading, setisQuoteLoading ] = useState(false)

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
    
    const MAX_USD = 2

    const maxAmount = 
        fromCurrency === "USDC" 
            ? MAX_USD
            : solPrice != null
            ? MAX_USD / solPrice
            : null

    const exceedsLimit = fromAmount != null && maxAmount != null && fromAmount > maxAmount

    const swapState: SwapState = !isConnected
  ? "connect"
  : isLoading
  ? "loading"
  : !fromAmount
  ? "enter"
  : insufficientFunds
  ? "insufficient"
  : exceedsLimit
  ? "limit"
  : "ready"

const buttonText: Record<SwapState, string> = {
  connect: "Connect wallet",
  loading: "Swapping ",
  enter: "Amount required",
  insufficient: "Insufficient balance",
  limit: "Max $2 per swap(demo)",
  ready: "Swap Token",
}

const buttonStyle: Record<SwapState, string> = {
  connect: "button-base border border-violet-800 bg-[var(--focusRing)] text-violet-800 hover:bg-violet-800 hover:text-white",
  ready: "button-base border border-emerald-700 bg-[var(--focusRing)] text-emerald-600 hover:bg-emerald-500 hover:text-white cursor-pointer dark:border-emerald-600 dark:text-emerald-600",
  loading: "card-inside bg-[var(--submitBtn)]  text-[var(--foreground)]/90 cursor-not-allowed animate-pulse",
  enter: "border text-[var(--foreground)]/40 cursor-not-allowed",
  limit: "card-base border rounded-xl border-red-600 text-red-500 cursor-not-allowed",
  insufficient: "card-base border rounded-xl border-red-600 text-red-500 cursor-not-allowed",
}
  

    //Get quote
    useEffect(() => {
        const fromAmountNum = (fromAmount);
 
        if (!fromAmount || !slippageBps ) {
            setToAmount(null)
            //setFromAmount(null)
            setMinimumReceived(null)
            setisQuoteLoading(false)
            return
        }    

        let cancelled = false
            setisQuoteLoading(true)


        const timer = setTimeout(async () => {

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
                setMinimumReceived(Number(q.otherAmountThreshold) / outputDecimals)
            
            } catch (err) {
                console.log(err)
            } finally {
                if (!cancelled) setisQuoteLoading(false)
            } 
        }, 500)
    
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
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
            setFromAmount(null)
            setToAmount(null)
            setAmountText("")
            setActiveMaxButton(false)
        }

        //Handle swap click
        function handleSwap() {

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

                    console.log(fromAmount, toAmount);

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
                    setMinimumReceived(null)

                } catch(err) {
                    console.error("Swap failed:", err)
                    setSwapError(err instanceof Error ? err.message : "Something went wrong")
                    setSwapSuccess(false)
                    setModalOpen(true)
                } finally {
                    setIsLoading(false)

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
       amountText={amountText}
       setAmountText={setAmountText}
       activeMaxButton={activeMaxButton}
       setActiveMaxButton={setActiveMaxButton}
       maxAmount={maxAmount}
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
       quoteLoading={isQuoteLoading}    
       />

       { publicKey && connection && (
       <InfoCard 
        transactionFee={BASE_FEE_SOL}
        slippageBps={slippageBps}
        minimumReceived={minimumReceived}
        />
       )}



        <button
        className={`p-3 m-3 w-80 flex justify-center items-center rounded-2xl font-semibold transition ${buttonStyle[swapState]}`}
        onClick={handleSwap}
        disabled={isLoading || isNotReady}
        >
        {buttonText[swapState]}
        { swapState === "loading" && ( <LoaderCircle size={16} className='animate-spin'/> ) }
        </button>


        { modalOpen && (
            <ResultModal
                isOpen={modalOpen}
                  onClose={() => {
                setModalOpen(false)
                if (swapSuccess) {
                setToAmount(null)
                setFromAmount(null)
                setMinimumReceived(null)
                }
            }}
                success={swapSuccess}
                txid={txid}
                fromAmount={fromAmount}
                fromCurrency={fromCurrency}
                toAmount={toAmount}
                toCurrency={toCurrency}
                error={swapError}
            />
        )}

        <p>Demo, use small amount. Runs on Mainnet!</p>

    </div>
  )
}

export default TransactionCard