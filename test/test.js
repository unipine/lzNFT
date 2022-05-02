const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Unit tests: ", function () {
  const chainIdSrc = 1
  const chainIdDst = 2
  const name = "Layer Zero NFT"
  const symbol = "LZNFT"

  let alice, bob
  let lzEndpointSrcMock, lzEndpointDstMock
  let LZEndpointMock, LZNFT, Ownership
  let lzNFT, ownership

  before(async function () {
    alice = (await ethers.getSigners())[0]
    bob = (await ethers.getSigners())[1]

    LZEndpointMock = await ethers.getContractFactory("LZEndpointMock")
    LZNFT = await ethers.getContractFactory("LayerZeroNFT")
    Ownership = await ethers.getContractFactory("Ownership")
  })

  beforeEach(async function () {
    lzEndpointSrcMock = await LZEndpointMock.deploy(chainIdSrc)
    lzEndpointDstMock = await LZEndpointMock.deploy(chainIdDst)

    // create two instances
    ownership = await Ownership.deploy(lzEndpointSrcMock.address)
    lzNFT = await LZNFT.deploy(name, symbol, lzEndpointDstMock.address)

    lzEndpointSrcMock.setDestLzEndpoint(lzNFT.address, lzEndpointDstMock.address)
    lzEndpointDstMock.setDestLzEndpoint(ownership.address, lzEndpointSrcMock.address)

    // set each contracts source address so it can send to each other
    await ownership.setTrustedRemote(chainIdDst, lzNFT.address)
    await lzNFT.setTrustedRemote(chainIdSrc, ownership.address)
  })

  it("mint on the source chain and transfer specific token's ownership on the destination chain", async function () {
    // mint ONFT
    const newId = await lzNFT.tokenId()
    await lzNFT.connect(alice).mint()

    // verify the owner of the token is on the source chain
    expect(await lzNFT.ownerOf(newId)).to.be.equal(alice.address)

    // v1 adapterParams, encoded for version 1 style, and 200k gas quote, transfer ownership
    const adapterParam = ethers.utils.solidityPack(["uint16", "uint256"], [1, 225000])
    await ownership._transferOwnership(chainIdDst, bob.address, newId, adapterParam)

    // verify the owner of the token is on the destination chain
    expect(await lzNFT.ownerOf(h)).to.not.equal(bob)
  })
})
