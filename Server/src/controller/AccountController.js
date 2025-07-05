import Account from "../models/Account.js";

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