'use client'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import React, { ReactNode, useMemo } from 'react'
import "@solana/wallet-adapter-react-ui/styles.css";


export default function Providers({ children } : { children: ReactNode; }) {

    const network = WalletAdapterNetwork.Mainnet

    const endpoint = process.env.NEXT_PUBLIC_HELIUS_RPC_URL ?? "https://api.mainnet-beta.solana.com";

    const wallets = useMemo(() => [new PhantomWalletAdapter()], [network])

  return (
      <ConnectionProvider endpoint={endpoint ?? "https://api.mainnet-beta.solana.com"}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>  
          {children}
        </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
  )
}
