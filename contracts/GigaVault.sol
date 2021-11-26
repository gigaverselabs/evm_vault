// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";

// import "./IERC721Mintable.sol";

contract Pausable is Ownable {
    event Paused();
    event Unpaused();

    bool public paused;

    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    modifier whenPaused() {
        require(paused);
        _;
    }

    function pause() public onlyOwner whenNotPaused {
        paused = true;
        emit Paused();
    }

    function unpause() public onlyOwner whenPaused {
        paused = false;
        emit Unpaused();
    }
}

contract MainchainGatewayStorage is Pausable {
    event TokenDeposited(
        uint256 indexed _depositId,
        address indexed _owner,
        address indexed _tokenAddress,
        address _sidechainAddress,
        uint32 _standard,
        uint256 _tokenNumber // ERC-20 amount or ERC721 tokenId
    );

    event TokenWithdrew(
        uint256 indexed _withdrawId,
        address indexed _owner,
        address indexed _tokenAddress,
        uint256 _tokenNumber
    );

    struct DepositEntry {
        address owner;
        address tokenAddress;
        address sidechainAddress;
        uint32 standard;
        uint256 tokenNumber;
    }

    struct WithdrawalEntry {
        address owner;
        address tokenAddress;
        uint256 tokenNumber;
    }

    uint256 public depositCount;
    DepositEntry[] public deposits;
    mapping(uint256 => WithdrawalEntry) public withdrawals;
}

contract Validator is MainchainGatewayStorage {
    address internal _validator;
    
    constructor() {
        _setValidator(_msgSender());
    }

    function validator() public view virtual returns (address) {
        return _validator;
    }

    function _setValidator(address newValidator) private {
        _validator = newValidator;
    }
}

contract GigaVault is Validator {
    using SafeMath for uint256;


    function depositERC721For(
        address _user,
        address _token,
        uint256 _tokenId
    ) public whenNotPaused returns (uint256) {
        IERC721(_token).transferFrom(msg.sender, address(this), _tokenId);
        return _createDepositEntry(_user, _token, 721, _tokenId);
    }

    function withdrawERC721For(
        uint256 _withdrawalId,
        address _user,
        address _token,
        uint256 _tokenId,
        bytes memory _signatures
    )
        public
        whenNotPaused // onlyMappedToken(_token, 721)
    {
        bytes32 _hash = keccak256(
            abi.encodePacked(
                "withdrawERC721",
                _withdrawalId,
                _user,
                _token,
                _tokenId
            )
        );

        require(verifySignatures(_hash, _signatures));

        require(
            _tryERC721TransferFrom(_token, address(this), _user, _tokenId),
            "MainchainGatewayManager: Could not withdraw token!"
        );

        // if (!_tryERC721TransferFrom(_token, address(this), _user, _tokenId)) {

        // require(
        //     IERC721Mintable(_token).mint(_user, _tokenId),
        //     "MainchainGatewayManager: Minting ERC721 token to gateway failed"
        // );
        // }

        _insertWithdrawalEntry(_withdrawalId, _user, _token, _tokenId);
    }

    function verifySignatures(bytes32 _hash, bytes memory _signature)
        public
        view
        returns (bool)
    {
        // uint256 _signatureCount = _signatures.length.div(66);

        // Validator _validator = Validator(
        //     registry.getContract(registry.VALIDATOR())
        // );
        // uint256 _validatorCount = 0;
        // address _lastSigner = address(0);

        // for (uint256 i = 0; i < _signatureCount; i++) {
        address _signer = ECDSA.recover(_hash, _signature);

        require(_signer == _validator, "Incorrect signature signer");

        // if (_validator.isValidator(_signer)) {
        //     _validatorCount++;
        // }
        // // Prevent duplication of signatures
        // require(_signer > _lastSigner);
        // _lastSigner = _signer;
        // }

        return true;

        // return _validator.checkThreshold(_validatorCount);
    }

    function _createDepositEntry(
        address _owner,
        address _token,
        uint32 _standard,
        uint256 _number
    )
        internal
        returns (
            // onlyMappedToken(_token, _standard)
            uint256 _depositId
        )
    {
        // (, address _sidechainToken, uint32 _tokenStandard) = registry
        //     .getMappedToken(_token, true);
        // require(_standard == _tokenStandard);

        DepositEntry memory _entry = DepositEntry(
            _owner,
            _token,
            _token,
            _standard,
            _number
        );

        deposits.push(_entry);
        _depositId = depositCount++;

        emit TokenDeposited(
            _depositId,
            _owner,
            _token,
            _token,
            _standard,
            _number
        );
    }

    function _insertWithdrawalEntry(
        uint256 _withdrawalId,
        address _owner,
        address _token,
        uint256 _number // onlyNewWithdrawal(_withdrawalId)
    ) internal {
        WithdrawalEntry memory _entry = WithdrawalEntry(
            _owner,
            _token,
            _number
        );

        withdrawals[_withdrawalId] = _entry;

        emit TokenWithdrew(_withdrawalId, _owner, _token, _number);
    }

    // See more here https://blog.polymath.network/try-catch-in-solidity-handling-the-revert-exception-f53718f76047
    function _tryERC721TransferFrom(
        address _token,
        address _from,
        address _to,
        uint256 _tokenId
    ) internal returns (bool) {
        (bool success, ) = _token.call(
            abi.encodeWithSelector(
                IERC721(_token).transferFrom.selector,
                _from,
                _to,
                _tokenId
            )
        );
        return success;
    }
}
