// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // //Validator
  await hre.run("verify:verify", {
    address: '0xcC41AbE4c12C7DB2fdfD915573145c91C731fb33',
    constructorArguments: [
      [
        '0x24b3aA6bf1B24ad8c4B19CF9492EB352EfBA3A88'
      ],
      1,
      1
    ]
  });

  //   await hre.run("verify:verify", {
  //   address: '0xcC41AbE4c12C7DB2fdfD915573145c91C731fb33',
  // });

  // //Registry
  // await hre.run("verify:verify", {
  //   address: '0xAb6b4Ce53A026e35d4B78107B5EEb1eDD7b6cb6B',
  // });

  // //Vault
  // await hre.run("verify:verify", {
  //   address: '0xf5fd98851B1307C173E995Fa6ba206ee88c474f5',
  // });

  // //Admin
  // await hre.run("verify:verify", {
  //   address: '0x7523eb5349345187C716994bc5Db437b5Ab4071C',
  //   contract: 'contracts/Admin.sol:Admin'
  // });

  //Get initialization function call
  let ABI = [
    "function initialize()"
  ];
  let iface = new ethers.utils.Interface(ABI);
  let data = iface.encodeFunctionData("initialize", []);

  // //Proxy
  // await hre.run("verify:verify", {
  //   address: '0x2eeA4ca2e7852986742c1CEC0193EDD7BB26Cc9E',
  //   contract: 'contracts/VaultProxy.sol:VaultProxy',
  //   constructorArguments: [
  //     '0xf5fd98851B1307C173E995Fa6ba206ee88c474f5',
  //     '0x7523eb5349345187C716994bc5Db437b5Ab4071C',
  //     data
  //   ]
  // });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
