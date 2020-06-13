import React from "react";
import { groupBy, get } from "lodash";

import { ETHER_ADDRESS, decorateOrder } from "../helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// import Spinner from "./Spinner";

export default function OrderBook(props) {
  const processOrderBook = () => {
    let orderBook = props.orderBook;

    orderBook = orderBook.map((order) => decorateOrderBook(order));
    orderBook = groupOrderBook(orderBook);

    return orderBook;
  };

  const groupOrderBook = (orderBook) => {
    let orders;
    // Sort by 'orderType'
    orders = groupBy(orderBook, "orderType");

    // Fetch buy orders
    const buyOrders = get(orders, "buy", []);
    // Sort by price
    orders = {
      ...orders,
      buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice),
    };

    // Fetch sell orders
    const sellOrders = get(orders, "sell", []);
    // Sort by price
    orders = {
      ...orders,
      sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice),
    };

    return orders;
  };

  const decorateOrderBook = (order) => {
    const orderType = order.tokenGive === ETHER_ADDRESS ? "buy" : "sell";
    const orderTypeClass = orderType === "buy" ? "success" : "danger";
    const orderFillAction = orderType === "buy" ? "sell" : "buy";

    return {
      ...order,
      orderType,
      orderTypeClass,
      orderFillAction,
    };
  };

  const showOrderBook = (orderBook) => {
    return (
      <tbody>
        {orderBook.sellOrders.map((order) => renderOrder(order))}
        <tr>
          <th>PVB</th>
          <th>PVB/ETH</th>
          <th>ETH</th>
        </tr>
        {orderBook.buyOrders.map((order) => renderOrder(order))}
      </tbody>
    );
  };

  const renderOrder = (order) => {
    order = decorateOrder(order);
    return (
      <OverlayTrigger
        key={order.id}
        placement="auto"
        overlay={
          <Tooltip id={order.id}>
            {`Click here to ${order.orderFillAction}`}
          </Tooltip>
        }
      >
        <tr
          key={order.id}
          className="order-book-order"
          onClick={(e) => props.fillOrder(order)}
        >
          <td>{order.tokenAmount}</td>
          <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
          <td>{order.etherAmount}</td>
        </tr>
      </OverlayTrigger>
    );
  };

  return (
    <div className="vertical">
      <div className="card bg-dark text-white">
        <div className="card-header">Order Book</div>
        <div className="card-body order-book">
          <table className="table table-dark table-sm small">
            {showOrderBook(processOrderBook())}
          </table>
        </div>
      </div>
    </div>
  );
}
