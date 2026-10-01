export const SOL_MINT = "So11111111111111111111111111111111111111112"
export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"

export async function getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number
) {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: amount.toString(),
    slippageBps: slippageBps.toString(),
  })

  console.log("params: ", inputMint, outputMint, amount, slippageBps);
    const response = await fetch(`/api/quote?${params}`
    )

    if (!response.ok) {
        throw new Error(`Quote failed: {reponse.status}`)
    }

    return response.json()
}