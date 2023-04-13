const { network } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains } = require("../helper-hardhat-config")
const contractAddressess = require("../constants/contractAddressess.json")
const { writeAddress } = require("../utils/writeAddress")
require("dotenv").config()

module.exports = async () => {
    const chainId = network.config.chainId.toString()

    const cryptoDevTokenAddress = contractAddressess[chainId]["CryptoDevToken"]

    const cryptoDevToken = await ethers.getContractAt("CryptoDevToken", cryptoDevTokenAddress)
    console.log("devToken address: ", cryptoDevToken.address)

    const args = cryptoDevToken.address

    console.log("---------------------------")

    const exchangeContract = await ethers.getContractFactory("ExchangeV1")
    const exchange = await exchangeContract.deploy(args)
    await exchange.deployed()

    console.log("---------------------------")

    writeAddress(exchange, "ExchangeV1")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifing...")
        await verify(exchange.address, args)
    }
}

module.exports.tags = ["all", "exchange"]
