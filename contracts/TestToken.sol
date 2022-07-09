pragma solidity ^0.5.1;

import { ERC20 } from "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract ToyToken is ERC20 {
    
    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}