const { ethers, network } = require("hardhat")
const { proposalFiles, developmentChains } = require("../helper-hardhat-config")
const fs = require("fs-extra")
const { moveBlocks } = require("../utils/move-blocks")

const index = 0
const VOTING_PERIOD = 5

async function main(proposalIndex) {
  const proposal = JSON.parse(fs.readFileSync(proposalFiles, "utf8"))
  const proposalId = proposal[network.config.chainId][proposalIndex]
  // 0 = Against, 1 = For, 2 = Abstain
  const govenor = await ethers.getContract("GovernorContract")
  const voteWay = 1
  const reason = "Not Need to give Reason"
  const voteTx = await govenor.castVoteWithReason(proposalId, voteWay, reason)
  await voteTx.wait(1)

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1)
  }
  console.log("Voted! Ready To Go!")
  const proposalState = await govenor.state(
    "65398125676558919061430490689665610495211022662441289131204819160559056858590"
  )
  console.log(`Proposal State: ${proposalState}`)
}

main(index)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
