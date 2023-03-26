import { Chicle, Inter } from "next/font/google"
import { useMoralis, useWeb3Contract, useERC20Balances } from "react-moralis"
import { exchangeAbi, contractAddresses, cryptoDevTokenAbi } from "../constants/index"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Input, useNotification, Button, Information } from "web3uikit"
import { GetAmountOfTokenUtil, GetReserveUtil, AddLiquidityUtil, RemoveLiquidityUtil } from "../utils/dexFunctions"
import { GetCurrentAllowanceUtil } from "@/utils/ERC20Functions"
import { GetEthBalanceUtil } from "@/utils/ethBalance"

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    const exchangeAddress = contractAddresses[chainIdString]["Exchange"][0]
    const CDTAddress = contractAddresses[chainIdString]["CryptoDevToken"][0]

    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()
    const { fetchERC20Balances, data, isLoading, isFetching, error } = useERC20Balances()

    const [ethAmountToAdd, setEthAmountToAdd] = useState("")
    const [cdTokenAmountToAdd, setCdTokenAmountToAdd] = useState("")
    const [isLiqLoading, setIsLiqLoading] = useState(false)
    const [currentAllowance, setCurrentAllowance] = useState(0)
    const [minCDTAmountToSend, setMinCDTAmountToSend] = useState("")
    const [cdTokenAmountToRemove, setCdTokenAmountToRemove] = useState("")

    const [addRemove, setAddRemove] = useState(true)

    useEffect(() => {
        GetCurrentAllowance()
        GetCDTReserve()
        GetEthReserve()
        GetMinCDTAmountForEth()
    }, [isWeb3Enabled, isLiqLoading, ethAmountToAdd])

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
            message: `Liquidity added to the pool`,
        })
        setIsLiqLoading(false)
    }

    async function handleRemoveLiqSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            title: "Liqiudity Added",
            position: "topR",
            message: `Liquidity added to the pool`,
        })
        setIsLiqLoading(false)
    }

    return (
        <div className="p-2 space-y-10 flex flex-col">
            <div className="flex flex-row">
                <div className="w-1/6 flex items-start p-2">
                    <Information topic="Your Current Allowance" information={currentAllowance} />
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
            <div className="flex items-center justify-center">
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
                                label="Add CDToken"
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
