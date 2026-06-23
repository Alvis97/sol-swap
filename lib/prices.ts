import React from 'react'

export async function getSolPrices(): Promise<number> {
    const response = await fetch('/api/price')
    console.log("resp", response)
    const data = await response.json()
    console.log(data)
    return data.solana.usd
}
