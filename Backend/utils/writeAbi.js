const fs = require("fs")
const { network, ethers } = require("hardhat")

async function updateAbi(contract, filePath) {
    fs.writeFileSync(filePath, contract.interface.format(ethers.utils.FormatTypes.json))
}

module.exports = { updateAbi }
