// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SoulBulbs is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    address public artist;
    address public txFeeToken;
    uint public txFeeAmount;
    mapping(address => bool) public excludedList;

    Counters.Counter private _tokenIdCounter;

    mapping(string => uint8) existingURIs;

    constructor(
      address _artist,
      address _txFeeToken,
      uint _txFeeAmount
    ) ERC721("SoulBulbs", "SLB") {
      artist = _artist;
      txFeeToken = _txFeeToken;
      txFeeAmount = _txFeeAmount;
      excludedList[_artist] = true;
      _mint(artist, 0);
    }

    function setExcluded(address excluded, bool status) external {
      require(msg.sender == artist, "artist only");
      excludedList[excluded] = status;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    
    {
        return super.tokenURI(tokenId);
    }

function isContentOwned(string memory uri) public view returns (bool) {
  return existingURIs[uri] == 1;
}

function payToMint(
  address recipient,
  string memory metadataURI
) public payable returns (uint256) {
    require(existingURIs[metadataURI] != 1, "NFT Already Minted");
    require (msg.value >= 0.05 ether, "Not Enough ETH");

    uint256 newItemId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    existingURIs[metadataURI] = 1;

    _mint(recipient, newItemId);
    _setTokenURI(newItemId, metadataURI);
  }

function count() public view returns (uint256) {
  return _tokenIdCounter.current();
}


}
