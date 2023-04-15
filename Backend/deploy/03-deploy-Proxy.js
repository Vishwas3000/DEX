const { network } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains } = require("../helper-hardhat-config")
const contractAddressess = require("../constants/contractAddressess.json")
const { writeAddress } = require("../utils/writeAddress")
require("dotenv").config()

module.exports = async () => {
    const chainId = network.config.chainId.toString()
    const args = [contractAddressess[chainId]["CryptoDevToken"], contractAddressess[chainId]["ExchangeV1"]]
    const proxyContract = await ethers.getContractFactory("Proxy")

    console.log("---------------------------")
    const proxy = await upgrades.deployProxy(proxyContract, args, {
        initializer: "initialize",
        kind: "transparent",
    })
    await proxy.deployed()

    console.log("---------------------------")

    writeAddress(proxy, "Proxy")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifing...")
        await verify(proxy.address, args)
    }
}

module.exports.tags = ["all", "proxy"]
