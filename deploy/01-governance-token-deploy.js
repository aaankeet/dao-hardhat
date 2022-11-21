const { getNamedAccounts, deployments, ethers } = require("hardhat")

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  log(`Delegating to ${deployer}`)
  await delegate(governanceToken.address, deployer)
  log("Delegated!")
}
// NOW, After deploying this contract, Nobody have Voting power Yet, Becoz Nobody have token delegated to them.

// So, It's why we're gonna delegate the token to our deployer
const delegate = async (governanceTokenAddress, delegatedAccount) => {
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
  const transactionResponse = await governanceToken.delegate(delegatedAccount)
  await transactionResponse.wait(1)
  console.log(`Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}

module.exports.tags = ["all", "governanceToken"]
