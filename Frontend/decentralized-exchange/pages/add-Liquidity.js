import { Chicle, Inter } from "next/font/google"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { exchangeAbi, contractAddresses } from "../constants/index"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Card, useNotification, Button, Form } from "web3uikit"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    const contractAddress = contractAddresses[chainIdString]["Exchange"][0]
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    const [ethAmountToSwap, setEthAmountToSwap] = useState("")
    const [cdTokenAmountToSwap, setCdTokenAmountToSwap] = useState("")

    async function AddLiquidity() {
        const addLiquidityOpt = {
            abi: exchangeAbi,
            contractAddress: contractAddress,
            functionName: "addLiquidity",
            msgValue: ethers.utils.parseEther(ethAmountToSwap),
            params: { _amount: ethers.utils.parseEther(cdTokenAmountToSwap) },
        }

        await runContractFunction({
            params: addLiquidityOpt,
            onSuccess: (result) => console.log(result),
            OnError: (error) => console.log(error),
        })
    }
    return <></>
}
