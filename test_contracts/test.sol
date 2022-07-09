pragma solidity ^0.5.10;

contract test {
    event something(uint sth);

    function foo(uint x) public {
        emit something(x);
    }
}