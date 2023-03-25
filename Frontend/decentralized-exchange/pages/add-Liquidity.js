import { Chicle, Inter } from "next/font/google"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { exchangeAbi, contractAddresses } from "../constants/index"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Input, useNotification, Button } from "web3uikit"
import { GetAmountOfTokenUtil, GetReserveUtil, AddLiquidityUtil } from "../utils/dexFunctions"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    const contractAddress = contractAddresses[chainIdString]["Exchange"][0]
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    const [ethAmountToAdd, setEthAmountToAdd] = useState("")
    const [cdTokenAmountToAdd, setCdTokenAmountToAdd] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function AddLiquidity(data) {
        const liquidity = await AddLiquidityUtil(
            contractAddress,
            exchangeAbi,
            ethAmountToAdd,
            cdTokenAmountToAdd,
            runContractFunction
        )
        console.log(liquidity)
    }

    async function GetReserve() {
        const reserve = await GetReserveUtil(contractAddress, exchangeAbi, runContractFunction)
        console.log(reserve)
    }

    async function GetAmountOfToken(fromTokenAmount, fromTokenReserve, toTokenReserve) {
        const amountRecieved = await GetAmountOfTokenUtil(
            contractAddress,
            exchangeAbi,
            fromTokenAmount,
            fromTokenReserve,
            toTokenReserve,
            runContractFunction
        )
        console.log(amountRecieved)
    }

    return (
        <div className="py-20 px-20">
            <div className="flex flex-col items-center content-center space-y-8 border-4 rounded-lg border-gray-200 p-5">
                <div className=" border-solid border-2 border-gray-200 rounded-lg flex flex-row justify-between w-2/3 p-5">
                    <h1 className="text-center text-2xl font-bold">Add liquidity</h1>
                </div>
                <div className="w-1/2 flex flex-col justify-center text-center space-y-4 p-2">
                    <Input
                        label="Add Eth"
                        autoComplete
                        onChange={(event) => {
                            setEthAmountToAdd(event.target.value)
                        }}
                    />
                    <Input
                        label="Add CDToken"
                        autoComplete
                        onChange={(event) => {
                            setCdTokenAmountToAdd(event.target.value)
                        }}
                    />
                    <Button
                        text="Liquidate"
                        theme="colored"
                        color="green"
                        isLoading={isLoading}
                        onClick={AddLiquidity}
                    />
                </div>
            </div>
        </div>
    )
}
