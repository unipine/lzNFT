const CHAIN_ID = require("../constants/chainIds.json")
const { getDeploymentAddresses } = require("../utils/readStatic")

module.exports = async function (taskArgs, hre) {
    const dstChainId = CHAIN_ID[taskArgs.targetNetwork]
    const dstAddr = getDeploymentAddresses(taskArgs.targetNetwork)["LayerZeroNFT"]
    const ownership = await ethers.getContract("LayerZeroNFT")

    console.log(`[source] ownership.address: ${ownership.address}`)

    try {
        let tx = await (await ownership.setTrustedRemote(dstChainId, dstAddr)).wait()
        console.log(`✅ [${hre.network.name}] setTrustedRemote(${dstChainId}, ${dstAddr})`)
        console.log(` tx: ${tx.transactionHash}`)
    } catch (e) {
        console.error(e)
    }
}