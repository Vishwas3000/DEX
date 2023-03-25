import { Chicle, Inter } from "next/font/google"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { exchangeAbi, contractAddresses, cryptoDevTokenAbi } from "../constants/index"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Card, useNotification, Button, Input, Information } from "web3uikit"
import { GetCurrentAllowanceUtil, ApproveAllowanceUtil } from "@/utils/ERC20Functions"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    const [CDTokenAmount, setCDTokenAmount] = useState("")
    const [currentAllowance, setCurrentAllowance] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const exchangeAddress = contractAddresses[chainIdString]["Exchange"][0]
    const CDTAddress = contractAddresses[chainIdString]["CryptoDevToken"][0]
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    useEffect(() => {
        CurrentAllowance()
    }, [isWeb3Enabled, isLoading])

    async function CurrentAllowance() {
        const allowance = await GetCurrentAllowanceUtil(
            CDTAddress,
            cryptoDevTokenAbi,
            runContractFunction,
            account,
            exchangeAddress
        )
        setCurrentAllowance(allowance)
    }
    async function RequestAllowance() {
        const isApproved = await ApproveAllowanceUtil(
            CDTAddress,
            exchangeAbi,
            runContractFunction,
            exchangeAddress,
            CDTokenAmount,
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
        setIsLoading(false)
    }

    return (
        <div className="p-8">
            <div className="w-1/5">
                <Information topic="Your Current Allowance" information={currentAllowance} />
            </div>
            <div className=" content-center items-center ">
                <div className="flex flex-col items-center justify-center w-full h-full p-20 space-y-10">
                    <div className=" border-solid border-2 border-gray-200 rounded-lg flex flex-row justify-between w-1/2 h-12 px-5">
                        <h1 className="text-center text-2xl font-bold">Request Allowance</h1>
                    </div>
                    <div className="w-1/2 flex flex-col justify-center text-center space-y-5">
                        <Input
                            label="Allowance Needed"
                            autoComplete
                            onChange={(event) => {
                                setCDTokenAmount(event.target.value)
                            }}
                        />
                        <Button
                            text="Request"
                            theme="colored"
                            color="green"
                            isLoading={isLoading}
                            onClick={() => {
                                setIsLoading(true)
                                RequestAllowance()
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
