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
    const endpoint = useMemo(() => clusterApiUrl(network), [network])
    const wallets = useMemo(() => [new PhantomWalletAdapter()], [network])

    console.log("network:",network)
    console.log("selected Network:", selectedNetwork)

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