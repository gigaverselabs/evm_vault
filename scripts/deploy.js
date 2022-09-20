// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

const { deploy } = require('./full_deploy.js');

async function main() {
  let address = await deploy(hre.ethers, "0xB599AFfea55046F8acA51c65c71DEa1de80b5128", true);

  fs.writeFileSync('contracts.json', JSON.stringify(address));
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  //Step 1: Deploy registry
  //Step 2: Deploy validators
  //Step 3: Deploy Vault
  //Step 4: Set Vault registry to registry
  //Step 5: Set validators contract in registry
  //Step 6: Add Validator in validators contract
  //Step 7: Add Mapping of ERC721 token to registry
  //Step 8: Check verification of signatures

  // const [owner] = await hre.ethers.getSigners();
  // console.log(owner.address);

  // const Validator = await ethers.getContractFactory("Validator");
  // const validator = await Validator.deploy(
  //   [
  //     '0x24b3aA6bf1B24ad8c4B19CF9492EB352EfBA3A88'
  //   ],
  //   1,
  //   1
  // );
  // await validator.deployed();
  // console.log("Validator deployed to:", validator.address);

  // const Registry = await hre.ethers.getContractFactory("Registry");
  // const registry = await Registry.deploy();
  // await registry.deployed();
  // console.log("Registry deployed to:", registry.address);
  // await registry.updateContract("VALIDATOR", validator.address);
  // console.log("Registry VALIDATOR set to: ", validator.address);

  // const Vault = await hre.ethers.getContractFactory("GigaVault");
  // const vault = await Vault.deploy();
  // await vault.deployed();
  // console.log("Vault deployed to:", vault.address);


  // const Admin = await hre.ethers.getContractFactory("Admin");
  // const admin = await Admin.deploy();
  // await admin.deployed();
  // console.log("Admin deployed to:", admin.address);

  // //Get initialization function call
  // let ABI = [
  //   "function initialize()"
  // ];
  // let iface = new ethers.utils.Interface(ABI);
  // let data = iface.encodeFunctionData("initialize", []);

  // const Proxy = await hre.ethers.getContractFactory("VaultProxy");
  // const proxy = await Proxy.deploy(
  //   vault.address, //logic contract
  //   admin.address, //admin contract
  //   data
  // );
  // await proxy.deployed();
  // console.log("Proxy deployed to:", proxy.address);

  // const proxied_vault = await ethers.getContractAt("GigaVault", proxy.address);
  // await proxied_vault.updateRegistry(registry.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
