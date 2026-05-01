"use client"

import React, { ReactNode } from 'react'
import { NetworkProvider } from './networkContext'
import NetworkSelector from './networkSelector'
import Providers from './providers'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

type Props = {
  children: ReactNode
}

export default function AppWrapper({ children }: Props) {
  return (
     <div className='flex flex-col h-full'>
        <NetworkProvider>
      <nav className="flex items-center justify-end px-3 h-16 shrink-0">
            <NetworkSelector />
            <Providers>
              <WalletMultiButton />
            </Providers>
      </nav>
      <main className='flex-1 bg-pink-500'>
        <Providers>
    {children}
        </Providers>
      </main>
      </NetworkProvider>
    </div>
  )
}

