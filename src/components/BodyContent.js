import React, { Component } from "react";
import { EthContext } from "../_contexts/EthContext";
import { reject } from "lodash";
import web3 from "web3";

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
import { ETHER_ADDRESS, tokens } from "../helpers";
import Balance from "./Balance";
import NewOrder from "./NewOrder";

export class BodyContent extends Component {
  static contextType = EthContext;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      account: "",
    };
  }

  componentDidMount() {
    this.INITIALIZE();
  }

  INITIALIZE = async () => {
    this.setState({ loading: true });

    await this.LOAD_contracts();
    await this.LOAD_orders();
    await this.LOAD_balances();
    await this.SubscribeToEvents();

    this.setState({ loading: false });
  };

  LOAD_contracts = async () => {
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

  LOAD_orders = async () => {
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

  LOAD_openOrders = (all, filled, cancelled) => {
    const _openOrders = reject(all, (order) => {
      const orderFilled = filled.some((o) => o.id === order.id);
      const orderCancelled = cancelled.some((o) => o.id === order.id);
      return orderFilled || orderCancelled;
    });

    return _openOrders;
  };

  LOAD_balances = async () => {
    // console.log("loading wallet balances...");
    const { exchangeContract, tokenContract, account } = this.state;

    // Ether balance in wallet
    const walletEtherBalance = await this.context.getEthBalance(account);

    const walletTokenBalance = await tokenContract.methods
      .balanceOf(account)
      .call();

    const exchangeEtherBalance = await exchangeContract.methods
      .balanceOf(ETHER_ADDRESS, account)
      .call();

    const exchangeTokenBalance = await exchangeContract.methods
      .balanceOf(tokenContract.options.address, account)
      .call();

    this.setState({
      balances: {
        walletEtherBalance,
        walletTokenBalance,
        exchangeEtherBalance,
        exchangeTokenBalance,
      },
    });
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
    this.state.exchangeContract.events.Deposit({}, (error, event) => {
      if (error) {
        console.log("Deposit event error: ", error);
      } else if (event) {
        console.log("Deposit event result: ", event.returnValues);
      }
    });
    this.state.exchangeContract.events.Withdraw({}, (error, event) => {
      if (error) {
        console.log("Withdraw event error: ", error);
      } else if (event) {
        console.log("Withdraw event result: ", event.returnValues);
      }
    });
    this.state.exchangeContract.events.Order({}, (error, event) => {
      if (error) {
        console.log("MakeOrder event error: ", error);
      } else if (event) {
        console.log("MakeOrder event result: ", event.returnValues);
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
          await this.LOAD_orders();
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
          await this.LOAD_orders();
        })
        .on("error", (error) => {
          console.log(error);
          window.alert("ERROR filling order");
        });
    }
  };

  // BALANCE ACTIONS
  depositEther = (amount) => {
    this.state.exchangeContract.methods
      .depositEther()
      .send({
        from: this.state.account,
        value: web3.utils.toWei(amount, "Ether"),
      })
      .on("transactionHand", (hash) => {
        this.INITIALIZE();
      })
      .on("error", (error) => {
        console.log(error);
        window.alert("There was an error depositing ETH");
      });
  };

  withdrawEther = (amount) => {
    this.state.exchangeContract.methods
      .withdrawEther(web3.utils.toWei(amount, "Ether"))
      .send({
        from: this.state.account,
      })
      .on("transactionHand", (hash) => {
        this.INITIALIZE();
      })
      .on("error", (error) => {
        console.log(error);
        window.alert("There was an error depositing ETH");
      });
  };

  depositToken = (amount) => {
    const exchange = this.state.exchangeContract;
    const token = this.state.tokenContract;
    const account = this.state.account;
    amount = web3.utils.toWei(amount, "ether");
    token.methods
      .approve(exchange.options.address, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        console.log(`${tokens(amount)} tokens approved for deposit`);
        exchange.methods
          .depositToken(token.options.address, amount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            console.log(`Desposit of ${tokens(amount)} complete!`);
          });
      })
      .on("error", (error) => {
        console.log(error);
        window.alert("There was an error depositing ETH");
      });
  };

  withdrawToken = (amount) => {
    const exchange = this.state.exchangeContract;
    const token = this.state.tokenContract;
    const account = this.state.account;

    exchange.methods
      .withdrawToken(token.options.address, web3.utils.toWei(amount, "ether"))
      .send({ from: account })
      .on("transactionHash", (hash) => {
        console.log("withdrawal successful");
      })
      .on("error", (error) => {
        console.log(error);
        window.alert("There was an error depositing ETH");
      });
  };

  // CREATE ORDER ACTIONS
  makeBuyOrder = (amount, price) => {
    const tokenGet = this.state.tokenContract.options.address;
    const amountGet = web3.utils.toWei(amount, "ether");
    const tokenGive = ETHER_ADDRESS;
    const amountGive = web3.utils.toWei((amount * price).toString(), "ether");

    // console.log(
    //   `Buy order submitted for ${amount} PVB tokens at price of ${price}`
    // );
    // return;
    this.state.exchangeContract.methods
      .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        console.log("Buy order successfully submitted");
      })
      .on("error", (error) => {
        console.log("Error submitting buy order: ", error);
        window.alert("Error submitting buy order");
      });
  };
  makeSellOrder = (amount, price) => {
    const tokenGet = ETHER_ADDRESS;
    const amountGet = web3.utils.toWei((amount * price).toString(), "ether");
    const tokenGive = this.state.tokenContract.options.address;
    const amountGive = web3.utils.toWei(amount, "ether");

    // console.log(
    //   `Sell order submitted for ${amount} PVB tokens at price of ${price}`
    // );
    // return;

    this.state.exchangeContract.methods
      .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        console.log("Sell order successfully submitted");
      })
      .on("error", (error) => {
        console.log("Error submitting sell order: ", error);
        window.alert("Error submitting sell order");
      });
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
                <Balance
                  balances={this.state.balances}
                  depositEther={this.depositEther}
                  withdrawEther={this.withdrawEther}
                  depositToken={this.depositToken}
                  withdrawToken={this.withdrawToken}
                />
                <NewOrder
                  makeBuyOrder={this.makeBuyOrder}
                  makeSellOrder={this.makeSellOrder}
                />
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
