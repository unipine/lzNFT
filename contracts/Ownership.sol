// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;

import "./omni/lzApp/NonblockingLzApp.sol";

contract Ownership is NonblockingLzApp {
    event Receive(bool result);

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}

    function _nonblockingLzReceive(
        uint16,
        bytes memory,
        uint64,
        bytes memory
    ) internal virtual override {
        emit Receive(true);
    }

    function _transferOwnership(
        uint16 _dstChainId,
        address _toAddress,
        uint256 _tokenId,
        bytes calldata _adapterParams
    ) public payable {
        bytes memory payload = abi.encode(_toAddress, _tokenId);

        _lzSend(
            _dstChainId,
            payload,
            payable(msg.sender),
            address(0),
            _adapterParams
        );
    }
}
