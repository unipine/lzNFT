const { ethers } = require("hardhat");
const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")

async function main() {
  const signers = await ethers.getSigners()
  const factory = await ethers.getContractFactory("Ownership", signers[0])

  console.log('> Deploying...\n')

  const lzEndpointAddress = LZ_ENDPOINTS[hre.network.name]

  console.log(`> [${hre.network.name}] LayerZero Endpoint address: ${lzEndpointAddress}\n`)

  const contract = await factory.deploy(lzEndpointAddress)
  await contract.deployed()

  console.log('> Ownership deployed to: ', contract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
