import { ethers } from "ethers"

async function GetCurrentAllowanceUtil() {}

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
