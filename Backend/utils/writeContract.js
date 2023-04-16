const fs = require("fs")
const { network, ethers } = require("hardhat")
const {
    contractAddressessPath,
    contractAbiPath,
    frontendAbiPath,
    frontendAddressPath,
} = require("../helper-hardhat-config")

async function writeAbi(contract, contractName) {
    const filepath = contractAbiPath + `${contractName}-abi.json`
    const filepath_frontend = frontendAbiPath + `${contractName}-abi.json`
    fs.writeFileSync(filepath, contract.interface.format(ethers.utils.FormatTypes.json))
    fs.writeFileSync(filepath_frontend, contract.interface.format(ethers.utils.FormatTypes.json))
    console.log("Writter Contract Abi: ", contractName)
}

async function writeAddress(contract, contractName) {
    const filepath = contractAddressessPath
    const filepath_frontend = frontendAddressPath

    await _writeAddress(contract, contractName, filepath)
    await _writeAddress(contract, contractName, filepath_frontend)
    console.log("Written Contract Address: ", contractName)
}

async function _writeAddress(contract, contractName, filepath) {
    const address = contract.address
    const chainId = network.config.chainId.toString()
    const name = contractName.toString()

    const contractAddressess = JSON.parse(fs.readFileSync(filepath, "utf8"))

    if (chainId in contractAddressess) {
        contractAddressess[chainId][name] = address
    } else {
        contractAddressess[chainId] = { [name]: address }
    }

    fs.writeFileSync(filepath, JSON.stringify(contractAddressess))
}

module.exports = { writeAddress, writeAbi }
