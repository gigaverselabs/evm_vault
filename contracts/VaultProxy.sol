// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract VaultProxy is TransparentUpgradeableProxy {
    constructor(
        address _logic,
        address admin_,
        bytes memory data) TransparentUpgradeableProxy(_logic, admin_, data) {
        }
}