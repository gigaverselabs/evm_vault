const hre = require("hardhat");
const fs = require("fs");

async function main() {
    let address = JSON.parse(fs.readFileSync('contracts.json'));

    let eth_token = "0xA2480eB41Dd1F2B0aBADe9f305826C544d47f696";
    let ic_token = "gegow-3qaaa-aaaah-qc3nq-cai";

    //Add Test Token to registry
    const registry = await ethers.getContractAt("Registry", address.registry);
    let result = await registry.mapToken(eth_token, ic_token, 721);

    console.log(result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
