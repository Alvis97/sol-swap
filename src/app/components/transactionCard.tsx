"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getSolBalance, getUsdBalance } from '../../../lib/wallet';
import FromCard from './fromCard';
import ToCard from './toCard';
import { getSolPrices } from '../../../lib/prices';
import InfoCard from './infoCard';
import SwapInfo from './swapInfo';
import { ArrowUpDown, LoaderCircle } from 'lucide-react';
import { getQuote, SOL_MINT, USDC_MINT } from '../../../lib/jupiter'
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

    
    const MAX_USD = 2

    const maxAmount = 
        fromCurrency === "USDC" 
            ? MAX_USD
            : solPrice != null
            ? MAX_USD / solPrice
            : null

    const exceedsLimit = isConnected && fromAmount != null && maxAmount != null && fromAmount > maxAmount

    const estimate =
  solPrice && fromAmount
    ? fromCurrency === "USDC"
      ? fromAmount / solPrice
      : fromAmount * solPrice
    : null

const shownTo = isConnected ? toAmount : estimate

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
  connect: "button-connect bg-violet-800 hover:bg-violet-900",
  ready: "button-connect bg-emerald-700 cursor-pointer dark:bg-emerald-600 hover:bg-emerald-700 dark:text-[var(--foreground)]",
  loading: "card-inside bg-[var(--submitBtn)] text-[var(--foreground)]/90 cursor-not-allowed animate-pulse",
  enter: "border text-[var(--foreground)]/40 cursor-not-allowed",
  limit: "card-base border rounded-xl border-red-600 text-red-500 cursor-not-allowed",
  insufficient: "card-base border rounded-xl bg-red-600 cursor-not-allowed",
}
  

    //Get quote
    useEffect(() => {
        const fromAmountNum = (fromAmount);
 
        if (!isConnected || exceedsLimit || !fromAmount || !slippageBps ) {
            setToAmount(null)
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
        }, [fromAmount, fromCurrency, slippageBps, isConnected, exceedsLimit])


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

        //Fetch Balance
        const fetchBalances = useCallback(async () => {
            if (!publicKey) return
            try{
                const [usdc, sol] = await Promise.all([
                    getUsdBalance(publicKey, connection),
                    getSolBalance(publicKey, connection),
                ])
                setUsBalance(usdc)
                setSolBalance(sol)
            } catch(err) {
              console.error("Failed to fetch balances: ", err)
            }
        }, [publicKey, connection])

        useEffect(() => {
            fetchBalances()
        }, [fetchBalances])

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
            if (isLoading) return

                setIsLoading(true)
                try {
                    const inputMint = fromCurrency === "USDC" ? USDC_MINT : SOL_MINT 
                    const outputMint = fromCurrency === "USDC" ? SOL_MINT : USDC_MINT
                    const amount = Math.floor(fromAmount * (fromCurrency === "USDC" ? 1e6 : 1e9))

                    //get quote step 1
                    const quote = await getQuote(inputMint, outputMint, amount, slippageBps)

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

                    //Convert transaction step 3
                    const transaction = VersionedTransaction.deserialize(
                        Buffer.from(swapTransaction, "base64")
                    )

                    verifySwapTx(transaction, publicKey)

                    //Sign Transaction step 4
                    const signedTx = await signTransaction(transaction)

                    const latest = await connection.getLatestBlockhash()

                    //send transaction step 5
                    const txid = await connection.sendRawTransaction(signedTx.serialize(), {
                        skipPreflight: true,
                        maxRetries: 3,
                    })

                    // confirm transaction step 6
                    const res = await connection.confirmTransaction(
                    {
                        signature: txid,
                        blockhash: latest.blockhash,
                        lastValidBlockHeight: latest.lastValidBlockHeight,
                    },
                "confirmed"
                )
                    if (res.value.err) {
                        throw new Error("Transaction failed on-chain")
                    }
                    setTxid(txid)
                    setSwapSuccess(true)
                    setModalOpen(true)
                    setMinimumReceived(null)
                    fetchBalances()

                } catch(err) {
                    console.error("Swap failed:", err)
                    setSwapError(err instanceof Error ? err.message : "Something went wrong")
                    setSwapSuccess(false)
                    setModalOpen(true)
                    setMinimumReceived(null)
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

        <div className='relative flex flex-col items-center w-[90%] py-0'>
        <FromCard 
        balance={balance}
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

        <button 
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40  button-submit rounded-full flex items-center justify-center  p-2 h-10 w-10'
        onClick={SwitchCards}>
            <ArrowUpDown size={22}/>
        </button>

            
        <ToCard
        currency={toCurrency}
        usBalance={usBalance}
        solBalance={solBalance}
        quoteLoading={isQuoteLoading}  
        shownTo={shownTo}  
        />
        </div>   


       { publicKey && connection && (
       <InfoCard 
        transactionFee={BASE_FEE_SOL}
        slippageBps={slippageBps}
        minimumReceived={minimumReceived}
        currency={toCurrency}
        />
       )}

        <button
        className={`p-3 m-3 w-80 flex justify-center items-center rounded-2xl font-semibold transition ${buttonStyle[swapState]}`}
        onClick={handleSwap}
        disabled={swapState !== "connect" && swapState !== "ready"}
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
                setAmountText("")
                setActiveMaxButton(false)
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

    </div>
  )
}

export default TransactionCard