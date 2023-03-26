import { ethers } from "ethers"

async function GetMinimumTokenMintUtil(contractAbi, contractAddress, runContractFunction) {
    const minTokenMintOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "MIN_TOKEN_TO_MINT",
    }

    const minTokenMint = await runContractFunction({
        params: minTokenMintOpt,
        onSuccess: (result) => console.log(result),
        onError: (error) => console.log(error),
    })

    return minTokenMint
}

async function GetTotalCDTokenOwnUtil(contractAbi, contractAddress, runContractFunction, account) {
    const currentCDOwnedOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "balanceOf",
        params: { account: account },
    }

    const CDOwnedWei = await runContractFunction({
        params: currentCDOwnedOpt,
        onSuccess: (result) => console.log(result),
        onError: (error) => console.log(error),
    })
    const CDOwned = ethers.utils.formatEther(CDOwnedWei)
    console.log("CDOwned: ", CDOwned)
    return CDOwned
}

async function MintCryptoDevTokenUtil(
    EthValue,
    mintAmount,
    contractAddress,
    contractAbi,
    runContractFunction,
    handleMintSuccess
) {
    console.log("Minting...")

    console.log("Minting " + mintAmount + " CryptoDevToken")
    console.log("eth sent " + EthValue + " Eth")

    const EthValueWei = ethers.utils.parseEther(EthValue)
    const mintAmountWei = ethers.utils.parseEther(mintAmount)

    const mintOption = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "mint",
        msgValue: EthValueWei,
        params: { amount: mintAmountWei },
    }

    await runContractFunction({
        params: mintOption,
        onSuccess: handleMintSuccess,
        onError: (error) => console.log(error),
    })
}

async function GetBalanceOfAccountUtil(contractAddress, contractAbi, runContractFunction, accountAddress) {
    const balanceOfAccountOpt = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "balanceOf",
        params: { account: accountAddress },
    }

    const balanceOfAccountWei = await runContractFunction({
        params: balanceOfAccountOpt,
        onError: (error) => console.log(error),
    })

    if (balanceOfAccountWei != null) {
        const balanceOfAccount = ethers.utils.formatEther(balanceOfAccountWei)
        console.log("balanceOfAccount: ", balanceOfAccount)
        return balanceOfAccount
    }
    console.log("balanceOfAccount: ", null)
    return
}

export { GetMinimumTokenMintUtil, GetTotalCDTokenOwnUtil, MintCryptoDevTokenUtil, GetBalanceOfAccountUtil }
