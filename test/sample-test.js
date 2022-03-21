const { expect } = require("chai");
const { constants } = require("ethers");
const { ethers } = require("hardhat");

describe("SoulBulbs", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const SoulBulbs = await ethers.getContractFactory("SoulBulbs");
    const soulBulbs = await SoulBulbs.deploy();
    await soulBulbs.deployed();

    const recipient = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc";
    const metadataURI = "cid/SoulBulbs001.png";

    let balance = await soulBulbs.balanceOf(recipient);
    expect(balance).to.equal(0);
    
    const newlyMintedToken = await soulBulbs.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther("0.05") });

     
    //wait until the transaction is minted
    await newlyMintedToken.wait();

    balance = await soulBulbs.balanceOf(recipient);
    expect(balance).to.equal(1);

    expect (await soulBulbs.isContentOwned(metadataURI)).to.equal(true);
  });
});
