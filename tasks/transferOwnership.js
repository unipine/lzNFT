const CHAIN_ID = require("../constants/chainIds.json")

module.exports = async function (taskArgs, hre) {
    const signers = await ethers.getSigners()
    const to = signers[1]
    const dstChainId = CHAIN_ID[taskArgs.targetNetwork]
    const tokenId = taskArgs.tokenId
    const ownership = await ethers.getContract("Ownership")

    console.log(`[source] ownership.address: ${ownership.address}`)

    let adapterParams = ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000])

    try {
        let tx = await (
            await ownership._transferOwnership(dstChainId, to.address, tokenId, adapterParams, {
                value: ethers.utils.parseEther("1"),
            })
        ).wait()

        console.log(`✅ [${hre.network.name}] send(${dstChainId}, ${tokenId})`)
        console.log(` tx: ${tx.transactionHash}`)
    } catch (e) {
        console.error(e)
    }
}