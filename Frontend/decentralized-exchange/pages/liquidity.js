import { Chicle, Inter } from "next/font/google"
import { useMoralis, useWeb3Contract } from "react-moralis"
import {
    contractAddresses,
    cryptoDevTokenAbi,
    getImplementationAbi,
    getImplementationAddress,
} from "../constants/index"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Input, useNotification, Button, Information } from "web3uikit"
import {
    GetCDTBalanceOfInDexUtil,
    GetAmountOfTokenUtil,
    GetReserveUtil,
    AddLiquidityUtil,
    RemoveLiquidityUtil,
} from "../utils/dexFunctions"
import { GetCurrentAllowanceUtil } from "@/utils/ERC20Functions"
import { GetEthBalanceUtil } from "@/utils/ethBalance"

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    const exchangeAddress = contractAddresses[chainIdString]["Proxy"]
    const CDTAddress = contractAddresses[chainIdString]["CryptoDevToken"]
    const exchangeAbi = getImplementationAbi(1)

    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    const [ethAmountToAdd, setEthAmountToAdd] = useState("")
    const [cdTokenAmountToAdd, setCdTokenAmountToAdd] = useState("")
    const [isLiqLoading, setIsLiqLoading] = useState(false)
    const [currentAllowance, setCurrentAllowance] = useState(0)
    const [minCDTAmountToSend, setMinCDTAmountToSend] = useState("")
    const [cdTokenAmountToRemove, setCdTokenAmountToRemove] = useState("")
    const [ethAccountBal, setEthAccountBal] = useState("")
    const [cdlpBalance, setCdlpBalance] = useState("")
    const [addRemove, setAddRemove] = useState(true)

    useEffect(() => {
        GetCurrentAllowance()
        GetCDTReserve()
        GetEthReserve()
        GetEthAccountBal()
        GetMinCDTAmountForEth()
        GetCDTBalanceOfInDex()
    }, [isWeb3Enabled, isLiqLoading, ethAmountToAdd, account])

    async function AddLiquidity() {
        const liquidity = await AddLiquidityUtil(
            exchangeAddress,
            exchangeAbi,
            ethAmountToAdd,
            cdTokenAmountToAdd,
            runContractFunction,
            handleAddLiqSuccess
        )
        console.log(liquidity)
    }

    async function RemoveLiquidity() {
        const result = await RemoveLiquidityUtil(
            exchangeAddress,
            exchangeAbi,
            cdTokenAmountToRemove,
            runContractFunction,
            handleRemoveLiqSuccess
        )
        console.log("Removed: ", result)
    }

    async function GetCurrentAllowance() {
        const allowance = await GetCurrentAllowanceUtil(
            CDTAddress,
            cryptoDevTokenAbi,
            runContractFunction,
            account,
            exchangeAddress
        )
        setCurrentAllowance(allowance)
    }

    async function GetCDTReserve() {
        const CDTInreserve = await GetReserveUtil(exchangeAddress, exchangeAbi, runContractFunction)
        console.log("CDT reserve: ", CDTInreserve)
        return CDTInreserve
    }

    async function GetEthReserve() {
        const ethInReserve = await GetEthBalanceUtil(exchangeAddress)
        console.log("eth in reserve: ", ethInReserve)
        return ethInReserve
    }

    async function GetEthAccountBal() {
        const ethBal = await GetEthBalanceUtil(account)
        console.log("eth bal: ", ethBal)
        setEthAccountBal(ethBal)
        return ethBal
    }

    async function GetCDTBalanceOfInDex() {
        const cdtBal = await GetCDTBalanceOfInDexUtil(exchangeAddress, exchangeAbi, account, runContractFunction)
        console.log("cdt bal in dex: ", cdtBal)
        setCdlpBalance(cdtBal)
        return cdtBal
    }

    async function GetMinCDTAmountForEth() {
        const ethInReserve = await GetEthReserve()
        const cdtInReserve = await GetCDTReserve()
        const minCDTAmount = (cdtInReserve * ethAmountToAdd) / ethInReserve // eth in reserve
        setMinCDTAmountToSend(minCDTAmount)
        console.log("min cdt amount to send: ", minCDTAmount)

        return minCDTAmount
    }

    async function handleAddLiqSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            title: "Liqiudity Added",
            position: "topR",
            message: `${ethAmountToAdd} ETH and ${cdTokenAmountToAdd} CDToken added to the pool`,
        })
        setIsLiqLoading(false)
    }

    async function handleRemoveLiqSuccess(tx) {
        const txReciept = await tx.wait(1)
        console.log("transaction reciept", txReciept)
        const ethRemoved = ethers.utils.formatEther(txReciept.events[2].args["ethAmount"])
        const cdtRemoved = ethers.utils.formatEther(txReciept.events[2].args["CDAmount"])
        dispatch({
            type: "success",
            title: "Liqiudity Removed",
            position: "topR",
            message: `${parseFloat(ethRemoved).toFixed(1)} ETH & ${parseFloat(cdtRemoved).toFixed(
                1
            )} CD removed from the pool`,
        })
        setIsLiqLoading(false)
    }

    return (
        <div className="p-2 space-y-10 flex flex-col">
            <div className="flex flex-row">
                <div className="w-1/6 flex flex-col items-start p-2 space-y-5">
                    <Information topic="Your CD Allowance" information={`${currentAllowance} CDT`} />
                    <Information topic="Your CDLP" information={`${parseFloat(cdlpBalance).toFixed(3)} CDLP`} />
                    <Information topic="Your ETH" information={`${parseFloat(ethAccountBal).toFixed(1)} ETH`} />
                </div>
                <div className="flex flex-row relative left-1/4 space-x-10 h-20 items-center p-2">
                    <Button
                        text="Add Liquidity"
                        theme="secondary"
                        onClick={() => {
                            setAddRemove(true)
                        }}
                    />
                    <Button
                        text="Remove Liquidity"
                        theme="secondary"
                        onClick={() => {
                            setAddRemove(false)
                        }}
                    />
                </div>
            </div>
            <div className="flex items-center justify-center relative bottom-52">
                {addRemove ? (
                    <div className="flex flex-col items-center space-y-5 border-2 rounded-lg border-gray-200 p-5 w-1/2">
                        <h1 className="text-center text-2xl text-sky-900 font-bold">Add liquidity</h1>
                        <div className="w-1/2 flex flex-col justify-center text-center space-y-4 p-2">
                            <div className=" flex flex-col justify-start items-start">
                                <Input
                                    label="Add Eth"
                                    autoComplete
                                    onChange={(event) => {
                                        setEthAmountToAdd(event.target.value)
                                    }}
                                />
                                <h3 className=" text-xs py-1 px-2">
                                    min CDT to send: {isNaN(minCDTAmountToSend) ? "any Amount" : minCDTAmountToSend}
                                </h3>
                            </div>
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
                                isLoading={isLiqLoading}
                                onClick={() => {
                                    setIsLiqLoading(true)
                                    AddLiquidity()
                                }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-5 border-2 rounded-lg border-gray-200 p-5 w-1/2">
                        <h1 className="text-center text-2xl text-sky-900 font-bold">Remove liquidity</h1>
                        <div className="w-1/2 flex flex-col justify-center text-center space-y-4 p-2">
                            <Input
                                label="Add CDLP Token"
                                autoComplete
                                onChange={(event) => {
                                    setCdTokenAmountToRemove(event.target.value)
                                }}
                            />
                            <Button
                                text="Liquidate"
                                theme="colored"
                                color="green"
                                isLoading={isLiqLoading}
                                onClick={() => {
                                    setIsLiqLoading(true)
                                    RemoveLiquidity()
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
