import { contractAddresses, exchangeAbi } from "../constants/index.js"
import { useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { ethers } from "ethers"

async function GetReserve() {
    const { chainId } = useMoralis()
    const chainIdString = chainId ? parseInt(chainId).toString() : "31337"

    const dexAddress = contractAddresses[chainIdString][Exchange]

    const { runContractFunction: getReserve } = useWeb3Contract({
        abi: exchangeAbi,
        contractAddress: dexAddress,
        functionName: "getReserve",
        params: {},
    })
}
