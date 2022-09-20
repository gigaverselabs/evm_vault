const fs = require('fs');
const Web3 = require('web3');

const { sign, recover } = require('eth-lib/lib/account');

//WEB3 INIT
const web3 = new Web3();

const privateKey = fs.readFileSync('./eth_key');

const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
console.log(account.address);

function generate_signature(block, token_adr, tokenId, new_owner) {
    let hash =
        web3.utils.soliditySha3(
            { type: 'string', value: 'withdrawERC721' },
            { type: 'uint256', value: block }, //Withdrawal ID
            { type: 'address', value: new_owner }, //User for which token should be withdrawn
            { type: 'address', value: token_adr }, //Token contract address
            { type: 'uint256', value: tokenId }
        );
    // console.log('Hash: '+hash);

    let signature = sign(hash, '0x' + privateKey);
    // console.log("Signature: " + signature);

    return [hash, signature];
}

// generate_signature(1, '0xdFcBCc1D5333c95F88CA869D56cAA308c1C30b77', 1234, '0x3Ab0BFa6428775d9E698697955CdEFe793B5Aa98');

module.exports = {
    generate_signature
}