const { getNamedAccounts, deployments, ethers } = require("hardhat")

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const governorContract = await ethers.getContract("GovernorContract", deployer)
  const timeLock = await ethers.getContract("TimeLock", deployer)

  log("Setting Up Roles...")

  const proposerRole = await timeLock.PROPOSER_ROLE()
  const executorRole = await timeLock.EXECUTOR_ROLE()
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()

  const proposerTx = await timeLock.grantRole(proposerRole, governorContract.address)
  await proposerTx.wait(1)
  const executorTx = await timeLock.grantRole(executorRole, ethers.constants.AddressZero)
  await executorTx.wait(1)
  const revokeTx = await timeLock.revokeRole(adminRole, deployer)
  await revokeTx.wait(1)
}

module.exports.tags = ["all", "setupcontract"]
