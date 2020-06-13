import React, { Component } from "react";
import { EthContext } from "../_contexts/EthContext";
import { reject } from "lodash";

// CONTRACTS
import Exchange from "../abis/Exchange.json";
import Token from "../abis/Token.json";

// STYLES
import "./BodyContent.css";

// COMPONENTS
import Trades from "./Trades";
import OrderBook from "./OrderBook";
import MyTransactions from "./MyTransactions";
import PriceChart from "./PriceChart";

export class BodyContent extends Component {
  static contextType = EthContext;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      account: "",
      orderBookLoadComplete: false,
    };
  }

  componentDidMount() {
    this.INITIALIZE();
  }

  INITIALIZE = async () => {
    this.setState({ loading: true });
    await this.LOAD_ContractData();
    await this.SubscribeToEvents();
    await this.LOAD_allOrders();
    this.setState({ loading: false });
  };

  LOAD_ContractData = async () => {
    const exchangeContract = await this.context.loadContract(Exchange);
    const tokenContract = await this.context.loadContract(Token);

    this.setState({
      exchangeContract,
      tokenContract,

      account: this.context.userAddress,
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

  LOAD_allOrders = async () => {
    const cancelledOrders = await this.GET_eventSet("Cancel");
    const tradeStream = await this.GET_eventSet("Trade");
    const orderStream = await this.GET_eventSet("Order");

    const openOrders = this.LOAD_openOrders(
      orderStream,
      tradeStream,
      cancelledOrders
    );

    this.setState({
      cancelledOrders,
      tradeStream,
      orderStream,
      openOrders,

      orderBookLoadComplete: true,
    });
  };

  // ORDER BOOK FUNCTIONS
  LOAD_openOrders = (all, filled, cancelled) => {
    const _openOrders = reject(all, (order) => {
      const orderFilled = filled.some((o) => o.id === order.id);
      const orderCancelled = cancelled.some((o) => o.id === order.id);
      return orderFilled || orderCancelled;
    });

    return _openOrders;
  };

  // EVENT SUBSCRIPTIONS
  SubscribeToEvents = async () => {
    this.state.exchangeContract.events.Cancel({}, (error, event) => {
      if (error) {
        console.log("Cancel event error: ", error);
      } else if (event) {
        console.log("Cancel event result: ", event.returnValues);
      }
    });
    this.state.exchangeContract.events.Trade({}, (error, event) => {
      if (error) {
        console.log("Trade event error: ", error);
      } else if (event) {
        console.log("Trade event result: ", event.returnValues);
      }
    });
  };

  // USER ACTIONS
  cancelOrder = (order) => {
    const { exchangeContract, account } = this.state;
    if (exchangeContract && account) {
      exchangeContract.methods
        .cancelOrder(order.id)
        .send({ from: account })
        .on("transactionHash", async (hash) => {
          await this.LOAD_allOrders();
        })
        .on("error", (error) => {
          console.log(error);
          window.alert("ERROR cancelling order");
        });
    }
  };

  fillOrder = (order) => {
    const { exchangeContract, account } = this.state;
    console.log("Order user: ", order.user);
    console.log("This User: ", account);
    // return;
    if (exchangeContract && account) {
      exchangeContract.methods
        .fillOrder(order.id)
        .send({ from: account })
        .on("transactionHash", async (hash) => {
          await this.LOAD_allOrders();
        })
        .on("error", (error) => {
          console.log(error);
          window.alert("ERROR filling order");
        });
    }
  };

  render() {
    const {
      account,
      loading,
      openOrders,
      tradeStream,
      cancelledOrders,
    } = this.state;

    return (
      <div className="container">
        {loading === true ? (
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
              <OrderBook orderBook={openOrders} fillOrder={this.fillOrder} />
              <div className="vertical-split">
                <PriceChart filledOrders={tradeStream} />
                <MyTransactions
                  myAccount={account}
                  ordersFilled={tradeStream}
                  ordersOpen={openOrders}
                  ordersCancelled={cancelledOrders}
                  cancelOrder={this.cancelOrder}
                />
              </div>
              <Trades trades={tradeStream} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BodyContent;
