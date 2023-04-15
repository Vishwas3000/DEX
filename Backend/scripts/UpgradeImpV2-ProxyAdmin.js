const { ethers, network } = require("hardhat")
const contractAddressess = require("../constants/contractAddressess.json")

async function ChangeImplementation() {
    const chainId = network.config.chainId.toString()
    const proxyAdmin = await ethers.getContractAt("ProxyAdmin", contractAddressess[chainId]["ProxyAdmin"])

    const txReciept = await proxyAdmin.upgrade(
        contractAddressess[chainId]["Proxy"],
        contractAddressess[chainId]["ExchangeV2"]
    )

    const txResponse = await txReciept.wait(1)

    console.log("Changed Implementation: ", txResponse)
}

ChangeImplementation()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
