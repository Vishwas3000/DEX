const fs = require("fs")
const { network } = require("hardhat")
const { contractAddressessPath } = require("../helper-hardhat-config")

async function writeAddress(contract, contractName) {
    const address = contract.address
    const chainId = network.config.chainId.toString()
    const name = contractName.toString()

    const contractAddressess = JSON.parse(fs.readFileSync(contractAddressessPath, "utf8"))

    if (chainId in contractAddressess) {
        contractAddressess[chainId][name] = address
    } else {
        contractAddressess[chainId] = { [name]: address }
    }

    console.log("Written : ", contractName, address)

    fs.writeFileSync(contractAddressessPath, JSON.stringify(contractAddressess))
}

module.exports = { writeAddress }
