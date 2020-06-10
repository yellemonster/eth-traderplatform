pragma solidity ^0.5.0;

import "./Token.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Exchange {
    using SafeMath for uint256;

    string public name = "Pvblic Exchange";

    address public feeAccount;
    uint256 public feePercent;

    address constant ETHER = address(0); // Store Ether in tokens mapping with blank address

    // FIRST address and mapping is the specific Token address
    // SECOND address and nested mapping is the respectiv user balanaces
    mapping(address => mapping(address => uint256)) public tokens;

    // EVENTS
    event Deposit(address token, address user, uint256 amount, uint256 balance);

    // FUNCTIONS
    constructor(address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function() external {
        revert("No ether allowed");
    }

    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function depositToken(address _token, uint256 _amount) public {
        // TODO: Dont allow Ether deposits
        require(_token != ETHER, "No Ether deposits allowed via this function");

        require(
            Token(_token).transferFrom(msg.sender, address(this), _amount),
            "Token deposit failed"
        );

        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
}
