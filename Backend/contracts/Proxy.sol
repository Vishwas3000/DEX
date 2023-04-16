// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./utils/StorageSlot.sol";

pragma solidity ^0.8.17;

contract Proxy is Initializable, ERC20Upgradeable{
    address private cryptoDevToken;

    bytes32 private constant ADMIN_SLOT = bytes32(uint(keccak256("eip1967.proxy.admin")) - 1);
    bytes32 private constant IMPLEMENTATION_SLOT = bytes32(uint(keccak256("eip1967.proxy.implementation")) - 1);

    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event ImplementationChanged(address indexed previousImplementation, address indexed newImplementation);
    event FallBackCalled();
    event InitializerCalled(address cryptoDev, address impAddr, address admin);

    function initialize(address _cryptoDevToken, address _impAddr) initializer public {
        emit InitializerCalled(_cryptoDevToken, _impAddr, msg.sender);

        _setAdmin(msg.sender);
        _setImplementation(_impAddr);
        cryptoDevToken = _cryptoDevToken;
        __ERC20_init("CryptoDev LP Token", "CDLP");
    }

    modifier ifAdmin(){

        if(msg.sender == _getAdmin()){
            _;
        }
        else{
            _fallback();
        }
    }

    function _setAdmin(address _admin) private {
        require(_admin != address(0), "admin = zero address");
        StorageSlot.getAddressSlot(ADMIN_SLOT).value = _admin;
    }

    function _setImplementation(address _implementation) private {
        require(_implementation.code.length > 0, "implementation is not contract");
        StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value = _implementation;
    }

    function changeAdmin(address _admin) external ifAdmin {
        address previousAdmin = _getAdmin();
        _setAdmin(_admin);
        emit AdminChanged(previousAdmin, _admin);
    }

    function upgradeTo(address _implementation) external ifAdmin {
        address previousImplementation = _getImplementation();
        _setImplementation(_implementation);
        emit ImplementationChanged(previousImplementation, _implementation);
    }

    function _getAdmin() private view returns(address){
        return StorageSlot.getAddressSlot(ADMIN_SLOT).value;
    }

    function _getImplementation() private view returns(address){
        return StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value;
    }


    function admin() external view returns (address) {
        return _getAdmin();
    }

    function implementation() external ifAdmin returns (address) {
        return _getImplementation();
    }


    function _delegate(address _implementation) internal virtual {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.

            // calldatacopy(t, f, s) - copy s bytes from calldata at position f to mem at position t
            // calldatasize() - size of call data in bytes
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.

            // delegatecall(g, a, in, insize, out, outsize) -
            // - call contract at address a
            // - with input mem[in…(in+insize))
            // - providing g gas
            // - and output area mem[out…(out+outsize))
            // - returning 0 on error (eg. out of gas) and 1 on success
            let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            // returndatacopy(t, f, s) - copy s bytes from returndata at position f to mem at position t
            // returndatasize() - size of the last returndata
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                // revert(p, s) - end execution, revert state changes, return data mem[p…(p+s))
                revert(0, returndatasize())
            }
            default {
                // return(p, s) - end execution, return data mem[p…(p+s))
                return(0, returndatasize())
            }
        }
    }

    function _fallback() private{
        emit FallBackCalled();
        _delegate(_getImplementation());
    }

    fallback() external payable {
        _fallback();
    }

    receive() external payable {
        _fallback();
    }

}