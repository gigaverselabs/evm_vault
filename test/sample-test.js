const { expect } = require("chai");
const hre = require("hardhat");
const ethers = hre.ethers;

const { deploy } = require('../scripts/full_deploy.js');
const { generate_signature } = require("../scripts/signatures.js");

describe("Signatures", function () {
  it("Generate signature", async function () {
    generate_signature(1, '0xdFcBCc1D5333c95F88CA869D56cAA308c1C30b77', 1234, '0x3Ab0BFa6428775d9E698697955CdEFe793B5Aa98');

  })
})

describe("Vault", function () {
  it("Setup registry", async function () {
    const [owner] = await ethers.getSigners();

    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    await registry.deployed();

    const Vault = await ethers.getContractFactory("GigaVault");
    const vault = await Vault.deploy();
    await vault.deployed();
    await vault.updateRegistry(registry.address);

    expect(await vault.registry()).to.equal(registry.address);
  });

  it("Signature verification", async function () {
    const [owner] = await ethers.getSigners();

    const Validator = await ethers.getContractFactory("Validator");
    const validator = await Validator.deploy(
      [
        '0x24b3aA6bf1B24ad8c4B19CF9492EB352EfBA3A88',
        '0xa667eFaaE5021D8d8Ca4eC07eaB028AA2bAaD80a'
      ],
      1,
      1
    );
    await validator.deployed();

    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    await registry.deployed();

    await registry.updateContract("VALIDATOR", validator.address);
    //Registry set validator contract


    const Vault = await ethers.getContractFactory("GigaVault");
    const vault = await Vault.deploy();
    await vault.deployed();
    await vault.updateRegistry(registry.address);

    hash = '0x00525d1026806e6d34576c803c0563c56add35ac214988e37870d5f9c542d8f8';
    signatures = '0xaf54f49ae3d2e6cd8a7633907e3d11c584510c8abfa749aa027d1e83c476776b2b7218378b46f411e749b377195bcf3f7126b1c63f15a051dcaec19d557001851bffd85cee240fb1aaf2695ae20801ff1be62e4999e324d3d7f1b7ebe611f95d44700d918e1f990c09effb2cff828d07328b23d2ed5753a3bdaf20af02b629e5111c';

    expect(await vault.verifySignatures(hash, signatures)).to.true;
  });

  it("Check deposit", async function () {
    const [owner] = await ethers.getSigners();
    let addresses = await deploy(ethers);

    //Deploy test ERC721 contract
    const contract = await ethers.getContractFactory("TestToken");
    const tt = await contract.deploy();
    await tt.deployed();
    // console.log("Test token deployed to:", tt.address);

    //Mint token 1
    await tt.mint();

    //Approve proxy to transfer token
    await tt.approve(addresses.proxy, 1);

    //Add Test Token to registry
    const registry = await ethers.getContractAt("Registry", addresses.registry);
    await registry.mapToken(tt.address, "sidechain_address", 721);

    //Deposit token in vault
    const proxied_vault = await ethers.getContractAt("GigaVault", addresses.proxy);

    let result = await proxied_vault.depositERC721For(
      owner.address,
      tt.address,
      1
    );

    // console.log(result);
    let depositId = result.value;

    expect(Number(depositId)).to.equal(0);
  });

  it("Check withdraw", async function () {
    const [owner] = await ethers.getSigners();
    let addresses = await deploy(ethers);

    //Deploy test ERC721 contract
    const contract = await ethers.getContractFactory("TestToken");
    const tt = await contract.deploy();
    await tt.deployed();

    //Mint token 1
    await tt.mint();

    //Approve proxy to transfer token
    await tt.approve(addresses.proxy, 1);

    //Add Test Token to registry
    const registry = await ethers.getContractAt("Registry", addresses.registry);
    await registry.mapToken(tt.address, "sidechain_address", 721);

    const proxied_vault = await ethers.getContractAt("GigaVault", addresses.proxy);

    //Deposit token in vault
    await proxied_vault.depositERC721For(
      owner.address,
      tt.address,
      1
    );

    //Generate signature
    let block = 1;
    let [, signature] = generate_signature(block, tt.address, 1, owner.address);

    //Withdraw token from vault
    let result = await proxied_vault.withdrawERC721For(
      block, //_withdrawalId
      owner.address, //_user
      tt.address, //_token
      1, //_tokenId
      signature, //_signatures
    );

    expect(Number(result.value)).to.equal(0);

    //We are now testing possible attack vector, with reusing of old signatures

    //Approve proxy to transfer token
    await tt.approve(addresses.proxy, 1);
    //Deposit once again token in vault
    await proxied_vault.depositERC721For(
      owner.address,
      tt.address,
      1
    );

    try {
      await proxied_vault.withdrawERC721For(
        block, //_withdrawalId
        owner.address, //_user
        tt.address, //_token
        1, //_tokenId
        signature, //_signatures
      );
    } catch (e) {
      let msg = e.message;
      expect(msg).equal("VM Exception while processing transaction: reverted with reason string 'Tx already processed'");
    }
  });
});

describe("Proxy", function () {
  it("constructor call", async function () {
    const [owner] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("GigaVault");
    const vault = await Vault.deploy();
    await vault.deployed();
    // await vault.updateRegistry(registry.address);

    const Admin = await ethers.getContractFactory("Admin");
    const admin = await Admin.deploy();
    await admin.deployed();

    let ABI = [
      "function initialize()"
    ];
    let iface = new ethers.utils.Interface(ABI);
    let data = iface.encodeFunctionData("initialize", []);

    const Proxy = await ethers.getContractFactory("VaultProxy");
    const proxy = await Proxy.deploy(
      vault.address, //logic contract
      admin.address, //admin contract
      data
    );
    await proxy.deployed();

    const proxied_vault = await ethers.getContractAt("GigaVault", proxy.address);

    let proxy_contract_owner = await proxied_vault.owner();
    expect(proxy_contract_owner).to.equal(owner.address);

    expect(await proxied_vault.initialized()).to.true;
    expect(await vault.initialized()).to.true;

    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    await registry.deployed();

    await proxied_vault.updateRegistry(registry.address);
  });
});

describe("Admin", function () {
  it("Check if the admin is the creator", async function () {
    const [owner] = await ethers.getSigners();

    const contract = await ethers.getContractFactory("Admin");
    const admin = await contract.deploy();
    await admin.deployed();

    expect(await admin.owner()).to.equal(owner.address);
  });
});