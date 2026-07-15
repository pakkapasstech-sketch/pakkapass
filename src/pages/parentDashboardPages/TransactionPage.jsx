import { useEffect, useMemo, useState } from 'react';

import {
  HiOutlineCurrencyRupee,
  HiOutlineReceiptTax,
  HiOutlineCheckCircle,
  HiOutlineSearch,
} from 'react-icons/hi';

import '../../styles/TransactionPage.css';
import studentService from '../../services/student.service';
import parentService from '../../services/parent.service';
import { useLoading } from '../../contexts/LoadingContext';

const TransactionPage = () => {
  const { setLoading } = useLoading();
  const [summary, setSummary] = useState({
    totalPaid: 0,
    totalTransactions: 0,
    successfulPayments: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadAllTransactions = async () => {
      try {
        setLoading(true);
        const data = await parentService.getTransactions();
        
        let totalPaid = 0;
        let totalTransactions = 0;
        let successfulPayments = 0;
        
        const txns = data.transactions || [];
        
        const formattedTxns = txns.map(t => {
          totalPaid += t.amount || 0;
          totalTransactions += 1;
          if (t.status === 'Success') successfulPayments += 1;
          
          return {
            id: t.transactionId || t.id,
            studentName: t.student?.name || 'Unknown',
            date: t.createdAt,
            plan: t.plan?.name || '-',
            amount: t.amount || 0,
            discountAmount: t.discountAmount || 0,
            method: t.paymentMode || 'UPI',
            status: t.status || 'Success',
          };
        });
        
        setSummary({
          totalPaid,
          totalTransactions,
          successfulPayments,
        });
        setTransactions(formattedTxns);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAllTransactions();
  }, [setLoading]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const query = search.toLowerCase();
      return (
        t.studentName.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query) ||
        t.plan.toLowerCase().includes(query)
      );
    });
  }, [transactions, search]);

  return (
    <div className="transaction-page">
      <div className="transaction-header">
        <div>
          <h2>Transactions</h2>
          <p>View your billing and payment history.</p>
        </div>
      </div>

      <div className="transaction-stats">
        <div className="transaction-stat-card">
          <span className="stat-label">Total Spent</span>
          <h3 className="stat-value">₹{summary.totalPaid.toLocaleString()}</h3>
        </div>

        <div className="transaction-stat-card">
          <span>Total Transactions</span>
          <h3>{summary.totalTransactions}</h3>
        </div>

        <div className="transaction-stat-card">
          <span>Successful Payments</span>
          <h3>{summary.successfulPayments}</h3>
        </div>
      </div>

      <div className="transaction-table-card">
        <div className="transaction-toolbar">
          <div className="transaction-search">
            <HiOutlineSearch className="txn-search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transaction..."
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Plan</th>
                <th>Discount Amount</th>
                <th>Paid Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={`${transaction.studentName}-${transaction.id}`}>
                  <td style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>
                    {transaction.studentName}
                  </td>
                  <td>{transaction.id}</td>
                  <td>
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td>{transaction.plan}</td>
                  <td>₹{(transaction.discountAmount || 0).toLocaleString()}</td>
                  <td>₹{(transaction.amount || 0).toLocaleString()}</td>
                  <td>{transaction.method}</td>
                  <td>
                    <span
                      className={`transaction-status ${
                        transaction.status === 'Success'
                          ? 'success'
                          : 'failed'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '16px', color: '#888' }}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;