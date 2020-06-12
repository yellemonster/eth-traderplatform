import moment from "moment";

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

  if (lastPrice < thisPrice) {
    className = "success";
  } else if (lastPrice > thisPrice) {
    className = "danger";
  } else {
    className = "warning";
  }

  return className;
};

export const decorate_openOrder = (order) => {
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
