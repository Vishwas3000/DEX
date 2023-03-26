import { ethers } from "ethers"

async function GetEthInContractUtil(contractAddress, contractAbi, runContractFunction) {
    const getEthInContractOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "getEthInContract",
    }

    const ethInContract = await runContractFunction({
        params: getEthInContractOpt,
        onSuccess: (result) => console.log(result),
        onError: (error) => console.log(error),
    })
    const ethInContractWei = ethers.utils.formatEther(ethInContract)
    return ethInContractWei
}

async function GetReserveUtil(constractAddress, contractAbi, runContractFunction) {
    const getReserveOpt = {
        abi: contractAbi,
        contractAddress: constractAddress,
        functionName: "getReserve",
    }

    const CDBalanceInDexWei = await runContractFunction({
        params: getReserveOpt,
        onError: (error) => console.log(error),
    })
    const CDBalanceInDex = ethers.utils.formatEther(CDBalanceInDexWei)
    return CDBalanceInDex
}

async function AddLiquidityUtil(
    contractAddress,
    contractAbi,
    ethAmountToAdd,
    CDTokenAmountToAdd,
    runContractFunction,
    handleSuccess
) {
    const ethAmountToAddWei = ethers.utils.parseEther(ethAmountToAdd)
    const CDTokenAmountToAddWei = ethers.utils.parseEther(CDTokenAmountToAdd)

    const addLiquidityOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "addLiquidity",
        msgValue: ethAmountToAddWei,
        params: { _amount: CDTokenAmountToAddWei },
    }

    const result = await runContractFunction({
        params: addLiquidityOpt,
        onSuccess: handleSuccess,
        OnError: (error) => console.log(error),
    })

    const liquidity = ethers.utils.formatEther(result.value)
    console.log("liquidity", liquidity)

    return liquidity
}

async function RemoveLiquidityUtil(
    contractAddress,
    contractAbi,
    liquidityToRemove,
    runContractFunction,
    handleSuccess
) {
    const liquidityToRemoveWei = ethers.utils.parseEther(liquidityToRemove)

    const removeLiquidityOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "removeLiquidity",
        params: { _amount: liquidityToRemoveWei },
    }

    const result = await runContractFunction({
        params: removeLiquidityOpt,
        onSuccess: handleSuccess,
        OnError: (error) => console.log(error),
    })
    console.log("liquidity removed", result)
}

async function GetAmountOfTokenUtil(
    exchangeAddress,
    contractAbi,
    fromTokenAmount,
    fromTokenReserve,
    toTokenReserve,
    runContractFunction
) {
    const inputAmountWei = ethers.utils.parseEther(fromTokenAmount)
    const fromReserveWei = ethers.utils.parseEther(fromTokenReserve)
    const toReserveWei = ethers.utils.parseEther(toTokenReserve)

    const getAmountOfTokenOpt = {
        contractAddress: exchangeAddress,
        abi: contractAbi,
        functionName: "getAmountOfToken",
        params: { inputAmount: inputAmountWei, inputReserve: fromReserveWei, outputReserve: toReserveWei },
    }

    const toTokenRecieved = await runContractFunction({
        params: getAmountOfTokenOpt,
        onSuccess: (result) => console.log(result),
        onError: (error) => console.log(error),
    })
    const toTokenRecievedWei = ethers.utils.formatEther(toTokenRecieved)
    return toTokenRecievedWei
}

export { GetReserveUtil, AddLiquidityUtil, GetAmountOfTokenUtil, GetEthInContractUtil, RemoveLiquidityUtil }
