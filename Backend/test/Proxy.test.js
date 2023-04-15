const { assert, expect } = require("chai")
const { ethers, network, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const contractAddressess = require("../constants/contractAddressess.json")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Proxy", function () {
          let proxy, proxyContract, deployer, chainId

          beforeEach(async function () {
              chainId = network.config.chainId.toString()
              const accounts = await ethers.getSigners()
              deployer = accounts[0]

              await deployments.fixture(["all"])

              proxyContract = await ethers.getContractAt("Proxy", contractAddressess[chainId]["Proxy"])
              proxy = await proxyContract.connect(deployer)
          })

          describe("Check init admin", () => {
              it("Should return admin as deployer", async () => {
                  await expect(proxy.admin()).to.emit(proxy, "AdminCalled").withArgs(deployer)
              })

              //   it("Should return Zero implementation address", async () => {
              //       const implementation = await proxy.implementation()
              //       console.log(implementation)
              //       assert(1 == 1)
              //   })
          })
      })
