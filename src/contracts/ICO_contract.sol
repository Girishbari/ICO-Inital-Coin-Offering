//SPDX-License-Identifier:MIT

pragma solidity ^0.8.10;

import "./Smart_Code.sol";

// 0x4E0d7594A25eb1df5D1707307Bf8a2F368364005

contract ICO is usingERC20 {
    address public manager;

    address payable public deposit;

    uint256 public tokenPrice = 0.1 ether;
    uint256 public cap = 300 ether;
    uint256 public totalRaisedAmount;
    uint256 public icoStartTime = block.timestamp;
    uint256 public icoEndTime = block.timestamp + 86400;

    uint256 public maxInvestment = 10 ether;
    uint256 public minInvestment = 0.1 ether;

    enum StateofICO {
        beforeStart,
        afterEnd,
        running,
        halted
    }

    StateofICO public currentState;

    constructor(address payable _deposit) {
        deposit = _deposit;
        manager = msg.sender;
        currentState = StateofICO.beforeStart;
    }

    event Investment(address Investor, uint256 amount, uint256 tokensAllocated);

    modifier onlyManager() {
        require(manager == msg.sender);
        _;
    }

    function haltICO() public onlyManager {
        currentState = StateofICO.halted;
    }

    function resumeICO() public onlyManager {
        currentState = StateofICO.running;
    }

    function ChangeDepositorAddress(address payable _newAddress)
        public
        onlyManager
    {
        deposit = _newAddress;
    }

    function getStateOfICO() public view returns (StateofICO) {
        if (currentState == StateofICO.halted) {
            return StateofICO.halted;
        } else if (block.timestamp < icoStartTime) {
            return StateofICO.beforeStart;
        } else if (
            block.timestamp >= icoStartTime && block.timestamp <= icoEndTime
        ) {
            return StateofICO.running;
        } else {
            return StateofICO.afterEnd;
        }
    }

    function Invest() public payable returns (bool) {
        currentState = getStateOfICO();
        require(
            currentState == StateofICO.running,
            "ICO has ended or not available now"
        );
        require(
            msg.value >= minInvestment && msg.value <= maxInvestment,
            " Value is not correct"
        );
        totalRaisedAmount += msg.value;
        require(totalRaisedAmount <= cap, " Cannot accept payments");
        uint256 tokens = msg.value / tokenPrice; // 10/0.1 100
        balances[msg.sender] += tokens;
        balances[creator] -= tokens;
        deposit.transfer(msg.value);
        emit Investment(msg.sender, msg.value, tokens);
        return true;
    }

    function burn() public onlyManager returns (bool) {
        currentState = getStateOfICO();
        require(currentState == StateofICO.afterEnd, "ICO has not ended");
        balances[creator] = 0;
        return true;
    }

    receive() external payable {
        Invest();
    }
}
