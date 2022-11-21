const { getNamedAccounts, deployments, ethers } = require("hardhat")

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  const timeLock = await ethers.getContract("TimeLock")
  const boxContract = await ethers.getContractAt("Box", box.address)
  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address)
  await transferOwnerTx.wait(1)

  log("You Did it :)")
}

module.exports.tags = ["all", "boxcontract"]
