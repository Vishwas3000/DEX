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
    if (allowanceWei == null) {
        console.log("allowanceWei is null")
        return
    }
    const allowance = ethers.utils.formatEther(allowanceWei)
    // console.log("allowance: ", allowance)
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
    const amountToApproveWei = ethers.utils.parseEther(amountToApprove)
    const approveOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "approve",
        params: { spender: spenderAddress, amount: amountToApproveWei },
    }

    const isApproved = await runContractFunction({
        params: approveOpt,
        onSuccess: handleSuccess,
        onError: (error) => console.log(error),
    })
    return isApproved
}

export { GetCurrentAllowanceUtil, ApproveAllowanceUtil }
