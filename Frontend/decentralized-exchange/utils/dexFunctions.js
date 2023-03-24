import { ethers } from "ethers"

async function GetReserveUtil(constractAddress, contractAbi, runContractFunction) {
    const getReserveOpt = {
        abi: contractAbi,
        contractAddress: constractAddress,
        functionName: "getReserve",
    }

    const CDBalanceInDex = await runContractFunction({
        params: getReserveOpt,
        onSuccess: (result) => console.log(result),
        onError: (error) => console.log(error),
    })
    return CDBalanceInDex
}

async function AddLiquidityUtil(contractAddress, contractAbi, ethAmountToAdd, CDTokenAmountToAdd, runContractFunction) {
    const addLiquidityOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "addLiquidity",
        msgValue: ethers.utils.parseEther(ethAmountToAdd),
        params: { _amount: ethers.utils.parseEther(CDTokenAmountToAdd) },
    }

    const liquidity = await runContractFunction({
        params: addLiquidityOpt,
        onSuccess: (result) => console.log(result),
        OnError: (error) => console.log(error),
    })
    return liquidity
}

export { GetReserveUtil, AddLiquidityUtil }
