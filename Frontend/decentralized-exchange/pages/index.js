import Head from "next/head"
import Image from "next/image"
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

    async function GetReserve() {
        const getReserveOpt = {
            abi: exchangeAbi,
            contractAddress: contractAddress,
            functionName: "getReserve",
        }

        await runContractFunction({
            params: getReserveOpt,
            onSuccess: (result) => console.log(result),
            OnError: (error) => console.log(error),
        })
    }

    return (
        <div className=" content-center items-center h-100 gap-4">
            <div className="flex flex-col items-center justify-center w-full h-full p-20">
                <div className=" border-solid border-4 border-gray-200 rounded-lg flex flex-row justify-between w-1/2 h-12 px-5">
                    <h1 className="text-center text-3xl font-bold">Swap</h1>
                    <Image src="/logo.png" alt="swap" width={100} height={100} />
                </div>
                <div className="w-1/2 flex flex-col justify-center text-center">
                    <Form
                        className="flex flex-col justify-center items-center"
                        buttonConfig={{
                            theme: "primary",
                            text: "Swap",
                        }}
                        onSubmit={(data) => console.log(data)}
                        data={[
                            {
                                inputWidth: "30%",
                                name: "Eth",
                                type: "text",
                                value: "",
                                key: "CryptoDevAmount",
                            },
                            {
                                inputWidth: "30%",
                                name: "CD Token",
                                type: "text",
                                value: "",
                                key: "EthValue",
                            },
                        ]}
                        id="main form"
                    />
                </div>
            </div>
            <Button onClick={GetReserve} />
        </div>
    )
}
