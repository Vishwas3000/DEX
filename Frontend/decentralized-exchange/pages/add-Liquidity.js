import { Chicle, Inter } from "next/font/google"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { exchangeAbi, contractAddresses } from "../constants/index"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Card, useNotification, Button, Form } from "web3uikit"
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

    async function AddLiquidity(data) {
        const ethAmountToAdd = data.data[0].inputResult
        const cdTokenAmountToAdd = data.data[1].inputResult

        setEthAmountToAdd(ethAmountToAdd)
        setCdTokenAmountToAdd(cdTokenAmountToAdd)

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

    async function ethToCDToken() {}

    async function cdTokenToEth() {}

    return (
        <div className=" content-center items-center h-100 gap-4">
            <div className="flex flex-col items-center justify-center w-full h-full p-20">
                <div className=" border-solid border-4 border-gray-200 rounded-lg flex flex-row justify-between w-1/2 h-12 px-5">
                    <h1 className="text-center text-2xl font-bold">Add liquidity</h1>
                </div>
                <div className="w-1/2 flex flex-col justify-center text-center">
                    <Form
                        className="flex flex-col justify-center items-center"
                        buttonConfig={{
                            theme: "primary",
                            text: "Add Liquidity",
                        }}
                        onSubmit={AddLiquidity}
                        data={[
                            {
                                inputWidth: "30%",
                                name: "Eth",
                                type: "text",
                                value: "",
                                key: "EthValue",
                            },
                            {
                                inputWidth: "30%",
                                name: "CD Token",
                                type: "text",
                                value: "",
                                key: "CDTokenValue",
                            },
                        ]}
                        id="main form"
                    />
                </div>
            </div>
        </div>
    )
}
