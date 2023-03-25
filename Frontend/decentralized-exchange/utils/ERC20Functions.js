import { ethers } from "ethers"

async function GetCurrentAllowanceUtil(
    contractAddress,
    contractAbi,
    runContractFunction,
    ownerAddress,
    spenderAddress
) {
    const allowanceOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "allowance",
        params: { owner: ownerAddress, spender: spenderAddress },
    }

    const allowanceWei = await runContractFunction({
        params: allowanceOpt,
        onError: (error) => console.log(error),
    })
    const allowance = ethers.utils.formatEther(allowanceWei)
    console.log("allowance: ", allowance)
    return allowance
}

async function ApproveAllowanceUtil(
    contractAddress,
    contractAbi,
    runContractFunction,
    spenderAddress,
    amountToApprove,
    handleSuccess
) {
    const approveOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "approve",
        params: { spender: spenderAddress, amount: amountToApprove },
    }

    const isApproved = await runContractFunction({
        params: approveOpt,
        onSuccess: handleSuccess,
        onError: (error) => console.log(error),
    })
    return isApproved
}

export { GetCurrentAllowanceUtil, ApproveAllowanceUtil }
