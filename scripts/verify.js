// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  let address = JSON.parse(fs.readFileSync('contracts.json'));

  try {
    //Validator
    await hre.run("verify:verify", {
      address: address.validator,
      constructorArguments: [
        [
          '0xB599AFfea55046F8acA51c65c71DEa1de80b5128'
        ],
        1,
        1
      ]
    });
  } catch { }

  //Registry
  try {
    await hre.run("verify:verify", {
      address: address.registry,
    });
  } catch { }

  //Vault
  try {
    await hre.run("verify:verify", {
      address: address.vault,
    });
  } catch { }

  //Admin
  try {
    await hre.run("verify:verify", {
      address: address.admin,
      contract: 'contracts/Admin.sol:Admin'
    });
  } catch { }

  //Get initialization function call
  let ABI = [
    "function initialize()"
  ];
  let iface = new ethers.utils.Interface(ABI);
  let data = iface.encodeFunctionData("initialize", []);

  //Proxy
  try {
    await hre.run("verify:verify", {
      address: address.proxy,
      contract: 'contracts/VaultProxy.sol:VaultProxy',
      constructorArguments: [
        address.vault,
        address.admin,
        data
      ]
    });
  } catch { }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
