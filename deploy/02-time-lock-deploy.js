const { getNamedAccounts, deployments, ethers } = require("hardhat")

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("Deploying TimeLock...")

  const MIN_DELAY = 3600

  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, [], []],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
}

module.exports.tags = ["all", "timelock"]
