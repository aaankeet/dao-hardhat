const { getNamedAccounts, deployments, ethers } = require("hardhat")

const VOTING_DELAY = 1
const VOTING_PERIOD = 5
const QUORUM_PERCENTAGE = 4

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()

  log("Deploying Governor...")

  const timeLock = await get("TimeLock")
  const governanceToken = await get("GovernanceToken")

  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governanceToken.address,
      timeLock.address,
      QUORUM_PERCENTAGE,
      VOTING_PERIOD,
      VOTING_DELAY,
    ],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
}

module.exports.tags = ["all", "governor"]
