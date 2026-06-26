import {
  HiOutlineCurrencyRupee,
  HiOutlineReceiptTax,
  HiOutlineCheckCircle,
  HiOutlineSearch,
} from 'react-icons/hi';

import '../../styles/TransactionPage.css';

const TransactionPage = () => {
  const transactions = [
    {
      id: 'TXN10001',
      date: '01 Jan 2026',
      plan: 'Premium Plan',
      amount: '₹1,999',
      method: 'UPI',
      status: 'Success',
    },
    {
      id: 'TXN10002',
      date: '01 Jan 2025',
      plan: 'Premium Plan',
      amount: '₹1,999',
      method: 'Credit Card',
      status: 'Success',
    },
    {
      id: 'TXN10003',
      date: '01 Jan 2024',
      plan: 'Basic Plan',
      amount: '₹999',
      method: 'Net Banking',
      status: 'Success',
    },
  ];

  return (
    <div className="transaction-page">

      <div className="transaction-header">
        <div>
          <h2>Transactions</h2>
          <p>View all your payment history.</p>
        </div>
      </div>

      <div className="transaction-stats">

        <div className="transaction-stat-card">
          <HiOutlineCurrencyRupee />
          <span>Total Paid</span>
          <h3>₹4,997</h3>
        </div>

        <div className="transaction-stat-card">
          <HiOutlineReceiptTax />
          <span>Total Transactions</span>
          <h3>3</h3>
        </div>

        <div className="transaction-stat-card">
          <HiOutlineCheckCircle />
          <span>Successful Payments</span>
          <h3>3</h3>
        </div>

      </div>

      <div className="transaction-table-card">

        <div className="transaction-toolbar">

          <div className="transaction-search">

            <HiOutlineSearch />

            <input
              type="text"
              placeholder="Search transaction..."
            />

          </div>

        </div>

        <table className="transaction-table">

          <thead>

            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>

          </thead>

          <tbody>

            {transactions.map((transaction) => (

              <tr key={transaction.id}>

                <td>{transaction.id}</td>

                <td>{transaction.date}</td>

                <td>{transaction.plan}</td>

                <td>{transaction.amount}</td>

                <td>{transaction.method}</td>

                <td>
                  <span className="transaction-status success">
                    {transaction.status}
                  </span>
                </td>

                <td>
                  <button className="transaction-download-btn">
                    Download
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default TransactionPage;