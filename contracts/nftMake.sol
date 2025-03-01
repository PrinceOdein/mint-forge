// contracts/MyNFT.sol
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract nftMake is ERC721 {
    uint256 private _tokenId;
    constructor() ERC721("MyNFT", "MNFT") {}
    
    function mintNFT(address to) public returns (uint256) {
        _tokenId += 1;
        _mint(to, _tokenId);
        return _tokenId;
    }
}