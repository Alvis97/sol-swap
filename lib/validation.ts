import { PublicKey } from "@solana/web3.js"
import z from "zod"
import { SOL_MINT, USDC_MINT } from "./jupiter"

const MAX_SOL_LAMPORTS = 25_000_000
const MAX_USDC_BASE = 2_000_000


const mint = z.enum([SOL_MINT, USDC_MINT])

export const quoteSchema = z
.object({
    inputMint: mint,
    outputMint: mint,
    amount: z.coerce.number().int().positive().max(1e15),
    slippageBps: z.coerce.number().int().min(1).max(300),
})
.refine((v) => v.inputMint !== v.outputMint, "Same mint")
.refine((v) => 
    v.inputMint === SOL_MINT
    ? v.amount <= MAX_SOL_LAMPORTS
    : v.amount <= MAX_USDC_BASE,
    "Amount above demo limit"
)

export const swapSchema = z.object({
    quoteResponse: z
    .object({
        inputMint: mint,
        outputMint: mint,
        inAmount: z.string(),
        slippageBps: z.number().int().max(300),
    })
    .passthrough(),
    userPublicKey: z.string().refine((k) => {
        try {
            new PublicKey(k)
            return true
        } catch {
            return false
        }
    }, "Invalid public key"),
})