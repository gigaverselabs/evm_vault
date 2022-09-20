async function deploy(ethers, validator_address, verbose = false) {
    const [owner] = await ethers.getSigners();
    if (verbose) console.log(owner.address);
  
    const Validator = await ethers.getContractFactory("Validator");
    const validator = await Validator.deploy(
      [
        validator_address
      ],
      1,
      1
    );
    await validator.deployed();
    if (verbose) console.log("Validator deployed to:", validator.address);
  
    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    await registry.deployed();
    if (verbose) console.log("Registry deployed to:", registry.address);
    await registry.updateContract("VALIDATOR", validator.address);
    if (verbose) console.log("Registry VALIDATOR set to: ", validator.address);
  
    const Vault = await ethers.getContractFactory("GigaVault");
    const vault = await Vault.deploy();
    await vault.deployed();
    if (verbose) console.log("Vault deployed to:", vault.address);
  
  
    const Admin = await ethers.getContractFactory("Admin");
    const admin = await Admin.deploy();
    await admin.deployed();
    if (verbose) console.log("Admin deployed to:", admin.address);
  
    //Get initialization function call
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
    if (verbose) console.log("Proxy deployed to:", proxy.address);
  
    const proxied_vault = await ethers.getContractAt("GigaVault", proxy.address);
    await proxied_vault.updateRegistry(registry.address);

    if (verbose) console.log("Vault registry set to: "+registry.address);

    return {
        validator:validator.address, 
        registry: registry.address,
        vault: vault.address,
        admin: admin.address,
        proxy: proxy.address
    };
}

module.exports = {
    deploy
}