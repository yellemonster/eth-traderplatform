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
    event Withdrawal(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

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

    function withdrawalEther(uint256 _amount) public {
        require(
            tokens[ETHER][msg.sender] >= _amount,
            "Requested amount exceeds current balance"
        );
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        msg.sender.transfer(_amount);
        emit Withdrawal(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    function depositToken(address _token, uint256 _amount) public {
        require(_token != ETHER, "No Ether deposits allowed via this function");
        require(
            Token(_token).transferFrom(msg.sender, address(this), _amount),
            "Token deposit failed"
        );

        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withdrawalToken(address _token, uint256 _amount) public {
        require(_token != ETHER, "Invalid token address");

        require(
            tokens[_token][msg.sender] >= _amount,
            "Withdrawal amount exceeds user balance"
        );

        require(
            Token(_token).transfer(msg.sender, _amount),
            "Token transfer to user failed"
        );

        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        emit Withdrawal(
            _token,
            msg.sender,
            _amount,
            tokens[_token][msg.sender]
        );
    }

    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }
}
