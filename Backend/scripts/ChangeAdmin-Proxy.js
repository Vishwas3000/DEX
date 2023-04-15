const { ethers, network } = require("hardhat")
const contractAddressess = require("../constants/contractAddressess.json")
async function ChangeProxyAdmin() {
    const chainId = network.config.chainId.toString()
    const proxy = await ethers.getContractAt("Proxy", contractAddressess[chainId]["Proxy"])

    const txReciept = await proxy.changeAdmin(contractAddressess[chainId]["ProxyAdmin"])
    const txResponse = await txReciept.wait(1)
    console.log(txResponse)
}

function main() {
    ChangeProxyAdmin()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error)
            process.exit(1)
        })
}

main()
