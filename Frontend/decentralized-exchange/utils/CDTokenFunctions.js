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
    console.log("account: ", account)

    const CDOwned = await runContractFunction({
        params: currentCDOwnedOpt,
        onSuccess: (result) => console.log(result),
        onError: (error) => console.log(error),
    })
    console.log("CDOwned: ", CDOwned)
    const CDOwnedWei = ethers.utils.formatEther(CDOwned)
    return CDOwnedWei
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

    const mintOption = {
        abi: contractAbi,
        contractAddress: contractAddress,
        functionName: "mint",
        msgValue: EthValueWei,
        params: { amount: mintAmount },
    }

    await runContractFunction({
        params: mintOption,
        onSuccess: handleMintSuccess,
        onError: (error) => console.log(error),
    })
}

export { GetMinimumTokenMintUtil, GetTotalCDTokenOwnUtil, MintCryptoDevTokenUtil }
