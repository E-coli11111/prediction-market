pragma solidity ^0.8.10;

import { IERC1155Receiver } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/IERC1155Receiver.sol";
import { ERC165 } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/introspection/ERC165.sol";

contract ERC1155TokenReceiver is ERC165, IERC1155Receiver {
    constructor() public {
        _registerInterface(
            ERC1155TokenReceiver(0).onERC1155Received.selector ^
            ERC1155TokenReceiver(0).onERC1155BatchReceived.selector
        );
    }
}