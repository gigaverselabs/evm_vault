// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IERC721Mintable {
  function mint(address _to, uint256 _tokenId) external returns (bool);
  function mintNew(address _to) external returns (uint256 _tokenId);
}