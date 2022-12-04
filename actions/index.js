
import config from "context/config";

export const mintNFT = ({tezos, metadata }) => {
    return async (dispatch) =>{
        try{
            const contract = await tezos.wallet.at(config.contractAddress);
            let bytes="";
            for (var i=0; i < metadata.length; i++){
                bytes += metadata.charCodeAt(i).toString(16).slice(-4);
            }
            const op = await contract.methods.mint(bytes).send();
            await op.confirmation();
            dispatch();

            
        }catch (e){
            console.log(e);
        }
    };
};