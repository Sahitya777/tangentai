import config from "context/config";

export const mintNFT = async ({ tezos, metadata }) => {
  try {
    const contract = await tezos.wallet.at(config.contractAddress);
    let bytes = "";
    for (var i = 0; i < metadata.length; i++) {
      bytes += metadata.charCodeAt(i).toString(16).slice(-4);
    }
    console.log("meta", bytes);
    const op = await contract.methods
      .mint(bytes)
      .send({ amount: config.NFT_PRICE });
    await op.confirmation();
  } catch (e) {
    console.log(e);
  }
};
