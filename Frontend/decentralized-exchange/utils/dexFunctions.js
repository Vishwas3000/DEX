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
    if (CDBalanceInDexWei != null) {
        const CDBalanceInDex = ethers.utils.formatEther(CDBalanceInDexWei)
        return CDBalanceInDex
    }
    console.log("CDBalanceInDexWei is null")
    return
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
    if (fromTokenAmount == 0) return

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

async function EthToCDTSwapUtil(
    contractAddress,
    contractAbi,
    ethAmountToSwap,
    minTokensCDTToRecieve,
    runContractFunction,
    handleSuccess
) {
    const ethAmountToSwapWei = ethers.utils.parseEther(ethAmountToSwap)
    const minTokensCDTToRecieveWei = ethers.utils.parseEther(minTokensCDTToRecieve)

    const ethToCDTSwapOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "ethToCryptoDev",
        msgValue: ethAmountToSwapWei,
        params: { _minTokens: minTokensCDTToRecieveWei },
    }

    await runContractFunction({
        params: ethToCDTSwapOpt,
        onSuccess: handleSuccess,
        onError: (error) => console.log(error),
    })
}

async function CDTToEthSwapUtil(
    contractAddress,
    contractAbi,
    CDTAmountToSwap,
    minEthToRecieve,
    runContractFunction,
    handleSuccess
) {
    const CDTAmountToSwapWei = ethers.utils.parseEther(CDTAmountToSwap)
    const minEthToRecieveWei = ethers.utils.parseEther(minEthToRecieve)

    const CDTToEthSwapOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "cryptoDevToEth",
        params: { _tokenSold: CDTAmountToSwapWei, _minEth: minEthToRecieveWei },
    }

    await runContractFunction({
        params: CDTToEthSwapOpt,
        onSuccess: handleSuccess,
        onError: (error) => console.log(error),
    })
}

export {
    GetReserveUtil,
    AddLiquidityUtil,
    GetAmountOfTokenUtil,
    GetEthInContractUtil,
    RemoveLiquidityUtil,
    EthToCDTSwapUtil,
    CDTToEthSwapUtil,
}
