// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoDevToken is ERC20, Ownable {
    uint256 public constant TOKEN_PRICE = 0.001 ether;
    uint256 public constant MIN_TOKEN_TO_MINT = 10 ;
    uint256 public constant MAX_SUPPLY_LIMIT = 10000 * 10 ** 18;

    mapping(uint256 => bool) public isTokenIdClimed;

    constructor() ERC20("CryptoDev Token", "CD") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }

    // function initialize() initializer public {
    //     __ERC20_init("CryptoDev Token", "CD");
    //     __Ownable_init();

    //     _mint(msg.sender, 1000 * 10 ** 18);
    // }

    function mint(uint256 amount) public payable {
        require(msg.value >= TOKEN_PRICE * MIN_TOKEN_TO_MINT, "Not enough Ether sent");

        require((totalSupply() + amount) <= MAX_SUPPLY_LIMIT, "Exceeds the max total supply available.");

        _mint(msg.sender, amount);
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "Nothing to withdraw, contract balance empty");

        address _owner = owner();
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
