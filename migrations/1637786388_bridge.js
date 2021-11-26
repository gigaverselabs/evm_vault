const GigaVault = artifacts.require("GigaVault");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.

  _deployer.deploy(GigaVault);
};
