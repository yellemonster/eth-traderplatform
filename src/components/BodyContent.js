import React, { Component } from "react";
import { EthContext } from "../_contexts/EthContext";

// import EthSwap from "../abis/EthSwap.json";

import Main from "./Main";

import "./BodyContent.css";

export class BodyContent extends Component {
  static contextType = EthContext;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      account: "",
      contract: null,
    };
  }

  componentDidMount() {
    this.LOAD_ContractData();
  }

  LOAD_ContractData = async () => {
    // const _contract = await this.context.loadContract(EthSwap);

    const { userAddress } = this.context;

    this.setState({
      loading: false,
      account: userAddress,

      // contract: _contract,
    });
  };

  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    } else {
      content = <Main />;
    }

    return (
      <div className="container">
        {this.state.loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <br />
            {content}
          </div>
        )}
      </div>
    );
  }
}

export default BodyContent;
