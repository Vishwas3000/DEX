const { network, ethers } = require("hardhat")
const contractAddressess = require("../constants/contractAddressess.json")

require("dotenv").config()

async function ImplementExchangeProxy() {
    const chainId = network.config.chainId.toString()
    const exchangeV1 = await ethers.getContractFactory("ExchangeV2")
    const exProxy = await upgrades.forceImport(contractAddressess[chainId]["Proxy"], exchangeV1, {
        kind: "transparent",
    })
    console.log("exProxy Upgraded: ", exProxy)
}

ImplementExchangeProxy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
