import { describe, it, expect } from "vitest"
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js"
import { verifySwapTx } from "./verifyTx"

function buildTx(payer: PublicKey, programId: PublicKey) {
  const message = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: "11111111111111111111111111111111",
    instructions: [
      {
        programId,
        keys: [],
        data: Buffer.alloc(0),
      },
    ],
  }).compileToV0Message()
  return new VersionedTransaction(message)
}

describe("verifySwapTx", () => {
  const user = Keypair.generate().publicKey

  it("accepts a transaction with correct fee payer and known program", () => {
    const tx = buildTx(user, SystemProgram.programId)
    expect(() => verifySwapTx(tx, user)).not.toThrow()
  })

  it("rejects a wrong fee payer", () => {
    const attacker = Keypair.generate().publicKey
    const tx = buildTx(attacker, SystemProgram.programId)
    expect(() => verifySwapTx(tx, user)).toThrow("Unexpected fee payer")
  })

  it("rejects an unknown program", () => {
    const unknown = Keypair.generate().publicKey
    const tx = buildTx(user, unknown)
    expect(() => verifySwapTx(tx, user)).toThrow("unexpected program")
  })
})