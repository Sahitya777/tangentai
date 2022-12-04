import config from "context/config";



export const mintNFT = ({ tezos, amount, metadata }) => {
	return async () => {
		try {
			const contract = await tezos.wallet.at(config.contractAddress);
			let bytes = "";
			for (var i = 0; i < metadata.length; i++) {
				bytes += metadata.charCodeAt(i).toString(16).slice(-4);
			}
			const op = await contract.methods.mint(amount, bytes).send();
			await op.confirmation();
            
		} catch (e) {
			console.log(e);
		}
	};
};