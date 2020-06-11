import React, { Component } from "react";
import { EthContext } from "../_contexts/EthContext";

// CONTRACTS
import Exchange from "../abis/Exchange.json";
import Token from "../abis/Token.json";

// STYLES
import "./BodyContent.css";
import Trades from "./Trades";

export class BodyContent extends Component {
  static contextType = EthContext;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      account: "",
      allStreamsLoaded: false,
    };
  }

  componentDidMount() {
    this.INITIALIZE();
  }

  INITIALIZE = async () => {
    this.setState({ loading: true });
    await this.LOAD_ContractData();
    await this.LOAD_allOrders();
    this.setState({ loading: false });
  };

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

  LOAD_allOrders = async () => {
    const cancelledOrders = await this.GET_eventSet("Cancel");
    const tradeStream = await this.GET_eventSet("Trade");
    const orderStream = await this.GET_eventSet("Order");

    this.setState({
      cancelledOrders,
      tradeStream,
      orderStream,
      allStreamsLoaded: true,
    });
  };

  GET_eventSet = async (eventType) => {
    const eventStream = await this.state.exchangeContract.getPastEvents(
      `${eventType}`,
      {
        fromBlock: 0,
        toBlock: "latest",
      }
    );
    return eventStream.map((event) => event.returnValues);
  };

  render() {
    const { loading, allStreamsLoaded } = this.state;

    return (
      <div className="container">
        {loading ? (
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
              {allStreamsLoaded ? (
                <Trades trades={this.state.tradeStream} />
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BodyContent;
