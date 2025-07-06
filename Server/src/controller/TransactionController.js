import Account from '../models/Account.js';
import PDFDocument from 'pdfkit';
import Transaction from '../models/Transaction.js';


export const transferMoney = async (req, res) => {
  try {
    const { fromAccountId, toAccountNumber, amount, description } = req.body;
    const {userId} = req.params;  

    if (!fromAccountId || !toAccountNumber || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch source account
    const fromAccount = await Account.findOne({ _id: fromAccountId, userId });
    if (!fromAccount) {
      return res.status(404).json({ message: 'Source account not found or unauthorized' });
    }

    // Fetch destination account (can belong to same or different user)
    const toAccount = await Account.findOne({ accountNumber: toAccountNumber });
    if (!toAccount) {
      return res.status(404).json({ message: 'Destination account not found' });
    }

    // Check balance
    if (fromAccount.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Perform transfer
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save();
    await toAccount.save();

    // Create debit transaction (sender)
    const debitTxn = new Transaction({
      accountId: fromAccount._id,
      type: 'Debit',
      amount,
      status: 'Completed',
      description: description || `Transfer to ${toAccount.accountNumber}`
    });

    // Create credit transaction (receiver)
    const creditTxn = new Transaction({
      accountId: toAccount._id,
      type: 'Credit',
      amount,
      status: 'Completed',
      description: description || `Received from ${fromAccount.accountNumber}`
    });

    await debitTxn.save();
    await creditTxn.save();

    res.status(200).json({
      message: 'Transfer successful',
      transactionReference: debitTxn._id,
      newBalance: fromAccount.balance
    });
  } catch (err) {
    console.error('Transfer error:', err);
    res.status(500).json({ message: 'Transfer failed', error: err.message });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get all account IDs for this user
    const accounts = await Account.find({ userId });
    const accountIds = accounts.map(acc => acc._id);

    // Get all transactions for these account IDs
    const transactions = await Transaction.find({ accountId: { $in: accountIds } })
      .sort({ date: -1 });

    res.status(200).json({ message: 'Transactions fetched successfully', transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
};



export const downloadStatementPDF = async (req, res) => {
  try {
    const { accountId } = req.params;

    const transactions = await Transaction.find({ accountId }).sort({ date: -1 });

    if (!transactions.length) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    // PDF setup
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=bank-statement.pdf');
    doc.pipe(res);

    // Title
    doc
      .fontSize(22)
      .fillColor('#1f2937') // dark gray
      .text('FirstChoice Bank', { align: 'center' });

    doc
      .fontSize(14)
      .fillColor('black')
      .text('Official Account Statement', { align: 'center' });

    doc
      .fontSize(12)
      .fillColor('#555')
      .text(`Account ID: ${accountId}`, { align: 'center' });

    doc.moveDown(2);

    // Table headers
    const headers = ['Date', 'Type', 'Amount (₹)', 'Status', 'Description'];
    const columnWidths = [90, 80, 100, 80, 150];
    const startX = doc.page.margins.left;
    let y = doc.y;

    const drawRow = (data, isHeader = false) => {
      let x = startX;
      doc.font(isHeader ? 'Helvetica-Bold' : 'Helvetica').fontSize(10);
      data.forEach((text, i) => {
        doc
          .fillColor('black')
          .text(String(text), x + 2, y + 5, {
            width: columnWidths[i] - 4,
            align: 'left',
          });

        x += columnWidths[i];
      });

      // draw row bottom line
      doc.moveTo(startX, y + 20).lineTo(startX + columnWidths.reduce((a, b) => a + b), y + 20).strokeColor('#e5e7eb').stroke();
      y += 22;
    };

    drawRow(headers, true); // Header row

    transactions.forEach((txn) => {
      drawRow([
        new Date(txn.date).toLocaleDateString(),
        txn.type.toUpperCase(),
        txn.amount.toLocaleString('en-IN'),
        txn.status || '-',
        txn.description || '-',
      ]);
    });

    // Footer
    doc.moveDown(4);
    doc
      .fontSize(10)
      .fillColor('#666')
      .text('This is a system-generated statement. For queries, contact customer care at support@firstchoicebank.com.', {
        align: 'center',
        lineGap: 4,
      });

    doc.end();
  } catch (err) {
    console.error('PDF error:', err);
    res.status(500).json({ message: 'Error generating PDF', error: err.message });
  }
};
