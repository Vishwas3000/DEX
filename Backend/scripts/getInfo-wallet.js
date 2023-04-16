const { ethers, network } = require("hardhat")
const contractAddressess = require("../constants/contractAddressess.json")

async function getAdminAndImp() {
    const chainId = network.config.chainId.toString()
    const exchange = await ethers.getContractAt("ExchangeV2", contractAddressess[chainId]["Proxy"])

    const admin = await exchange.admin()
    console.log("admin: ", admin)
}

getAdminAndImp()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
