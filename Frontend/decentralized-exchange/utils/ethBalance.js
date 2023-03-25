import { ethers } from "ethers"

async function GetEthBalanceUtil(address) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(address)
    const balanceInEth = ethers.utils.formatEther(balance)
    return balanceInEth
}

export { GetEthBalanceUtil }
