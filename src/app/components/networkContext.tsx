"use client"

import React, { useState, useContext, createContext } from 'react'

type NetworkContextType = {
    selectedNetwork: string
    setSelectedNetwork: (network: string) => void 
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function NetworkProvider({children}: { children: React.ReactNode}) {
    const [selectedNetwork, setSelectedNetwork] = useState("Devnet")
  return (
    <NetworkContext.Provider value={{ selectedNetwork, setSelectedNetwork}}>
        {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
    const context = useContext(NetworkContext)
    if (!context) {
        throw new Error("useNetwork must be used inside NetworkProvider")
    }
    return context
}