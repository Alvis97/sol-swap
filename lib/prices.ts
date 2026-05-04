import React from 'react'

export async function getSolPrices(): Promise<number> {
    const response = await fetch('/api/price')
    const data = await response.json()
    return data.solana.usd
}

