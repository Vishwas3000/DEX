import exchangeAbi from "./ExchangeV1-abi.json" assert { type: "json" }
import cryptoDevTokenAbi from "./CryptoDevToken-abi.json" assert { type: "json" }
import contractAddresses from "./contractAddressess.json" assert { type: "json" }

const BLOCK_WAIT_TIME = 1

async function getImplementationAbi() {}

export { exchangeAbi, cryptoDevTokenAbi, contractAddresses, BLOCK_WAIT_TIME }
