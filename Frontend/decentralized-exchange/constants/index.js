import exchangeV1Abi from "./ExchangeV1-abi.json" assert { type: "json" }
import exchangeV2Abi from "./ExchangeV2-abi.json" assert { type: "json" }
import proxyAbi from "./Proxy-abi.json" assert { type: "json" }
import proxyAdminAbi from "./ProxyAdmin-abi.json" assert { type: "json" }
import cryptoDevTokenAbi from "./CryptoDevToken-abi.json" assert { type: "json" }
import contractAddresses from "./contractAddressess.json" assert { type: "json" }

const BLOCK_WAIT_TIME = 1
let IMPLEMENTATION_VERSION = 1

function getImplementationAbi(impVersion) {
    switch (impVersion) {
        case 1:
            return exchangeV1Abi
        case 2:
            return exchangeV2Abi
        default:
            throw new Error("Invalid implementation version")
    }
}

function getImplementationAddress(chainId, impVersion) {
    switch (impVersion) {
        case 1:
            return contractAddresses[chainId]["ExchangeV1"]
        case 2:
            return contractAddresses[chainId]["ExchangeV2"]
        default:
            throw new Error("Invalid implementation version")
    }
}

export {
    cryptoDevTokenAbi,
    contractAddresses,
    BLOCK_WAIT_TIME,
    proxyAbi,
    proxyAdminAbi,
    getImplementationAbi,
    getImplementationAddress,
}
