// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract LSTToken is ERC20, Ownable, EIP712 {
    using ECDSA for bytes32;

    // Mapping to track used nonces
    mapping(address => uint256) public nonces;
    
    // Constants for meta-transaction
    bytes32 public constant TRANSFER_TYPEHASH = keccak256("Transfer(address from,address to,uint256 amount,uint256 nonce)");
    
    constructor() ERC20("LastMinute Token", "LST") Ownable(msg.sender) EIP712("LastMinute Token", "1") {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial supply of 1 million tokens
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    // Meta-transaction function
    function executeMetaTransfer(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        bytes memory signature
    ) public returns (bool) {
        require(nonce == nonces[from], "Invalid nonce");
        
        // Verify signature
        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(
                TRANSFER_TYPEHASH,
                from,
                to,
                amount,
                nonce
            ))
        );
        address signer = digest.recover(signature);
        require(signer == from, "Invalid signature");

        // Increment nonce
        nonces[from]++;

        // Execute transfer
        _transfer(from, to, amount);
        return true;
    }

    // Get the current nonce for an address
    function getNonce(address user) public view returns (uint256) {
        return nonces[user];
    }
}