import React, { Component } from "react";
import { EthContext } from "../_contexts/EthContext";

// CONTRACTS
import Exchange from "../abis/Exchange.json";
import Token from "../abis/Token.json";

// STYLES
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
    const exchangeContract = await this.context.loadContract(Exchange);
    const tokenContract = await this.context.loadContract(Token);

    this.setState({
      loading: false,
      account: this.context.userAddress,

      exchangeContract,
      tokenContract,
    });
  };

  render() {
    return (
      <div className="container">
        {this.state.loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <div className="content">
              <div className="vertical-split">
                <div className="card bg-dark text-white">
                  <div className="card-header">Card Title</div>
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <a href="/#" className="card-link">
                      Card link
                    </a>
                  </div>
                </div>
                <div className="card bg-dark text-white">
                  <div className="card-header">Card Title</div>
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <a href="/#" className="card-link">
                      Card link
                    </a>
                  </div>
                </div>
              </div>
              <div className="vertical">
                <div className="card bg-dark text-white">
                  <div className="card-header">Card Title</div>
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <a href="/#" className="card-link">
                      Card link
                    </a>
                  </div>
                </div>
              </div>
              <div className="vertical-split">
                <div className="card bg-dark text-white">
                  <div className="card-header">Card Title</div>
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <a href="/#" className="card-link">
                      Card link
                    </a>
                  </div>
                </div>
                <div className="card bg-dark text-white">
                  <div className="card-header">Card Title</div>
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <a href="/#" className="card-link">
                      Card link
                    </a>
                  </div>
                </div>
              </div>
              <div className="vertical">
                <div className="card bg-dark text-white">
                  <div className="card-header">Card Title</div>
                  <div className="card-body">
                    <p className="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content.
                    </p>
                    <a href="/#" className="card-link">
                      Card link
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BodyContent;
