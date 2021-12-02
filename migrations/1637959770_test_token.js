const TestToken = artifacts.require("TestToken");


module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(TestToken);

};
