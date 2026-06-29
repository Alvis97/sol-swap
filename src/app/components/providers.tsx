'use client'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import React, { ReactNode, useMemo } from 'react'
import "@solana/wallet-adapter-react-ui/styles.css";
import NetworkSelector from './networkSelector'
import { useNetwork } from './networkContext'


export default function Providers({ children } : { children: ReactNode; }) {

  const { selectedNetwork } = useNetwork();

    const network = 
    selectedNetwork === "Devnet" 
    ? WalletAdapterNetwork.Devnet
    :  WalletAdapterNetwork.Mainnet

    const endpoint = useMemo(() => 
      selectedNetwork === "Devnet" 
    ? (process.env.NEXT_PUBLIC_HELIUS_DEVNET_RPC_URL ?? "https://api.devnet.solana.com")
    : (process.env.NEXT_PUBLIC_HELIUS_RPC_URL ?? "https://api.mainnet-beta.solana.com"),
    [selectedNetwork]
)

    const wallets = useMemo(() => [new PhantomWalletAdapter()], [network])

    console.log("network:",network)
    console.log("selected Network:", selectedNetwork)
    console.log("endpoint:", endpoint);

  return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>  
          {children}
        </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
  )
}