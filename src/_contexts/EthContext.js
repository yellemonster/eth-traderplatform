import React, { Component, createContext } from "react";
import Web3 from "web3";

export const EthContext = createContext();

export class EthContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      userAddress: "",
      networkId: -1,
      netStringName: "",

      // BOOLEANS
      loading: true,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const metamaskInstalled = typeof window.web3 !== "undefined";
    this.setState({ metamaskInstalled });
    if (metamaskInstalled) {
      await this.LOAD_web3();
      await this.GET_AccountData();

      let netId = parseInt(window.ethereum.networkVersion);
      let msg = await this.getNetworkType(netId);
      this.setState({ networkId: netId, netStringName: msg, loading: false });
    }
  }

  async getNetworkType(netId) {
    switch (netId) {
      case 1:
        return "Ethereum Main-net";
      case 2:
        return " Morden Test-net";
      case 3:
        return "Ropsten Test-net";
      case 4:
        return "Rinkeby Test-net";
      case 5:
        return "Goerli Test-net";
      case 42:
        return "Kovan Test-net";
      default:
        break;
    }
  }

  async GET_AccountData() {
    this.setState({ isLoading: true });

    const accounts = await window.web3.eth.getAccounts();
    this.setState({ userAddress: accounts[0], isLoading: false });
  }

  async GET_etherBalance(account) {
    const etherBalance = await window.web3.eth.getBalance(account);
    return etherBalance;
  }

  async LOAD_web3() {
    this.setState({ isLoading: true });

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      window.ethereum.on("accountsChanged", () => {
        this.loadData();
      });

      window.ethereum.on("networkChanged", () => {
        this.loadData();
      });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }

    this.setState({ isLoading: false });
  }

  async LOAD_Contract(contract) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();

    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const networkData = contract.networks[networkId];

    if (networkData) {
      const _contract = new web3.eth.Contract(
        contract.abi,
        networkData.address
      );

      return _contract;
    } else {
      window.alert("Contract not deployed!");
    }
  }

  render() {
    return (
      <EthContext.Provider
        value={{
          ...this.state,
          loadContract: this.LOAD_Contract,
          getEthBalance: this.GET_etherBalance,
        }}
      >
        {this.props.children}
      </EthContext.Provider>
    );
  }
}

export default EthContextProvider;
