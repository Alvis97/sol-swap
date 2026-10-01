import { PublicKey } from "@solana/web3.js"
import z from "zod"
import { SOL_MINT, USDC_MINT } from "./jupiter"


const mint = z.enum([SOL_MINT, USDC_MINT])

export const quoteSchema = z
.object({
    inputMint: mint,
    outputMint: mint,
    amount: z.coerce.number().int().positive().max(1e15),
    slippageBps: z.coerce.number().int().min(1).max(300),
})
.refine((v) => v.inputMint !== v.outputMint, "Same mint")

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