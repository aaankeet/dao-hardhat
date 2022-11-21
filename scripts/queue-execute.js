const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")
const { moveTime } = require("../utils/move-time")

const NEW_STORE_VALUE = 77
const MIN_DELAY = 3600

async function queueAndExecute() {
  const box = await ethers.getContract("Box")
  const FUNCTION_CAll = "store"
  const args = [NEW_STORE_VALUE]
  const encodedFunctionCall = box.interface.encodeFunctionData(FUNCTION_CAll, args)
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("Proposal #1: Store 77 in the Box")
  )

  const governor = await ethers.getContract("GovernorContract")

  console.log("Queueing...")
  const queueTx = await governor.queue([box.address], [0], [encodedFunctionCall], descriptionHash)
  await queueTx.wait(1)

  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1)
    await moveBlocks(1)
  }

  console.log("Executing...")
  const executeTx = await governor.execute(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  )

  await executeTx.wait(1)

  const boxNewValue = await box.retrieve()
  console.log(boxNewValue.toString())
}

queueAndExecute()
  .then(() => process.exit)
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
