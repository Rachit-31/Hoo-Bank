import Account from "../models/Account.js";
import CreditCard from "../models/CreditCard.js";

export const getUserAccounts = async (req, res) => {
  try {
    const {userId} = req.params;

    const accounts = await Account.find({ userId }).select('-__v');

    const grouped = {
      checking: [],
      savings: [],
      fixedDeposits: []
    };

    accounts.forEach(acc => {
      const item = {
        _id: acc._id,
        accountNumber: acc.accountNumber,
        balance: acc.balance,
        openedAt: acc.openedAt
      };

      if (acc.accountType === 'Checking') grouped.checking.push(item);
      else if (acc.accountType === 'Savings') grouped.savings.push(item);
      else if (acc.accountType === 'FixedDeposit') grouped.fixedDeposits.push(item);
    });

    res.status(200).json({
      message: 'Accounts fetched successfully',
      accounts: grouped
    });
  } catch (error) {
    console.error('Get accounts error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAccountDetails = async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await Account.findOne({ _id: accountId, userId: req.user._id }).select('-__v');

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json({
      message: 'Account details fetched',
      account
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching account', error: err.message });
  }
};


export const getCreditCardSummary = async (req, res) => {
  try {
    const cards = await CreditCard.find({ userId: req.user._id }).select('-__v');

    res.status(200).json({
      message: 'Credit card summary fetched',
      cards
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching credit cards', error: err.message });
  }
};