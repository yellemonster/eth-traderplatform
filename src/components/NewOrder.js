import React, { Component } from "react";
import { Tabs, Tab } from "react-bootstrap";

export class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buyAmount: "0",
      buyPrice: "0",
      sellAmount: "0",
      sellPrice: "0",
    };
  }

  // BUY ====================================================================
  handle_buyAmountChange = (e) => {
    this.setState({ buyAmount: e });
  };
  handle_buyPriceChange = (e) => {
    this.setState({ buyPrice: e });
  };
  HANDLE_formSubmit_makeBuyOrder = async (event) => {
    event.preventDefault();
    this.props.makeBuyOrder(this.state.buyAmount, this.state.buyPrice);
  };

  // SELL ===================================================================
  handle_sellAmountChange = (e) => {
    this.setState({ sellAmount: e });
  };
  handle_sellPriceChange = (e) => {
    this.setState({ sellPrice: e });
  };
  HANDLE_formSubmit_makeSellOrder = async (event) => {
    event.preventDefault();
    this.props.makeSellOrder(this.state.sellAmount, this.state.sellPrice);
  };

  showForm = () => {
    return (
      <Tabs defaultActiveKey="buy" className="bg-dark text-white">
        <Tab eventKey="buy" title="Buy" className="bg-dark">
          <form
            onSubmit={(event) => {
              this.HANDLE_formSubmit_makeBuyOrder(event);
            }}
          >
            <div className="form-group small">
              <label>Buy Amount (PVB)</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Buy Amount"
                  onChange={(e) => this.handle_buyAmountChange(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group small">
              <label>Buy Price</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Buy Price"
                  onChange={(e) => this.handle_buyPriceChange(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btm-sm btn-black">
              Submit Buy Order
            </button>
            <small className="ml-3">
              Total: {this.state.buyAmount * this.state.buyPrice} ETH
            </small>
          </form>
        </Tab>
        <Tab eventKey="sell" title="Sell" className="bg-dark">
          <form
            onSubmit={(event) => {
              this.HANDLE_formSubmit_makeSellOrder(event);
            }}
          >
            <div className="form-group small">
              <label>Sell Amount (PVB)</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Sell Amount"
                  onChange={(e) => this.handle_sellAmountChange(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group small">
              <label>Sell Price</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm bg-dark text-white"
                  placeholder="Sell Price"
                  onChange={(e) => this.handle_sellPriceChange(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btm-sm btn-black">
              Submit Sell Order
            </button>
            <small className="ml-3">
              Total: {this.state.sellAmount * this.state.sellPrice} ETH
            </small>
          </form>
        </Tab>
      </Tabs>
    );
  };

  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">New Order</div>
        <div className="card-body">{this.showForm()}</div>
      </div>
    );
  }
}

export default NewOrder;
