import { Tabs, Tab } from "react-bootstrap";
import { tokens, ether } from "../helpers";
// import Spinner from './Spinner'

import React, { Component } from "react";

export class Balance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleEthAmountChange = (e) => {
    this.setState({ ethAmount: e });
  };
  handleTokenAmountChange = (e) => {
    this.setState({ tokenAmount: e });
  };

  HANDLE_formSubmit_ETH_deposit = async (event) => {
    event.preventDefault();
    this.props.depositEther(this.state.ethAmount);
  };

  HANDLE_formSubmit_ETH_withdrawal = async (event) => {
    event.preventDefault();
    this.props.withdrawEther(this.state.ethAmount);
  };

  HANDLE_formSubmit_TOKEN_deposit = async (event) => {
    event.preventDefault();
    this.props.depositToken(this.state.tokenAmount);
  };

  HANDLE_formSubmit_TOKEN_withdrawal = async (event) => {
    event.preventDefault();
    this.props.withdrawToken(this.state.tokenAmount);
  };

  showForm = (props) => {
    const {
      exchangeEtherBalance,
      exchangeTokenBalance,
      walletEtherBalance,
      walletTokenBalance,
    } = props.balances;

    return (
      <Tabs defaultActiveKey="deposit" className="bg-dark text-white">
        <Tab eventKey="deposit" title="Deposit" className="bg-dark">
          <table className="table table-dark table-sm small">
            <thead>
              <tr>
                <th>Token</th>
                <th>Wallet</th>
                <th>Exchange</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ETH</td>
                <td>{ether(walletEtherBalance)}</td>
                <td>{ether(exchangeEtherBalance)}</td>
              </tr>
            </tbody>
          </table>

          {/* ETH DEPOSIT FORM =================================================== */}
          <form
            className="row"
            onSubmit={(event) => {
              this.HANDLE_formSubmit_ETH_deposit(event);
            }}
          >
            <div className="col-12 col-sm pr-sm-2">
              <input
                type="text"
                name="ethAmount"
                placeholder="ETH Amount"
                onChange={(e) => this.handleEthAmountChange(e.target.value)}
                className="form-control form-control-sm bg-dark text-white"
                required
              />
            </div>
            <div className="col-12 col-sm-auto pl-sm-0">
              <button
                type="submit"
                className="btn btn-primary btn-block btn-sm"
              >
                Deposit
              </button>
            </div>
          </form>

          <table className="table table-dark table-sm small">
            <tbody>
              <tr>
                <td>PVB</td>
                <td>{tokens(walletTokenBalance)}</td>
                <td>{tokens(exchangeTokenBalance)}</td>
              </tr>
            </tbody>
          </table>

          {/* PVB TOKEN DEPOSIT FORM ============================================ */}
          <form
            className="row"
            onSubmit={(event) => {
              this.HANDLE_formSubmit_TOKEN_deposit(event);
            }}
          >
            <div className="col-12 col-sm pr-sm-2">
              <input
                type="text"
                name="pvbAmount"
                placeholder="PVB Amount"
                onChange={(e) => this.handleTokenAmountChange(e.target.value)}
                className="form-control form-control-sm bg-dark text-white"
                required
              />
            </div>
            <div className="col-12 col-sm-auto pl-sm-0">
              <button
                type="submit"
                className="btn btn-primary btn-block btn-sm"
              >
                Deposit
              </button>
            </div>
          </form>
        </Tab>

        {/* WITHDRAWALS TAB ========================================================= */}
        <Tab eventKey="withdraw" title="Withdraw" className="bg-dark">
          <table className="table table-dark table-sm small">
            <thead>
              <tr>
                <th>Token</th>
                <th>Wallet</th>
                <th>Exchange</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ETH</td>
                <td>{ether(walletEtherBalance)}</td>
                <td>{ether(exchangeEtherBalance)}</td>
              </tr>
            </tbody>
          </table>

          {/* ETH WITHDRAWAL FORM =================================================== */}
          <form
            className="row"
            onSubmit={(event) => {
              this.HANDLE_formSubmit_ETH_withdrawal(event);
            }}
          >
            <div className="col-12 col-sm pr-sm-2">
              <input
                type="text"
                placeholder="ETH Amount"
                onChange={(e) => this.handleEthAmountChange(e.target.value)}
                className="form-control form-control-sm bg-dark text-white"
                required
              />
            </div>
            <div className="col-12 col-sm-auto pl-sm-0">
              <button
                type="submit"
                className="btn btn-primary btn-block btn-sm"
              >
                Withdraw
              </button>
            </div>
          </form>

          <table className="table table-dark table-sm small">
            <tbody>
              <tr>
                <td>PVB</td>
                <td>{tokens(walletTokenBalance)}</td>
                <td>{tokens(exchangeTokenBalance)}</td>
              </tr>
            </tbody>
          </table>

          {/* PVB TOKEN WITHDRAWAL FORM ============================================ */}
          <form
            className="row"
            onSubmit={(event) => {
              this.HANDLE_formSubmit_TOKEN_withdrawal(event);
            }}
          >
            <div className="col-12 col-sm pr-sm-2">
              <input
                type="text"
                placeholder="PVB Amount"
                onChange={(e) => this.handleTokenAmountChange(e.target.value)}
                className="form-control form-control-sm bg-dark text-white"
                required
              />
            </div>
            <div className="col-12 col-sm-auto pl-sm-0">
              <button
                type="submit"
                className="btn btn-primary btn-block btn-sm"
              >
                Withdraw
              </button>
            </div>
          </form>
        </Tab>
      </Tabs>
    );
  };

  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">Balance</div>
        <div className="card-body">{this.showForm(this.props)}</div>
      </div>
    );
  }
}

export default Balance;
