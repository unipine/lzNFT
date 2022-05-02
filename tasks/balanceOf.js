module.exports = async function (taskArgs, hre) {
    const tokenId = taskArgs.tokenId
    const lzNFT = await ethers.getContract("LayerZeroNFT")

    console.log(`[source] lzNFT.address: ${lzNFT.address}`)

    try {
        let address = await lzNFT.ownerOf(tokenId)

        console.log(`✅ [${hre.network.name}] ownerOf(${tokenId})`)
        console.log(` Owner address: ${address}`)
    } catch (e) {
        console.error(e)
    }
}