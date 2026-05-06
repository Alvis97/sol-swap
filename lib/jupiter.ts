export const SOL_MINT = "So11111111111111111111111111111111111111112"
export const USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"

export async function getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippage: string
) {

    const slippageBps = parseFloat(slippage) * 100 //Jupiter uses basis point

    const response = await fetch(
        `/api/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`
    )

    const data = await response.json()
    return data


}