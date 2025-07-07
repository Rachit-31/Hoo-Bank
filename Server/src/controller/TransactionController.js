import Account from '../models/Account.js';
import PDFDocument from 'pdfkit';
import Transaction from '../models/Transaction.js';
import { v4 as uuidv4 } from 'uuid';
import Transfer from '../models/Transfer.js';


export const transferMoney = async (req, res) => {
  try {
    const { fromAccountId, toAccountNumber, amount, description, method, ifscCode } = req.body;

    if (!fromAccountId || !toAccountNumber || !amount || !method || !ifscCode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    const senderAccount = await Account.findById(fromAccountId);
    if (!senderAccount) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    if (senderAccount.accountNumber === toAccountNumber) {
      return res.status(400).json({ message: "Cannot transfer to the same account" });
    }

    const recipientAccount = await Account.findOne({ accountNumber: toAccountNumber });
    if (!recipientAccount) {
      return res.status(404).json({ message: "Recipient account not found" });
    }

    if (senderAccount.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct from sender
    senderAccount.balance -= amount;
    await senderAccount.save();

    // Credit to recipient
    recipientAccount.balance += amount;
    await recipientAccount.save();

    // Create transactions
    await Transaction.create([
      {
        accountId: senderAccount._id,
        type: "Debit",
        amount,
        status: "Completed",
        description: `Transfer to ${toAccountNumber} (${method})`
      },
      {
        accountId: recipientAccount._id,
        type: "Credit",
        amount,
        status: "Completed",
        description: `Transfer from ${senderAccount.accountNumber} (${method})`
      }
    ]);

    // Create transfer record
    const referenceNumber = `TXN-${uuidv4().slice(0, 8).toUpperCase()}`;

    await Transfer.create({
      senderAccount: senderAccount._id,
      recipientAccountNumber: toAccountNumber,
      ifscCode,
      amount,
      method,
      status: "Completed",
      referenceNumber
    });

    return res.status(200).json({
      message: "Transfer successful",
      referenceNumber,
      from: senderAccount.accountNumber,
      to: recipientAccount.accountNumber,
      amount,
      method
    });
  } catch (err) {
    console.error("Transfer error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
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

    console.log('📥 Route hit with accountId:', accountId);

    // ✅ Query transfers (limit added for safety)
    const transfers = await Transfer.find({ senderAccount: accountId })
      .sort({ createdAt: -1 })
      .limit(50);


    if (!transfers.length) {
      return res.status(404).json({ message: 'No transfers found' });
    }

    // ✅ Set up PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    doc.on('error', (err) => {
      console.error('❌ PDF stream error:', err);
      res.status(500).json({ message: 'Error creating PDF stream', error: err.message });
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transfer-history.pdf');

    doc.pipe(res);

    // ✅ PDF Header
    doc
      .fontSize(22)
      .fillColor('#1f2937')
      .text('FirstChoice Bank', { align: 'center' });

    doc
      .fontSize(14)
      .fillColor('black')
      .text('Official Transfer History', { align: 'center' });

    doc
      .fontSize(12)
      .fillColor('#555')
      .text(`Sender Account ID: ${accountId}`, { align: 'center' });

    doc.moveDown(2);

    // ✅ Table Setup
    const headers = ['Date', 'Recipient A/C', 'Method', 'Amount (₹)', 'Status', 'Reference'];
    const columnWidths = [80, 100, 70, 80, 80, 120];
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
      doc
        .moveTo(startX, y + 20)
        .lineTo(startX + columnWidths.reduce((a, b) => a + b), y + 20)
        .strokeColor('#e5e7eb')
        .stroke();
      y += 22;
    };

    drawRow(headers, true);

    // ✅ Table rows
    transfers.forEach((tx, idx) => {
      try {
        drawRow([
          new Date(tx.createdAt).toLocaleDateString('en-IN'),
          tx.recipientAccountNumber || 'N/A',
          tx.method || '-',
          tx.amount?.toLocaleString('en-IN') || '0',
          tx.status || '-',
          tx.referenceNumber || '-',
        ]);
      } catch (err) {
        console.error(`⚠️ Error rendering row ${idx}:`, err.message);
      }
    });

    // ✅ Footer
    doc.moveDown(4);
    doc
      .fontSize(10)
      .fillColor('#666')
      .text('This is a system-generated transfer history. For support, contact us at support@firstchoicebank.com.', {
        align: 'center',
        lineGap: 4,
      });

    doc.end();
    console.log('✅ PDF successfully streamed.');
  } catch (err) {
    console.error('❌ PDF generation error:', err);
    res.status(500).json({ message: 'Error generating PDF', error: err.message });
  }
};