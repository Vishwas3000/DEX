const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")
const { developmentChains } = require("../helper-hardhat-config")
const { writeAddress } = require("../utils/writeAddress.js")

require("dotenv").config()

module.exports = async () => {
    const args = []

    console.log("---------------------------")
    console.log("Deploying CryptoDevToken...")
    const cryptpDevContract = await ethers.getContractFactory("CryptoDevToken")
    const cryptoDev = await cryptpDevContract.deploy(args)
    await cryptoDev.deployed()
    console.log("CryptoDevToken deployed to:", cryptoDev.address)
    console.log("---------------------------")

    await writeAddress(cryptoDev, "CryptoDevToken")

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log("Verifing...")
        await verify(cryptoDev.address, args)
    }
}

module.exports.tags = ["all", "devToken"]
