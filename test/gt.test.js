const { assert, expect } = require("chai")
const { ethers, getNamedAccounts, deployments } = require("hardhat")

describe("GT", function () {
  let gtContract, deployer

  beforeEach(async function () {
    await deployments.fixture(["all"])
    const accounts = ethers.getSigners()
    deployer = accounts[0]
    gtContract = await ethers.getContract("GovernanceToken", deployer)
  })
  describe("TotalSupply", function () {
    it("check totalSupply of Tokens", async function () {
      const getTotalSupply = await gtContract.getTotalSupply()
      console.log(getTotalSupply.toString())
      assert.equal(getTotalSupply.toString(), "1000000000000000000000000")
    })
  })
})
