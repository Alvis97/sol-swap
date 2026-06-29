import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import React from 'react'
import { USDC_MINT } from './jupiter';
import { useNetwork } from '@/app/components/networkContext';

// USDC token mint address on Devnet
const USDC_MINT_DEVNET = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')
const USDC_MINT_MAINNET = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')

type Network = "Devnet" | "Mainnet"


export async function getUsdBalance(
    publicKey: PublicKey,
   connection: Connection,
): Promise<number> {

  try{
    const isDevnet = connection.rpcEndpoint.includes("devnet")
    const USDC_MINT = isDevnet ? USDC_MINT_DEVNET : USDC_MINT_MAINNET
    const tokenAdress = await getAssociatedTokenAddress(USDC_MINT, publicKey)
    const account = await getAccount(connection, tokenAdress)
    console.log("USDC_MINT", USDC_MINT.toString());
    return Number(account.amount) / 1e6 // Usdc, 6 decimals
  } catch (err) {
    return 0 //If user has 0 dollars
  }
}


export async function getSolBalance(
  publicKey: PublicKey,
  connection: Connection,
  ): Promise<number> {

    try { 
      const balance = await connection.getBalance(publicKey);
      return balance / 1e6
    } catch {
      return 0
    }
}
 