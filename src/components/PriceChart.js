import React from "react";
import Chart from "react-apexcharts";
import { chartOptions } from "./PriceChart.config";
import { decorateOrder, getChartData } from "../helpers";

export default function PriceChart(props) {
  const chartData = () => {
    let orders = props.filledOrders;

    orders = orders.sort((a, b) => a.timestamp - b.timestamp);
    orders = orders.map((o) => decorateOrder(o));

    let chartData = getChartData(orders);
    return chartData;
  };

  const priceSymbol = (delta) => {
    let output;
    if (delta === "+") {
      output = <span className="text-success">&#9650;</span>;
    } else {
      output = <span className="text-danger">&#9650;</span>;
    }
    return output;
  };

  const showPriceChart = (chartData) => {
    return (
      <div className="price-chart">
        <Chart
          options={chartOptions}
          series={chartData.series}
          type="candlestick"
          width="100%"
          height="100%"
        />
      </div>
    );
  };

  const headerBar = (chartData) => {
    return (
      <div className="price ml-3 mt-2">
        <h4>
          PVB/ETH &nbsp; {priceSymbol(chartData.lastPriceChange)}
          {"  "}
          {chartData.lastPrice}
        </h4>
      </div>
    );
  };

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">{headerBar(chartData())}</div>
      <div className="card-body">{showPriceChart(chartData())}</div>
    </div>
  );
}
