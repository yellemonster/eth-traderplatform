import React from "react";
import Chart from "react-apexcharts";
import { chartOptions, dummyData } from "./PriceChart.config";
import { decorateOrder, buildGraphData, getChartData } from "../helpers";

export default function PriceChart(props) {
  const priceSymbol = (delta) => {
    let output;
    if (delta === "+") {
      output = <span className="text-success">&#9650;</span>;
    } else {
      output = <span className="text-danger">&#9650;</span>;
    }
    return output;
  };

  const showPriceChart = () => {
    let orders = props.filledOrders;

    orders = orders.sort((a, b) => a.timestamp - b.timestamp);
    orders = orders.map((o) => decorateOrder(o));

    let chartData = getChartData(orders);

    return (
      <div className="price-chart">
        <div className="price">
          <h4>
            PVB/ETH &nbsp; {priceSymbol(chartData.lastPriceChange)}{" "}
            {chartData.lastPrice}
          </h4>
        </div>
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

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">Price Chart</div>
      <div className="card-body">{showPriceChart()}</div>
    </div>
  );
}
