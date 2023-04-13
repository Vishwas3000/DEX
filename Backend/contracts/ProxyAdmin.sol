// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Proxy.sol";

contract ProxyAdmin {
    address public owner;

    event ProxyAdminChanged(address proxy, address admin);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function getProxyAdmin(address proxy) external view returns (address) {
        (bool ok, bytes memory res) = proxy.staticcall(abi.encodeWithSignature("admin()"));
        require(ok, "call failed");
        return abi.decode(res, (address));
    }

    function getProxyImplementation(address proxy) external view returns (address) {
        (bool ok, bytes memory res) = proxy.staticcall(abi.encodeWithSignature("implementation()"));
        require(ok, "call failed");
        return abi.decode(res, (address));
    }

    function changeProxyAdmin(address payable proxy, address admin) external onlyOwner {
        Proxy(proxy).changeAdmin(admin);
        emit ProxyAdminChanged(proxy, admin);
    }

    function upgrade(address payable proxy, address implementation) external onlyOwner {
        Proxy(proxy).upgradeTo(implementation);
    }

    function changeOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
