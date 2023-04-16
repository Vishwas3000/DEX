import { Chicle, Inter } from "next/font/google"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddresses, cryptoDevTokenAbi, getImplementationAbi } from "../constants/index"
import { useEffect, useState } from "react"
import { useNotification, Button, Input, Information } from "web3uikit"
import { GetCurrentAllowanceUtil, ApproveAllowanceUtil } from "@/utils/ERC20Functions"
import { GetBalanceOfAccountUtil } from "@/utils/CDTokenFunctions"
const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    const [CDTokenAmount, setCDTokenAmount] = useState("")
    const [currentAllowance, setCurrentAllowance] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [cdBalance, setCdBalance] = useState("")

    const exchangeAddress = contractAddresses[chainIdString]["Proxy"]
    const exchangeAbi = getImplementationAbi(2)
    const CDTAddress = contractAddresses[chainIdString]["CryptoDevToken"]
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    useEffect(() => {
        CurrentAllowance()
        GetCDAccountBalance()
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

    async function GetCDAccountBalance() {
        const balance = await GetBalanceOfAccountUtil(CDTAddress, cryptoDevTokenAbi, runContractFunction, account)
        setCdBalance(balance)
        return balance
    }

    return (
        <div className="p-2 space-y-10 flex flex-col">
            <div className="w-1/6 flex flex-col items-start p-2 space-y-5">
                <Information topic="Your CD Allowance" information={`${parseFloat(currentAllowance).toFixed(1)} CDT`} />
                <Information topic="Your CD Balance" information={`${parseFloat(cdBalance).toFixed(2)} CDT`} />
            </div>
            <div className=" flex justify-center items-center relative bottom-32">
                <div className="flex flex-col items-center space-y-5 border-2 rounded-lg border-gray-200 p-5 w-1/2">
                    <h1 className="text-center text-2xl text-sky-900 font-bold">Request Allowance</h1>
                    <div className="w-1/2 flex flex-col justify-center text-center space-y-5">
                        <Input
                            label="Allowance Needed"
                            autoComplete
                            onChange={(event) => {
                                console.log(event.target.value)
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
