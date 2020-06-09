pragma solidity >=0.4.21 <0.7.0;


contract Token {
    string public name;
    string public symbol;
    uint256 public decimals;
    uint256 public totalSupply;

    constructor() public {
        name = "Pvblic Token";
        symbol = "PVB";
        decimals = 18;
        totalSupply = 1000000 * (10**decimals);
    }
}
