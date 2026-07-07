import { useEffect, useMemo, useState } from 'react';

import {
  HiOutlineCurrencyRupee,
  HiOutlineReceiptTax,
  HiOutlineCheckCircle,
  HiOutlineSearch,
} from 'react-icons/hi';

import '../../styles/TransactionPage.css';
import studentService from '../../services/student.service';
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
        const students = await studentService.getParentStudents();

        if (students.length === 0) {
          setSummary({ totalPaid: 0, totalTransactions: 0, successfulPayments: 0 });
          setTransactions([]);
          return;
        }

        const txPromises = students.map(async (student) => {
          const data = await studentService.getTransactions(student.id);
          return {
            studentName: student.name,
            summary: data.summary,
            transactions: data.transactions.map(t => ({
              ...t,
              studentName: student.name // Inject student name into each transaction
            }))
          };
        });

        const results = await Promise.all(txPromises);

        let aggTotalPaid = 0;
        let aggTotalTransactions = 0;
        let aggSuccessfulPayments = 0;
        let aggTransactions = [];

        results.forEach(result => {
          aggTotalPaid += result.summary.totalPaid || 0;
          aggTotalTransactions += result.summary.totalTransactions || 0;
          aggSuccessfulPayments += result.summary.successfulPayments || 0;
          aggTransactions = [...aggTransactions, ...result.transactions];
        });

        // Optionally sort all transactions by date descending
        aggTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        setSummary({
          totalPaid: aggTotalPaid,
          totalTransactions: aggTotalTransactions,
          successfulPayments: aggSuccessfulPayments,
        });
        setTransactions(aggTransactions);
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
      const value = search.toLowerCase();

      return (
        String(t.id).toLowerCase().includes(value) ||
        t.studentName?.toLowerCase().includes(value) ||
        t.plan?.toLowerCase().includes(value) ||
        t.method?.toLowerCase().includes(value) ||
        t.status?.toLowerCase().includes(value)
      );
    });
  }, [transactions, search]);

  return (
    <div className="transaction-page">
      <div className="transaction-header">
        <div>
          <h2>Transactions</h2>
          <p>View all payment history for your children.</p>
        </div>
      </div>

      <div className="transaction-stats">
        <div className="transaction-stat-card">
          <HiOutlineCurrencyRupee />
          <span>Total Paid</span>
          <h3>₹{summary.totalPaid}</h3>
        </div>

        <div className="transaction-stat-card">
          <HiOutlineReceiptTax />
          <span>Total Transactions</span>
          <h3>{summary.totalTransactions}</h3>
        </div>

        <div className="transaction-stat-card">
          <HiOutlineCheckCircle />
          <span>Successful Payments</span>
          <h3>{summary.successfulPayments}</h3>
        </div>
      </div>

      <div className="transaction-table-card">
        <div className="transaction-toolbar">
          <div className="transaction-search">
            <HiOutlineSearch />
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
                <th>Amount</th>
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
                  <td>₹{transaction.amount}</td>
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '16px', color: '#888' }}>
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