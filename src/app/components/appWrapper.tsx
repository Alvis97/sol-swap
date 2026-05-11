"use client"

import React, { ReactNode } from 'react'
import { NetworkProvider } from './networkContext'
import NetworkSelector from './networkSelector'
import Providers from './providers'
import WalletButton from './walletButton'



type Props = {
  children: ReactNode
}

export default function AppWrapper({ children }: Props) {
  return (
     <div className='flex flex-col h-full'>
        <NetworkProvider>
          <Providers>
            <nav className="flex items-center justify-end px-3 h-16 shrink-0">
              <NetworkSelector />
              <WalletButton/>
            </nav>
            <main className='flex-1'>
          {children}
            </main>
        </Providers>
      </NetworkProvider>
    </div>
  )
}

