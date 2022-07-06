require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const PRIVATE_KEY = '2f7e625b5a5b5f8c6662ed82eb4d04965e30779bdaadd7d60c35797ffdfb6edb';

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/c8f0b10f0c7d4bffb5955985211dbfa6",
      accounts: [`${PRIVATE_KEY}`]
    } 
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  etherscan: {
    apiKey: {
    ropsten: "G9EY5T5KY512GW75CN4EBEZQZ2XKQXXGXU"
    }
  }
};
