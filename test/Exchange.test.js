import { tokens, ether, EVM_REVERT, ETHER_ADDRESS } from "./helpers";

const Exchange = artifacts.require("./Exchange");
const Token = artifacts.require("./Token");

require("chai").use(require("chai-as-promised")).should();

contract("Exchange", ([deployer, feeAccount, user1, user2]) => {
  let token;
  let exchange;

  const name = "Pvblic Exchange";
  const feePercent = 10;

  beforeEach(async () => {
    token = await Token.new();
    token.transfer(user1, tokens(100), { from: deployer });

    exchange = await Exchange.new(feeAccount, feePercent);
  });

  describe("deployment", () => {
    it("tracks the name", async () => {
      const result = await exchange.name();
      result.should.equal(name);
    });

    it("tracks the fee account", async () => {
      const result = await exchange.feeAccount();
      result.should.equal(feeAccount);
    });

    it("tracks the fee percent", async () => {
      const result = await exchange.feePercent();
      result.toString().should.equal(feePercent.toString());
    });
  });

  describe("fallback", () => {
    it("reverts when Ether is sent", async () => {
      await exchange
        .sendTransaction({ value: 1, from: user1 })
        .should.be.rejectedWith(EVM_REVERT);
    });
  });

  describe("ether deposits", async () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = ether(1);
      result = await exchange.depositEther({ from: user1, value: amount });
    });

    it("tracks Ether deposits", async () => {
      const balance = await exchange.tokens(ETHER_ADDRESS, user1);
      balance.toString().should.equal(amount.toString());
    });

    it("emits an Ether deposit event", async () => {
      const log = result.logs[0];
      log.event.should.eq("Deposit");
      const event = log.args;
      event.token.should.equal(ETHER_ADDRESS);
      event.user.toString().should.equal(user1);
      event.amount.toString().should.equal(amount.toString());
      event.balance.toString().should.equal(amount.toString());
    });
  });

  describe("ether widrawales", async () => {
    let result;
    let amount;
    beforeEach(async () => {
      amount = ether(1);
      await exchange.depositEther({ from: user1, value: amount });
    });

    describe("success", async () => {
      beforeEach(async () => {
        result = await exchange.withdrawalEther(amount, { from: user1 });
      });

      it("withdrawals Ether from exchange successfully", async () => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1);
        balance.toString().should.equal("0");
      });

      it("emits an Ether withdrawal event", async () => {
        const log = result.logs[0];
        log.event.should.eq("Withdrawal");
        const event = log.args;
        event.token.should.equal(ETHER_ADDRESS);
        event.user.toString().should.equal(user1);
        event.amount.toString().should.equal(amount.toString());
        event.balance.toString().should.equal("0");
      });
    });

    describe("failure", async () => {
      it("rejects attempted withdrawals for amounts exceeding user balance", async () => {
        await exchange
          .withdrawalEther(ether(100), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      });
    });
  });

  describe("token deposits", async () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = tokens(10);
      await token.approve(exchange.address, amount, {
        from: user1,
      });

      result = await exchange.depositToken(token.address, amount, {
        from: user1,
      });
    });

    describe("success", () => {
      it("tracks token depoist", async () => {
        let balance;

        // Verify 'Exchange' token balance
        balance = await token.balanceOf(exchange.address);
        balance.toString().should.equal(amount.toString());

        // Verify 'User1' token balance
        balance = await exchange.tokens(token.address, user1);
        balance.toString().should.equal(amount.toString());
      });

      it("emits a token deposit event", async () => {
        const log = result.logs[0];
        log.event.should.eq("Deposit");
        const event = log.args;
        event.token.should.equal(token.address);
        event.user.toString().should.equal(user1);
        event.amount.toString().should.equal(amount.toString());
        event.balance.toString().should.equal(amount.toString());
      });
    });

    describe("failure", () => {
      it("rejects Ether deposits", async () => {
        // REJECT Ether
        await exchange
          .depositToken(ETHER_ADDRESS, tokens(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("fails when - 0 - tokens have been approved", async () => {
        await exchange
          .depositToken(token.address, tokens(10), { from: user2 })
          .should.be.rejectedWith(EVM_REVERT);
      });
    });
  });

  describe("token withdrawals", async () => {
    let result;
    let amount;

    describe("success", async () => {
      beforeEach(async () => {
        amount = tokens(10);

        // Initial deposit
        await token.approve(exchange.address, amount, { from: user1 });
        await exchange.depositToken(token.address, amount, { from: user1 });

        // Attempt withdrawal
        result = await exchange.withdrawalToken(token.address, amount, {
          from: user1,
        });
      });

      it("withdrawals tokens successfully", async () => {
        const balance = await exchange.tokens(token.address, user1);
        balance.toString().should.equal("0");
      });

      it("emits at token withdrawal event", async () => {
        const log = result.logs[0];
        log.event.should.eq("Withdrawal");
        const event = log.args;
        event.token.should.equal(token.address);
        event.user.should.equal(user1);
        event.amount.toString().should.equal(amount.toString());
        event.balance.toString().should.equal("0");
      });
    });

    describe("failure", async () => {
      it("rejects Ether withdrawals", async () => {
        await exchange
          .withdrawalToken(ETHER_ADDRESS, tokens(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("fails for insufficient balances", async () => {
        await exchange
          .withdrawalToken(token.address, tokens(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      });
    });
  });

  describe("checking balances", async () => {
    beforeEach(async () => {
      exchange.depositEther({ from: user1, value: ether(1) });
    });

    it("returns user balance", async () => {
      const result = await exchange.balanceOf(ETHER_ADDRESS, user1);
      result.toString().should.equal(ether(1).toString());
    });
  });
});
