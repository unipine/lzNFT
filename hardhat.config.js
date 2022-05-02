require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@typechain/hardhat");
require("hardhat-gas-reporter");
require("solidity-coverage");

module.exports = {
  solidity: "0.8.7",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC || ""
      }
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC || ""
      },
      gas: 650000000,
      gasPrice: 40000000000
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: {
        mnemonic: process.env.MNEMONIC || ""
      }
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
