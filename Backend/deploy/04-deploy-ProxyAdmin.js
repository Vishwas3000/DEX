const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const contractAddressess = require("../constants/contractAddressess.json")
const { writeAddress } = require("../utils/writeAddress")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async () => {
    const chainId = network.config.chainId.toString()

    const args = []
    const proxyAdminContract = await ethers.getContractFactory("ProxyAdmin")

    console.log("---------------------------")
    const proxyAdmin = await proxyAdminContract.deploy()
    await proxyAdmin.deployed()

    console.log("---------------------------")

    writeAddress(proxyAdmin, "ProxyAdmin")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifing...")
        await verify(proxyAdmin.address, args)
    }
}

module.exports.tags = ["all", "proxyAdmin"]
