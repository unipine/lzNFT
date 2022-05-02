module.exports = async function (taskArgs, hre) {
    const lzNFT = await ethers.getContract("LayerZeroNFT")

    console.log(`[source] lzNFT.address: ${lzNFT.address}`)

    try {
        let tx = await (await lzNFT.mint()).wait()

        console.log(`✅ [${hre.network.name}] mint()`)
        console.log(` tx: ${tx.transactionHash}`)

        let tokenID = await ethers.provider.getTransactionReceipt(tx.transactionHash)

        console.log(` LZNFT nftId: ${parseInt(Number(tokenID.logs[0].topics[3]))}`)
    } catch (e) {
        console.error(e)
    }
}