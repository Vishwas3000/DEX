// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract ExchangeV2 is ERC20Upgradeable {
    address private cryptoDevTokenAddress;
    uint256 private count;

    event LiquidityRemoved(uint256 ethAmount, uint256 CDAmount);
    event LiquidityAdded(uint256 ethAmount, uint256 CDAmount);
    event FallbackCalled();
    event ReceiveCalled();

    // constructor(address _CryptoDevtoken) ERC20("CryptoDev LP Token", "CDLP") {
    //     require(_CryptoDevtoken != address(0), "Token address passed is a null address");
    //     cryptoDevTokenAddress = _CryptoDevtoken;
    // }

    function initialize() initializer public {
        __ERC20_init("CryptoDev LP Token", "CDLP");
    }

    function addCount() public {
        count+=1;
    }

    function getCount() public view returns(uint256){
        return count;
    }

    function getReserve() public view returns (uint) {
        return ERC20Upgradeable(cryptoDevTokenAddress).balanceOf(address(this));
    }

    function addLiquidity(uint256 _amount) public payable returns (uint256) {
        uint256 liquidity;
        uint256 ethBalance = address(this).balance;
        uint256 cryptoDevTokenReserve = getReserve();
        ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);

        if (cryptoDevTokenReserve == 0) {
            cryptoDevToken.transferFrom(msg.sender, address(this), _amount);
            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        } else {
            uint256 ethReserve = ethBalance - msg.value;
            uint256 cryptoDevTokenAmount = (cryptoDevTokenReserve * msg.value) / (ethReserve);
            require(_amount >= cryptoDevTokenAmount, "Amount of token sent is less than the minmum tokes required");
            cryptoDevToken.transferFrom(msg.sender, address(this), _amount);
            liquidity = (totalSupply() * msg.value) / ethReserve;
            _mint(msg.sender, liquidity);
        }
        emit LiquidityAdded(msg.value, _amount);
        return liquidity;
    }

    function removeLiquidity(uint256 _amount) public returns (uint256, uint256) {
        require(_amount > 0, "Requested amount should be more than 0");

        uint256 ethReserve = address(this).balance;
        uint256 _totalSupply = totalSupply();

        uint256 ethAmount = (_amount * ethReserve) / _totalSupply;
        uint256 cryptoDevTokenAmount = (getReserve() * _amount) / _totalSupply;

        _burn(msg.sender, _amount);
        (bool sent, ) = payable(msg.sender).call{value: ethAmount}("");
        require(sent, "Transaction failed");

        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevTokenAmount);
        emit LiquidityRemoved(ethAmount, cryptoDevTokenAmount);
        return (ethAmount, cryptoDevTokenAmount);
    }

    function admin()public pure returns(address){
        return address(12);
    }

    function getAmountOfToken(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) public pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "invalid Reserve");
        // Assuming 1% fee to be provided to the liquidity provider
        uint256 inputAmountWithFee = (inputAmount * 99);

        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        return (numerator / denominator);
    }

    function ethToCryptoDev(uint256 _minTokens) public payable {
        uint256 tokenReserve = getReserve();
        uint256 tokenBought = getAmountOfToken(msg.value, address(this).balance - msg.value, tokenReserve);

        require(tokenBought >= _minTokens, "insufficient output amount");

        ERC20(cryptoDevTokenAddress).transfer(msg.sender, tokenBought);
    }

    function cryptoDevToEth(uint256 _tokenSold, uint256 _minEth) public {
        uint256 ethBought = getAmountOfToken(_tokenSold, getReserve(), address(this).balance);
        require(ethBought >= _minEth, "insufficient output amount");

        ERC20(cryptoDevTokenAddress).transferFrom(msg.sender, address(this), _tokenSold);
        (bool sent, ) = payable(msg.sender).call{value: ethBought}("");
        require(sent, "Transaction failed");
    }

    fallback() external payable {
        emit FallbackCalled();
    }

    receive() external payable {
        emit ReceiveCalled();
    }
}
