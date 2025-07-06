import PDFDocument from 'pdfkit';
import Transaction from '../models/Transaction';



export const downloadStatementPDF = async (req, res) => {
  try {
    const { accountId } = req.params;

    const transactions = await Transaction.find({ accountId }).sort({ date: -1 });

    if (!transactions.length) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    // Create PDF
    const doc = new PDFDocument();

    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=statement.pdf');

    // Pipe PDF to response
    doc.pipe(res);

    // PDF Title
    doc.fontSize(18).text('Bank Statement', { align: 'center' });
    doc.moveDown();

    // Table headers
    doc.fontSize(12).text(`Account ID: ${accountId}`);
    doc.moveDown().text('Date\t\tType\tAmount\tStatus\tDescription');
    doc.moveDown();

    // Table rows
    transactions.forEach(txn => {
      doc.text(
        `${txn.date.toISOString().split('T')[0]}\t${txn.type}\t₹${txn.amount}\t${txn.status}\t${txn.description || '-'}`,
        {
          lineGap: 4,
        }
      );
    });

    doc.end(); 
  } catch (err) {
    console.error('PDF error:', err);
    res.status(500).json({ message: 'Error generating PDF', error: err.message });
  }
};