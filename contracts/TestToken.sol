// contracts/TestToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Enumarable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC721Enumerable, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdTracker;

    string public baseTokenURI;

    uint256 public constant TOTAL_SUPPLY = 10000;

    constructor() ERC721("TestToken", "TT") {}

    function totalToken() public view returns (uint256) {
        return _tokenIdTracker.current();
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        baseTokenURI = baseURI;
    }

    function _mintAnElement(address _to, uint256 _tokenId) private {
        _tokenIdTracker.increment();
        _safeMint(_to, _tokenId);
    }

    // function mint(uint256 _tokenId) public {
    function mint() public {
        uint256 total = totalToken();
        require(total + 1 <= TOTAL_SUPPLY, "Max limit");

        address wallet = _msgSender();

        uint256 _tokenId = total+1;

        require(
            rawOwnerOf(_tokenId) == address(0) &&
                _tokenId > 0 &&
                _tokenId <= TOTAL_SUPPLY,
            "Token already claimed"
        );
        _mintAnElement(wallet, _tokenId);
    }
}