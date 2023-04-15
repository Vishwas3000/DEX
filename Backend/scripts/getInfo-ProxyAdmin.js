const { ethers, network } = require("hardhat")
const contractAddressess = require("../constants/contractAddressess.json")

async function getAdminAndImp() {
    const chainId = network.config.chainId.toString()
    const proxyAdmin = await ethers.getContractAt("ProxyAdmin", contractAddressess[chainId]["ProxyAdmin"])
    const proxyAddress = contractAddressess[chainId]["Proxy"]
    let admin = await proxyAdmin.getProxyAdmin(proxyAddress)
    console.log("admin: ", admin)
    // let txResponse = await admin.wait(1)
    // console.log("admin: ", txResponse)

    let implementation = await proxyAdmin.getProxyImplementation(proxyAddress)
    console.log("implementation: ", implementation)
    // txResponse = await implementation.wait(1)
    // console.log("implementation: ", txResponse)
}

getAdminAndImp()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
