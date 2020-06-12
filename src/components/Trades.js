import React from "react";
import { decorate_filledOrder } from "../helpers";
// import Spinner from "./Spinner";

export default function Trades(props) {
  const allTrades = props.trades;

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
              allTrades.map((o, i) => decorate_filledOrder(allTrades, o, i - 1))
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
