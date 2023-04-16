const { ethers, network } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
    },
    1: {
        name: "mainnet",
    },
    11155111: {
        name: "sepolia",
    },
}
const developmentChains = ["hardhat", "localhost"]

const contractAddressessPath = "./constants/contractAddressess.json"
const contractAbiPath = "./constants/"
const frontendAddressPath = "../Frontend/decentralized-exchange/constants/contractAddressess.json"
const frontendAbiPath = "../Frontend/decentralized-exchange/constants/"

module.exports = {
    networkConfig,
    developmentChains,
    contractAddressessPath,
    contractAbiPath,
    frontendAddressPath,
    frontendAbiPath,
}
