const { network } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains } = require("../helper-hardhat-config")
const contractAddressess = require("../constants/contractAddressess.json")
const { writeAddress } = require("../utils/writeAddress")
require("dotenv").config()

module.exports = async () => {
    const args = []
    console.log("---------------------------")

    const exchangeContract = await ethers.getContractFactory("ExchangeV2")
    const exchange = await exchangeContract.deploy()
    await exchange.deployed()

    console.log("---------------------------")

    writeAddress(exchange, "ExchangeV2")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifing...")
        await verify(exchange.address, [args])
    }
}

module.exports.tags = ["all", "exchange"]
