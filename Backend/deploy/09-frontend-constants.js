const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains, frontendConsts } = require("../helper-hardhat-config")
require("dotenv").config()
const fs = require("fs")
const { syncBuiltinESMExports } = require("module")

module.exports = async () => {
    if (process.env.UPDATE_FRONTEND) {
        console.log("writting frontend...")
        await updateContractAbi()
        await updateContractAddresses()
    }
}

async function updateContractAbi() {
    const exchange = await ethers.getContract("Exchange")
    fs.writeFileSync(`${frontendConsts}exchangeAbi.json`, exchange.interface.format(ethers.utils.FormatTypes.json))

    const cryptoDevToken = await ethers.getContract("CryptoDevToken")
    fs.writeFileSync(
        `${frontendConsts}cryptoDevTokenAbi.json`,
        cryptoDevToken.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const exchange = await ethers.getContract("Exchange")
    const chainId = network.config.chainId.toString()
    const contractAddesses = await JSON.parse(fs.readFileSync(`${frontendConsts}contractAddresses.json`, "utf8"))

    if (chainId in contractAddesses) {
        if (!contractAddesses[chainId]["Exchange"].includes(exchange.address)) {
            contractAddesses[chainId]["Exchange"].push(exchange.address)
        }
    } else {
        contractAddesses[chainId] = { Exchange: [exchange.address] }
    }

    fs.writeFileSync(`${frontendConsts}contractAddresses.json`, JSON.stringify(contractAddesses))
}

module.exports.tags = ["all", "frontend"]
