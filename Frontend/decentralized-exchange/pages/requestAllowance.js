import { Chicle, Inter } from "next/font/google"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { exchangeAbi, contractAddresses } from "../constants/index"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Card, useNotification, Button, Form } from "web3uikit"
import { GetCurrentAllowanceUtil, ApproveAllowanceUtil } from "@/utils/ERC20Functions"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    const [CDTokenAmount, setCDTokenAmount] = useState("")

    const exchangeAddress = contractAddresses[chainIdString]["Exchange"][0]
    const CDTAddress = contractAddresses[chainIdString]["CryptoDevToken"][0]
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    async function currentAllowance() {}
    async function RequestAllowance(data) {
        const CDTAmount = ethers.utils.parseEther(data.data[0].inputResult)
        setCDTokenAmount(CDTAmount)
        const isApproved = await ApproveAllowanceUtil(
            CDTAddress,
            exchangeAbi,
            runContractFunction,
            exchangeAddress,
            CDTAmount,
            handleSuccess
        )
        console.log(isApproved)
    }

    async function handleSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            title: "Allowance Approved",
            position: "topR",
            message: `Approved ${CDTokenAmount} CDT`,
        })
        setCDTokenAmount(0)
    }

    function handleChange(data) {
        console.log(data)
    }
    return (
        <>
            <div></div>
            <div className=" content-center items-center h-100 gap-4">
                <div className="flex flex-col items-center justify-center w-full h-full p-20">
                    <div className=" border-solid border-4 border-gray-200 rounded-lg flex flex-row justify-between w-1/2 h-12 px-5">
                        <h1 className="text-center text-2xl font-bold">Request Allowance</h1>
                    </div>
                    <div className="w-1/2 flex flex-col justify-center text-center">
                        <Form
                            className="flex flex-col justify-center items-center"
                            buttonConfig={{
                                theme: "primary",
                                text: "Request",
                            }}
                            onSubmit={RequestAllowance}
                            OnChange={handleChange}
                            data={[
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
        </>
    )
}
