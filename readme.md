# General Information

Bridge is comprised from 3 parts:

1. EVM contract
2. Validator Node run on separate machine ()
3. IC Canister

## 1. EVM contract/IC Canister
Used as a Vault for storing NFTs in EVM while they are on other chain (IC)

Owner sends NFT to Vault contract, in order to retrieve it there needs to be created special signature that certifies that given NFT can. 
This signature is created by verifiers (in future there should be option for people to create verificators on their own)

Validators can be added or removed (need to specify how they are added and removed), optionally they can be changed to ZK proofs, 
it can be specified in contract how many % of validators need to send approval before the NFT can be released to given address

Contact stores all deposits and withdrawals info

Additionaly there is Validators canister on IC, that stores all realeased signatures. Any given signature can be used by combination of wallet address and related private key, so signatures are safe to be public. This makes whole system more resistant to network errors.

Information about mapping of ERC721 ETH contract address and IC canister address is stored in IC Vault canister (storage on IC is cheaper than on ETH)


## 2. Validator Node

Validator receives deposit information on chain A and releases signature that allows to do mint/release on chain B. With multiple validators, in order to succesfully mint/release several signatures are required

Requires further research:
Multisig vs Edge cryptography vs ZK-STARK



## Data flow

Case A: moving NFT from ETH to IC

User:

1. Send Approve All to NFT contract to approve Vault for making changes.
2. Send storeToken tx to vault, provide proof about wallet address on IC (for now simple signature done by actor), this is done as a single transaction
3. Wait for confirmation from IC Vault that token was released/minted to provided wallet address (this is done periodically)

Verificator:

1. Receives information from blockchain about transaction and stored data
2. Checks if collection is mapped to the IC blockchain
3. Mints/Releases NFT to wallet address specified in Tx

Case B: moving NFT from IC to ETH

1. Send information about intended transaction to Vault (NFT canister, NFT number, target wallet on ETH)
2. Send token to Vault
3. Wait for confirmation from Verificator that transaction was processed, end receive release/mint signature
4. Send tx to ETH Vault with provided signature to Release/Mint token to given ETH address


Case C: user resignes from sending NFT to other blockchain

Up to consideration:

1. Create a version with fixed number of verificators, any tx between blockchains requires consensus of 50%+ verificators that transaction is valid
2. Create a version with fluid number of verificators, requires further R&D to decide on how new verificators are added and removed from the network + incentives and penalties
3. Create a version based on zero-proof-knowladge instead of signatures

4. What to do when, NFT token was received in vault (either ETH or IC) but was never processed (either bug in verificators, or end user has never claimed token on the other chain)

# Contract details

# EVM Vault Contract

Evm consist of two main write functions: depositERC721, withdrawERC721For and additional readFunctions

## depositERC721For

user - IC wallet address for sending NFT
token - ETH ERC721 token address
tokenId - token number to be transfered
signature - signature that confirms that sender is the owner of the target wallet address (to be considered if this signature is required)

## withdrawERC721For

user - IC wallet address from which NFT was received
token - ETH ERC721 token address
tokenId - token number to be transfered
signature - signature from verificator node that confirms that this withdrawal is valid

# IC Vault Contract

# IC Verficator Contract



