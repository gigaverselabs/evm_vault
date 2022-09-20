Mechanism mentioned in this document are generic. However due to nature of Giga Bridge examples are tailored for Bridge between EVM (Ethereum Virtual Machine) based chains and IC (Internet Computer).

# GigaBridge Roadmap

1. Single Validator - Current Version
2. Multiple Validator - Q2 2022
3. No Validator - Q2 2022
4. No Validator V2 - Q1 2023 (depends on Dfinity progress on ETH integration)
5. ZK Validator - No ETA

# General working principal

Cross-chain bridges in general all work on the same principle. 

Assets can never leave origin chain (if nft was first created on Ethereum it will always be there). In order to move/bridge them to some other chain we need to do following:

1. Freeze asset on origin chain
2. Make verification that asset was really freazed
3. Issue identical asset on target chain
4. Send issued asset to specified owner

When moving asset from target chain back to origin chain:

1. Burn asset on target chain
2. Make verification that asset was burned
3. Release asset on origin chain to specified owner

When moving asset from target A chain to target B chain (not origin)

1. Burn asset on target A chain
2. Make verification that asset was burned
3. Issue identical asset on target B chain
4. Send issued asset to specified owner

# Storage, Burn verification
The most crucial part of a bridge is a verification mechanism used to ensure that asset is "in use" only on chain at a time. This can be done in several ways, however all of them has their pros and cons.

# 1. Single Validator
Based on single validator that scans appropriate blockchains for changes and issues verficiation messages signed with private key.

    1. Pros
    - Easy to develop
    - Fast reaction times to events on blockchain
    2. Cons
    - Whole validation can be broken by stealing single private key
    - If validator is offline then the bridge is also offline
    - Centralized solution


# 2. Multiple validators
Works simlar to simple validator, instead it requires a verification to be issued by several validators in accordance to choosen consus mechanism.

    1. Pros
    - Similar in development to multiple validators
    - Reaction time depends on number of validators and consesus method used
    - More secure than Single Validator
    2. Cons
    - If enough validators are offline, then bridge is also offline
    - Slower than single validator
    - Requires consensus mechanism, which usally is not trivial to develop
    - Requires policy on how to include new validators and what happens if they misbehave

# 3. No Validator
No validator depends on IC (Internet Computer) native features that are currently available or will be enabled in upcoming months. Contrary to previous two solutions, this option does not require separate entity to validate that certain transaction has happend on chain (ETH or IC). The verification and issueance of validation can be created directly on IC (Internet Computer) and then transmitted by the user.

Basic working principles:

1 Verification of transactions on EVM based chain
Using native https IC call, latest transactions along with number of blocks can be downloaded directly to IC (best quality source should be used, like infura) using RPC API of EVM. When Vault storage transaction is detected issue Verification for IC. This requires user to send assets to vault contract on EVM (no further steps required).

2 Verification of transaction on IC
Using heartbeat function scan transactions for Burn or Storage events (giga721 has option to get principal filtered events). When Vault transaction is detected create certified variable (uses IC signature and also supplies merkle tree), when user pays EVM transaction fee (via wallet) this variable can be verified by EVM contract.

    1. Pros
    - Does not require validators, as long as Infura and IC are working bridge is accessible
    - Decentralized, based on native functions of IC and EVM
    2. Cons
    - Infura or similar dependance, makes whole solution centralized
    - Using latest features of IC, makes it hard to estimate how much work is required to implement

# 4. No Validator V2
After release of native integration between ETH and IC, we can use it to further modify previous version of bridge to make it more decentralized. Having direct access to ETH contract data, makes HTTPS call to RPC API obsolete (no more dependency on third party provider). Additionally native ETH integration will also enable update calls on ETH contracts, whith proper ETH funds management, we can also remove the step when user needs to pay EVM transactio fee and make bridge easier to use for the end user.

# 5. ZK Validator

TODO