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

const frontendConsts = "../Frontend/decentralized-exchange/constants/"
const contractAddressessPath = "./constants/contractAddressess.json"
module.exports = {
    networkConfig,
    developmentChains,
    frontendConsts,
    contractAddressessPath,
}
