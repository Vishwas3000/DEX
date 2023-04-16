const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { writeAddress, writeAbi } = require("../utils/writeContract.js")
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
    writeAbi(proxyAdmin, "ProxyAdmin")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifing...")
        await verify(proxyAdmin.address, args)
    }
}

module.exports.tags = ["all", "proxyAdmin"]
