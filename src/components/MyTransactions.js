import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { decorateMyFilledOrders, decorateMyOpenOrders } from "../helpers";
// import Spinner from "./Spinner";

export default function MyTransactions(props) {
  const { ordersFilled, ordersOpen, myAccount } = props;

  const showMyFilledOrders = () => {
    let orders = ordersFilled.filter(
      (o) => o.user === myAccount || o.userFill === myAccount
    );
    orders = orders.sort((a, b) => a.timestamp - b.timestamp);
    orders = decorateMyFilledOrders(orders, myAccount);

    return (
      <tbody>
        {orders.map((order) => {
          return (
            <tr key={order.id}>
              <td className="text-muted">{order.formattedTimestamp}</td>
              <td className={`text-${order.orderTypeClass}`}>
                {order.orderSign}
                {order.tokenAmount}
              </td>
              <td className={`text-${order.orderTypeClass}`}>
                {order.tokenPrice}
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  const showMyOpenOrders = () => {
    let orders = ordersOpen.filter((o) => o.user === myAccount);
    orders = orders.sort((a, b) => a.timestamp - b.timestamp);
    orders = decorateMyOpenOrders(orders, myAccount);

    return (
      <tbody>
        {orders.map((order) => {
          return (
            <tr key={order.id}>
              <td className={`text-${order.orderTypeClass}`}>
                {order.tokenAmount}
              </td>
              <td className={`text-${order.orderTypeClass}`}>
                {order.tokenPrice}
              </td>
              <td className="text-muted">
                <strong>X</strong>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">My Transactions</div>
      <div className="card-body">
        <Tabs defaultActiveKey="trades" className="bg-dark text-white">
          <Tab eventKey="trades" title="Trades" className="bg-dark">
            <table className="table table-dark table-sm small">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>DAPP</th>
                  <th>DAPP/ETH</th>
                </tr>
              </thead>
              {showMyFilledOrders()}
            </table>
          </Tab>
          <Tab eventKey="orders" title="Orders">
            <table className="table table-dark table-sm small">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>DAPP/ETH</th>
                  <th>Cancel</th>
                </tr>
              </thead>
              {showMyOpenOrders()}
            </table>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
