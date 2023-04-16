import { Chicle, Inter } from "next/font/google"
import Image from "next/image"
import arrow from "../public/arrow.png"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { getImplementationAbi, getImplementationAddress, contractAddresses } from "../constants/index"
import { useEffect, useState } from "react"
import { useNotification, Button, Input, Information, Typography } from "web3uikit"
import { GetCurrentAllowanceUtil } from "@/utils/ERC20Functions"
import { GetAmountOfTokenUtil, GetReserveUtil, EthToCDTSwapUtil, CDTToEthSwapUtil } from "@/utils/dexFunctions"
import { GetEthBalanceUtil } from "@/utils/ethBalance"
const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    const exchangeAddress = contractAddresses[chainIdString]["Proxy"]
    const cryptoDevAddress = contractAddresses[chainIdString]["CryptoDevToken"]

    console.log("exchange address", exchangeAddress)
    console.log("crypto dev address", cryptoDevAddress)
    const dispatch = useNotification()
    const exchangeAbi = getImplementationAbi(2)

    const { runContractFunction } = useWeb3Contract()

    const [ethAmountToSwap, setEthAmountToSwap] = useState("")
    const [cdTokenAmountToSwap, setCdTokenAmountToSwap] = useState("")
    const [isSwapping, setIsSwapping] = useState(false)
    const [currentCDTAllowed, setCurrentCDTAllowed] = useState("")
    const [CDTReserve, setCDTReserve] = useState("")
    const [swapChange, setSwapChange] = useState(false)
    const [ethAmountToGet, setEthAmountToGet] = useState("")
    const [cdTokenAmountToGet, setCdTokenAmountToGet] = useState("")
    const [ethReserve, setEthReserve] = useState("")

    useEffect(() => {
        GetCurrentAllowence()
        GetCDTReserve()
        GetEthReserve(exchangeAddress)
    }, [isWeb3Enabled, account, isSwapping])

    useEffect(() => {
        GetAmountOfCDT()
    }, [ethAmountToSwap])

    useEffect(() => {
        GetAmountofETH()
    }, [cdTokenAmountToSwap])

    async function GetCurrentAllowence() {
        const currentAllowence = await GetCurrentAllowanceUtil(
            cryptoDevAddress,
            exchangeAbi,
            runContractFunction,
            account,
            exchangeAddress
        )
        console.log("current Allowance", currentAllowence)
        setCurrentCDTAllowed(currentAllowence)
    }

    async function GetAmountOfToken(fromTokenAmount, fromTokenReserve, toTokenReserve) {
        const result = await GetAmountOfTokenUtil(
            exchangeAddress,
            exchangeAbi,
            fromTokenAmount,
            fromTokenReserve,
            toTokenReserve,
            runContractFunction
        )
        return result
    }

    async function GetCDTReserve() {
        const reserve = await GetReserveUtil(exchangeAddress, exchangeAbi, runContractFunction)
        setCDTReserve(reserve)
        return reserve
    }

    async function GetEthReserve() {
        const reserve = await GetEthBalanceUtil(exchangeAddress)
        setEthReserve(reserve)
        return reserve
    }

    async function GetAmountOfCDT() {
        const ethInReserve = await GetEthBalanceUtil(exchangeAddress)

        console.log("input", ethAmountToSwap)

        const CDTReturn = await GetAmountOfToken(ethAmountToSwap, ethInReserve, CDTReserve)
        console.log("CDT Return", CDTReturn)
        setCdTokenAmountToGet(CDTReturn)
    }

    async function GetAmountofETH() {
        const ethInReserve = await GetEthBalanceUtil(exchangeAddress)

        const EthReturn = await GetAmountOfToken(cdTokenAmountToSwap, CDTReserve, ethInReserve)
        console.log("ETH Return", EthReturn)
        setEthAmountToGet(EthReturn)
    }

    async function EthToCDTSwap() {
        await EthToCDTSwapUtil(
            exchangeAddress,
            exchangeAbi,
            ethAmountToSwap,
            cdTokenAmountToGet,
            runContractFunction,
            handleSuccess
        )
    }

    async function CDTToEthSwap() {
        await CDTToEthSwapUtil(
            exchangeAddress,
            exchangeAbi,
            cdTokenAmountToSwap,
            ethAmountToGet,
            runContractFunction,
            handleSuccess
        )
    }

    async function handleSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            title: "Token Swapped",
            position: "topR",
            message: "Token has swapped successfully",
        })
        setIsSwapping(false)
    }

    return (
        <div className="p-2 space-y-10 flex flex-col">
            <div className=" flex flex-row p-2 space-x-20">
                <div className="w-1/6">
                    <Information topic="Your Current Allowance" information={`${currentCDTAllowed} CDT`} style />
                </div>
                <div className="flex flex-col space-y-2 absolute right-5 w-1/6">
                    <Information topic="Eth Reserve" information={`${parseFloat(ethReserve).toFixed(2)} ETH`} />
                    <Information topic="CDT Reserve " information={`${parseFloat(CDTReserve).toFixed(2)} CDT`} />
                </div>
            </div>
            <div className="flex items-center justify-center">
                <div className="flex flex-col items-center space-y-5 border-2 rounded-lg border-gray-200 p-5 w-1/2">
                    <h1 className="text-center text-2xl text-sky-900 font-bold">Swap</h1>
                    {swapChange ? (
                        <div className="w-1/2 flex flex-col justify-center text-center space-y-4 p-2">
                            <Input
                                label="Eth value"
                                onChange={(event) => {
                                    setEthAmountToSwap(event.target.value)
                                }}
                                autoComplete="on"
                            />
                            <div className=" text-left px-2">
                                <p className=" text-xm text-sky-900 font-bold">
                                    Get: {isNaN(cdTokenAmountToGet) ? 0 : parseFloat(cdTokenAmountToGet).toFixed(4)} CDT
                                </p>
                            </div>
                            <Button
                                text="Swap"
                                theme="colored"
                                color="green"
                                isLoading={isSwapping}
                                onClick={() => {
                                    setIsSwapping(true)
                                    EthToCDTSwap()
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-1/2 flex flex-col justify-center text-center space-y-4 p-2">
                            <Input
                                label="CD Token"
                                onChange={(event) => {
                                    setCdTokenAmountToSwap(event.target.value)
                                    GetAmountOfEth()
                                }}
                                autoComplete="on"
                            />
                            <div className=" text-left px-2">
                                <p className=" text-xm text-sky-900 font-bold">
                                    Get: {isNaN(ethAmountToGet) ? 0 : parseFloat(ethAmountToGet).toFixed(4)} Eth
                                </p>
                            </div>
                            <Button
                                text="Swap"
                                theme="colored"
                                color="green"
                                isLoading={isSwapping}
                                onClick={() => {
                                    setIsSwapping(true)
                                    CDTToEthSwap()
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className=" absolute h-25 right-1/3 border-4 hover:border-dotted rounded-2xl ">
                    <Button
                        icon={<Image src={arrow} />}
                        iconColor="green"
                        iconLayout="icon-only"
                        id="swap-button"
                        loadingText="loading"
                        onClick={() => {
                            setSwapChange(!swapChange)
                        }}
                        radius={0}
                        size="regular"
                        text="all the props"
                        theme="colored"
                        type="button"
                    />
                </div>
            </div>
        </div>
    )
}
