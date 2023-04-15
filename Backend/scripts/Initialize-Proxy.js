const { network, ethers } = require("hardhat")
const contractAddressess = require("../constants/contractAddressess.json")

async function Initialize() {
    const chainId = network.config.chainId.toString()
    const proxy = await ethers.getContractAt("Proxy", contractAddressess[chainId]["Proxy"])
    const cryptoDevToken = contractAddressess[chainId]["CryptoDevToken"]
    const exchangeV1 = contractAddressess[chainId]["ExchangeV1"]
    const txReciept = await proxy.initialize(cryptoDevToken, exchangeV1)
    const txResponse = await txReciept.wait(1)

    console.log("Initializer: ", txResponse)
}

Initialize()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
