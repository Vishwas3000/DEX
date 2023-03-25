import { Chicle, Inter } from "next/font/google"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { exchangeAbi, contractAddresses } from "../constants/index"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Input, useNotification, Button, Information } from "web3uikit"
import { GetAmountOfTokenUtil, GetReserveUtil, AddLiquidityUtil } from "../utils/dexFunctions"
import { GetCurrentAllowanceUtil } from "@/utils/ERC20Functions"

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
    const [currentAllowance, setCurrentAllowance] = useState(0)

    async function AddLiquidity() {
        const liquidity = await AddLiquidityUtil(
            contractAddress,
            exchangeAbi,
            ethAmountToAdd,
            cdTokenAmountToAdd,
            runContractFunction,
            handleSuccess
        )
        console.log(liquidity)
    }

    async function GetCurrentAllowance() {
        const allowance = await GetCurrentAllowanceUtil(
            contractAddress,
            exchangeAbi,
            runContractFunction,
            account,
            contractAddress
        )
        setCurrentAllowance(allowance)
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

    async function handleSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            title: "Liqiudity Added",
            position: "topR",
            message: `Liquidity added to the pool`,
        })
        setIsLoading(false)
    }

    return (
        <div className="p-2 space-y-10 flex flex-col">
            <div className="w-1/6 flex items-start p-2">
                <Information topic="Your Current Allowance" information={currentAllowance} />
            </div>
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center space-y-5 border-2 rounded-lg border-gray-200 p-5 w-1/2">
                    <h1 className="text-center text-2xl text-sky-900 font-bold">Add liquidity</h1>
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
                            onClick={() => {
                                setIsLoading(true)
                                AddLiquidity()
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
