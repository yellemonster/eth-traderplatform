import moment from "moment";
import { groupBy, maxBy, minBy, get } from "lodash";

export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
export const DECIMALS = 10 ** 18;
export const ether = (wei) => {
  if (wei) {
    return wei / DECIMALS;
  }
};

// Same as ether
export const tokens = ether;

const tokenPriceClass = (thisPrice, lastOrderIndex, lastPrice) => {
  let className;

  if (lastOrderIndex < 0) {
    return "success";
  }

  if (lastPrice <= thisPrice) {
    className = "success";
  } else className = "danger";

  return className;
};

export const decorateOrder = (order) => {
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

  return {
    ...order,
    etherAmount: ether(etherAmount),
    tokenAmount: tokens(tokenAmount),
    tokenPrice,
    formattedTimestamp: moment.unix(order.timestamp).format("h:mm:ss a M/D"),
  };
};

export const decorate_filledOrder = (allOrders, order, lastOrderIndex) => {
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
  if (lastOrderIndex < 0) {
    previousOrder = allOrders[0];
  } else {
    previousOrder = allOrders[lastOrderIndex];
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
    tokenPriceClass: tokenPriceClass(
      etherAmount,
      lastOrderIndex,
      last_etherAmount
    ),
  };
};

export const decorateMyFilledOrders = (orders, account) => {
  return orders.map((order) => {
    order = decorateOrder(order);
    order = decorateMyFilledOrder_single(order, account);
    return order;
  });
};

export const decorateMyOpenOrders = (orders, account) => {
  return orders.map((order) => {
    order = decorateOrder(order);
    order = decorateMyOpenOrder_single(order, account);
    return order;
  });
};

export const decorateMyCancelledOrders = (orders, account) => {
  return orders.map((order) => {
    order = decorateOrder(order);
    order = decorateMyCanelledOrder_single(order, account);
    return order;
  });
};

const decorateMyFilledOrder_single = (order, account) => {
  const myOrder = order.user === account;
  let orderType;
  if (myOrder) {
    orderType = order.tokenGive === ETHER_ADDRESS ? "buy" : "sell";
  } else {
    orderType = order.tokenGive === ETHER_ADDRESS ? "sell" : "buy";
  }

  return {
    ...order,
    orderType,
    orderTypeClass: orderType === "buy" ? "success" : "danger",
    orderSign: orderType === "buy" ? "+" : "-",
  };
};

const decorateMyOpenOrder_single = (order, account) => {
  let orderType = order.tokenGive === ETHER_ADDRESS ? "buy" : "sell";

  return {
    ...order,
    orderType,
    orderTypeClass: orderType === "buy" ? "success" : "danger",
  };
};

const decorateMyCanelledOrder_single = (order, account) => {
  let orderType = order.tokenGive === ETHER_ADDRESS ? "buy" : "sell";

  return {
    ...order,
    orderType,
    orderTypeClass: orderType === "buy" ? "success" : "danger",
  };
};

const buildGraphData = (orders) => {
  orders = groupBy(orders, (o) =>
    moment.unix(o.timestamp).startOf("hour").format()
  );

  const hours = Object.keys(orders);
  const graphData = hours.map((hour) => {
    const group = orders[hour];

    const open = group[0];
    const high = maxBy(group, "tokenPrice");
    const low = minBy(group, "tokenPrice");
    const close = group[group.length - 1];

    return {
      x: new Date(hour),
      y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice],
    };
  });
  return graphData;
};

export const getChartData = (orders) => {
  let secondLastOrder;
  let lastOrder;
  [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length);

  const lastPrice = get(lastOrder, "tokenPrice");
  const secondLastPrice = get(secondLastOrder, "tokenPrice", 0);

  return {
    lastPrice,
    lastPriceChange: lastPrice >= secondLastPrice ? "+" : "-",
    series: [
      {
        data: buildGraphData(orders),
      },
    ],
  };
};
