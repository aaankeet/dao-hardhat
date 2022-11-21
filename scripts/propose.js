// 1. Propose something like- "store value 77 in Box.sol"
// 2. Once somebody proposes something, We'll Vote on that proposal.
// 3. And If the Quorom Precentage hits, Then we can execute this Proposal.

const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")
const { developmentChains, proposalFiles } = require("../helper-hardhat-config")
const fs = require("fs-extra")

const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in the Box"
const VOTING_DELAY = 4

async function propose(args, functionToCall, proposalDescription) {
  const governor = await ethers.getContract("GovernorContract")
  const box = await ethers.getContract("Box")
  const chainId = network.config.chainId
  const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
  console.log(encodedFunctionCall)

  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
  console.log(`Proposing description: \n ${proposalDescription}`)

  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  )
  // If working on a development chain, we will push forward till we get to the voting period.
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY)
  }
  const proposeReceipt = await proposeTx.wait(1)
  const proposalId = proposeReceipt.events[0].args.proposalId
  console.log(`Proposed with proposal ID: ${proposalId}`)

  const proposalState = await governor.state(proposalId)
  const proposalSnapShot = await governor.proposalSnapshot(proposalId)
  const proposalDeadline = await governor.proposalDeadline(proposalId)

  // Save porposalId to Json file
  let proposals = JSON.parse(fs.readFileSync(proposalFiles, "utf8"))
  fs.writeFileSync(proposalFiles, JSON.stringify({ [chainId]: [proposalId.toString()] }))

  // The state of the proposal. 1 is not passed. 0 is passed.
  console.log(`Current Proposal State: ${proposalState}`)
  // What block # the proposal was snapshot
  console.log(`Current Proposal Snapshot: ${proposalSnapShot}`)
  // The block number the proposal voting expires
  console.log(`Current Proposal Deadline: ${proposalDeadline}`)
}

propose([77], "store", PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
