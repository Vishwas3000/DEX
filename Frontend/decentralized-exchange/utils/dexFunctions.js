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

    const CDBalanceInDex = await runContractFunction({
        params: getReserveOpt,
        onSuccess: (result) => console.log(result),
        onError: (error) => console.log(error),
    })
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

    const liquidity = await runContractFunction({
        params: addLiquidityOpt,
        onSuccess: handleSuccess,
        OnError: (error) => console.log(error),
    })
    return liquidity
}

async function GetAmountOfTokenUtil(
    constractAddress,
    contractAbi,
    fromTokenAmount,
    fromTokenReserve,
    toTokenReserve,
    runContractFunction
) {
    const getAmountOfTokenOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "getAmountOfToken",
        params: { inputAmount: fromTokenAmount, inputReserve: fromTokenReserve, outputReserve: toTokenReserve },
    }

    const toTokenRecieved = await runContractFunction({
        params: getAmountOfTokenOpt,
        onSuccess: (result) => console.log(result),
        onError: (error) => console.log(error),
    })
    const toTokenRecievedWei = ethers.utils.formatEther(toTokenRecieved)
    return toTokenRecievedWei
}

export { GetReserveUtil, AddLiquidityUtil, GetAmountOfTokenUtil, GetEthInContractUtil }
