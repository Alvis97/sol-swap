import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import React from 'react'

// USDC token mint address on mainnet
const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')

export async function getSolBalance(publicKey: PublicKey, connection: Connection): Promise<number> {
  const balance = await connection.getBalance(publicKey);
  return balance / 1e9 //Converting lamports to SOL
}

export async function getUsdBalance(publicKey: PublicKey, connection: Connection): Promise<number> {
  try{
    const tokenAdress = await getAssociatedTokenAddress(USDC_MINT, publicKey)
    const account = await getAccount(connection, tokenAdress)
    return Number(account.amount) / 1e6 // Usdc has 6 decimals

  } catch {
    return 0 //If user dosnt have any dollars
  }
  const balance = await connection.getBalance(publicKey);
  return balance / 1e9 //Converting lamports to SOL
}
