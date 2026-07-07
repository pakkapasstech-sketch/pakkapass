import { useEffect, useState } from 'react';
import '../../styles/SubsciptionPage.css';
import studentService from '../../services/student.service';
import { useLoading } from '../../contexts/LoadingContext';

const SubscriptionPage = () => {
  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchAllSubscriptions = async () => {
      try {
        setLoading(true);
        const students = await studentService.getParentStudents();

        if (students.length === 0) {
          setSubscriptionsData([]);
          return;
        }

        const subscriptionPromises = students.map(async (student) => {
          try {
            const subData = await studentService.getSubscription(student.id);
            return {
              student,
              subscription: subData
            };
          } catch (err) {
            console.warn(`Could not fetch subscription for student ${student.id}, assuming no active plan.`);
            return {
              student,
              subscription: null
            };
          }
        });

        const results = await Promise.all(subscriptionPromises);
        setSubscriptionsData(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSubscriptions();
  }, [setLoading]);

  return (
    <div className="subscription-page">
      <div className="subscription-header">
        <div>
          <h2>Subscriptions</h2>
          <p>Manage your children's subscription details.</p>
        </div>
      </div>

      {subscriptionsData.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
          No subscriptions linked to your account.
        </div>
      ) : (
        subscriptionsData.map((data, index) => {
          const student = data.student;
          const subscription = data.subscription;

          // Free trial computation
          let trialEnd = null;
          let trialActive = false;
          let trialDaysLeft = 0;
          
          if (!subscription?.currentPlan) {
            const now = new Date();
            const trialStart = student.profile?.freeTrialStartDate ? new Date(student.profile.freeTrialStartDate) : new Date(student.createdAt);
            trialEnd = new Date(trialStart.getTime() + 14 * 24 * 60 * 60 * 1000);
            trialActive = now <= trialEnd;
            trialDaysLeft = trialActive ? Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)) : 0;
          }

          const planName = subscription?.currentPlan?.name || (trialActive ? 'Free Trial' : 'Expired Trial');
          const planStatus = subscription?.currentPlan?.status || (trialActive ? 'Active' : 'Expired');
          const planPrice = subscription?.currentPlan ? subscription.currentPlan.price : 0;
          const planDuration = subscription?.currentPlan ? subscription.currentPlan.durationDays : 14;
          const planStartDate = subscription?.currentPlan?.startDate || (student.profile?.freeTrialStartDate || student.createdAt);
          const planExpiryDate = subscription?.currentPlan?.expiryDate || trialEnd?.toISOString();
          const planDaysLeft = subscription?.currentPlan?.daysLeft ?? trialDaysLeft;

          return (
            <div key={student.id} style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: index < subscriptionsData.length - 1 ? '48px' : '0', borderBottom: index < subscriptionsData.length - 1 ? '1px dashed var(--color-border)' : 'none' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                {student.name}'s Subscription
              </h3>

              <div className="subscription-current-card">
                <div>
                  <h3>{planName}</h3>
                  <p>
                    ₹{planPrice} / {planDuration} Days
                  </p>
                </div>

                <span
                  className={`subscription-status ${
                    planStatus === 'Active' ? 'active' : 'expired'
                  }`}
                >
                  {planStatus}
                </span>
              </div>

              <div className="subscription-info-grid">
                <div className="subscription-info-card">
                  <span>Start Date</span>
                  <strong>
                    {planStartDate ? new Date(planStartDate).toLocaleDateString() : '-'}
                  </strong>
                </div>

                <div className="subscription-info-card">
                  <span>Expiry Date</span>
                  <strong>
                    {planExpiryDate ? new Date(planExpiryDate).toLocaleDateString() : '-'}
                  </strong>
                </div>

                <div className="subscription-info-card">
                  <span>Days Left</span>
                  <strong>{planDaysLeft} Days</strong>
                </div>

                <div className="subscription-info-card">
                  <span>Plan Amount</span>
                  <strong>₹{planPrice}</strong>
                </div>
              </div>

              <div className="subscription-card">
                <h3>Plan Features</h3>
                <div className="subscription-features">
                  {(subscription?.currentPlan?.features || []).map((feature) => (
                    <div key={feature} className="subscription-feature">
                      ✓ {feature}
                    </div>
                  ))}
                  {(!subscription?.currentPlan?.features || subscription.currentPlan.features.length === 0) && (
                    <div style={{ color: '#888' }}>No active features</div>
                  )}
                </div>
              </div>

              <div className="subscription-card">
                <h3>Subscription History</h3>
                <table className="subscription-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Plan</th>
                      <th>Purchased</th>
                      <th>Expiry</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(subscription?.history || []).map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.plan}</td>
                        <td>
                          {new Date(item.purchasedOn).toLocaleDateString()}
                        </td>
                        <td>
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </td>
                        <td>₹{item.amount}</td>
                        <td>
                          <span
                            className={`subscription-badge ${
                              item.status === 'Success'
                                ? 'active'
                                : 'expired'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!subscription?.history || subscription.history.length === 0) && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '16px', color: '#888' }}>
                          No subscription history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          );
        })
      )}
    </div>
  );
};

export default SubscriptionPage;