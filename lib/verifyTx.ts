import { VersionedTransaction, PublicKey } from "@solana/web3.js"

const ALLOWED_PROGRAMS = new Set([
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4", // Jupiter v6
  "ComputeBudget111111111111111111111111111111",
  "11111111111111111111111111111111",              // System
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",   // Token
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",  // Associated Token
])

export function verifySwapTx(tx: VersionedTransaction, user: PublicKey) {
    const msg = tx.message

    if(!msg.staticAccountKeys[0].equals(user)) {
        throw new Error("Unexpected fee payer")
    }

    for (const ix of msg.compiledInstructions) {
        const programId = msg.staticAccountKeys[ix.programIdIndex].toBase58()
        if (!ALLOWED_PROGRAMS.has(programId)) {
            console.error("Blocked program: ", programId)
            throw new Error("Transaction containes an unexpected program")
        }
    }
}