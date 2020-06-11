import React from "react";
import moment from "moment";
import { ETHER_ADDRESS, tokens, ether } from "../helpers";

export default function Trades(props) {
  const decorateOrder = (order, previousOrderIndex) => {
    let etherAmount;
    let tokenAmount;

    if (order.tokenGive === ETHER_ADDRESS) {
      etherAmount = order.amountGive;
      tokenAmount = order.amountGet;
    } else {
      etherAmount = order.amountGet;
      tokenAmount = order.amountGive;
    }

    let tokenPrice = etherAmount / tokenAmount;
    const precision = 100000;
    tokenPrice = Math.round(tokenPrice * precision) / precision;

    let previousOrder;
    if (previousOrderIndex < 0) {
      previousOrder = props.trades[0];
    } else {
      previousOrder = props.trades[previousOrderIndex];
    }

    let last_etherAmount;
    if (previousOrder.tokenGive === ETHER_ADDRESS) {
      last_etherAmount = previousOrder.amountGive;
    } else {
      last_etherAmount = previousOrder.amountGet;
    }

    return {
      ...order,
      etherAmount: ether(etherAmount),
      tokenAmount: tokens(tokenAmount),
      tokenPrice,
      formattedTimestamp: moment.unix(order.timestamp).format("h:mm:ss a M/D"),
      tokenPriceClass: tokenPriceClass(etherAmount, order.id, last_etherAmount),
    };
  };

  const tokenPriceClass = (thisPrice, orderId, lastPrice) => {
    let className;

    if (lastPrice < thisPrice) {
      className = "success";
    } else if (lastPrice > thisPrice) {
      className = "danger";
    } else {
      className = "warning";
    }

    console.log("Last price: ", lastPrice);
    console.log("This price: ", thisPrice);
    return className;
  };

  const showFilledOrders = (orders) => {
    orders = orders.sort((a, b) => b.timestamp - a.timestamp);

    return (
      <tbody>
        {orders.map((trd, i) => (
          <tr key={trd.id}>
            <td className="text-muted">{trd.formattedTimestamp}</td>
            <td>{trd.tokenAmount}</td>
            <td className={`text-${trd.tokenPriceClass}`}>{trd.tokenPrice}</td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="vertical">
      <div className="card bg-dark text-white">
        <div className="card-header">TRADES</div>
        <div className="card-body">
          <table className="table table-dark table-sm small">
            <thead>
              <tr>
                <th>Time</th>
                <th>PVB</th>
                <th>PVB/ETH</th>
              </tr>
            </thead>
            {showFilledOrders(
              props.trades.map((o, i) => decorateOrder(o, i - 1))
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
