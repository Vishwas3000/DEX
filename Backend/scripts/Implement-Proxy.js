const { ethers, network } = require("hardhat")
const contractAddressess = require("../constants/contractAddressess.json")
async function Admin() {
    const chainId = network.config.chainId.toString()
    const proxy = await ethers.getContractAt("Proxy", contractAddressess[chainId]["Proxy"])

    let admin = await proxy.admin()
    let txResponse = await admin.wait(1)

    console.log("admin: ", txResponse)

    let implementation = await proxy.implementation()
    txResponse = await implementation.wait(1)
    console.log("implementation: ", txResponse)
}

Admin()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
