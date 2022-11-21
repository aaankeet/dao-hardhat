const networkConfig = {
  default: {
    name: "hardhat",
  },
  31337: {
    name: "localhost",
  },
  5: {
    name: "goerli",
  },
}

const developmentChains = ["localhost", "hardhat"]
const proposalFiles = "./proposals.json"

module.exports = { developmentChains, proposalFiles, networkConfig }
