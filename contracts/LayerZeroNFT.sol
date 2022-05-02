// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import "./omni/lzApp/NonblockingLzApp.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract LayerZeroNFT is NonblockingLzApp, ERC721 {
    uint256 public tokenId;

    /**
     * @dev Emitted when `_tokenId` are sent from `_srcChainId` to the `_toAddress` at this chain. `_nonce` is the inbound nonce.
     */
    event ReceiveFromChain(
        uint16 _srcChainId,
        address _toAddress,
        uint256 _tokenId,
        uint64 _nonce
    );

    /// @notice Constructor for the LayerZeroNFT
    /// @param _name sets NFT's name to Layer Zero NFT
    /// @param _symbol sets NFT's symbol to LZNFT
    /// @param _lzEndpoint handles message transmission across chains
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint
    ) ERC721(_name, _symbol) NonblockingLzApp(_lzEndpoint) {}

    /// @notice Mint LZNFT
    function mint() external payable {
        _safeMint(msg.sender, tokenId);

        tokenId++;
    }

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory, /* _srcAddress */
        uint64 _nonce,
        bytes memory _payload
    ) internal virtual override {
        // decode and load the toAddress
        (bytes memory toAddressBytes, uint256 tkID) = abi.decode(
            _payload,
            (bytes, uint256)
        );
        address toAddress;

        _burn(tkID);

        assembly {
            toAddress := mload(add(toAddressBytes, 20))
        }

        _safeMint(toAddress, tkID);

        emit ReceiveFromChain(_srcChainId, toAddress, tkID, _nonce);
    }
}
