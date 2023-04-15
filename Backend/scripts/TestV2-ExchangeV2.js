const contractAddressess = require("../constants/contractAddressess.json")
const { network, ethers } = require("hardhat")

async function callNameSymbol() {
    const chainId = network.config.chainId.toString()
    const proxyAddress = contractAddressess[chainId]["Proxy"]
    const exchange = await ethers.getContractAt("ExchangeV2", proxyAddress)
    const name = await exchange.name()
    const symbol = await exchange.symbol()

    console.log("name: ", name)
    console.log("symbol: ", symbol)
}

callNameSymbol()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
