import { ethers } from 'ethers';
import WalletBalance from './WalletBalance';
import { useEffect, useState } from 'react';
import SoulBulbs from '/Users/petermazzocco/myapp/artifacts/contracts/SoulBulbs.sol/SoulBulbs.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, SoulBulbs.abi, signer);

function Home() {

    const [totalMinted, setTotalMinted] = useState(0);
    useEffect(() => {
        getCount();
    }, []);

    const getCount = async () => {
        const count = await contract.count();
        setTotalMinted(parseInt(count));
    };

    return(
        <div>
            <WalletBalance />

            <h1>SoulBulbs Essential</h1>
                {Array(totalMinted + 1)
                .fill(0)
                .map((_, i) => (
                    <div key ={i}>
                        <NFTImage tokenId={i} />
                    </div>

                ))}
        </div>
    );
}

function NFTImage({ tokenID, getCount}) {
    const contentID = 'QmUbSCqwn8LY77rte895m1KVbK2QNb5V8MEtSrHGc2a5DT';
    const metadataURI = 'https://gateway.pinata.cloud/ipfs/QmcxXwM5R9kktM4SAJJqyrGqgQM41Wfcf9GykkoCU6ozYx.json';
    const imageURI = 'https://gateway.pinata.cloud/ipfs/QmUbSCqwn8LY77rte895m1KVbK2QNb5V8MEtSrHGc2a5DT.png'

    const [isMinted, setIsMinted] = useState(false);

    useEffect(() => {
        getMintedStatus();
    }, [isMinted]);

    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metadataURI);
        console.log(result)
        setIsMinted(result);
    };

    const mintToken = async () => {
        const connection = contract.connect(signer);
        const addr = connection.address;
        const result = await contract.payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther('0.05'),
        });
        
        await result.wait();
        getMintedStatus();
    };

async function getURI () {
    const uri = await contract.tokenURI(tokenID);
 }
// https://www.entspecialistspc.com/wp-content/uploads/2018/12/no-image.jpg
return (
    <div>
        <img src={isMinted ? imageURI: 'https://pbs.twimg.com/media/FOWYfifVIAoOkxX?format=jpg&name=large'}></img>
        <div>
            <h5>ID #0001</h5>
            {!isMinted ? (
                <button onClick={mintToken}>
                    Mint
                </button>
            ) : (
             <button onClick={getURI}>
                 Taken! Show URI
             </button>
            )}
        </div>
    </div>
);

}

export default Home;