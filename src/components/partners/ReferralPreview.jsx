const ReferralPreview = ({
  formData,
}) => {
  const referralCode = `PP${(
    formData.firstName
      ?.slice(0, 2) || 'PA'
  ).toUpperCase()}${
    formData.partnerId
  }`;

  const referralMessage = `Hi,

Use my referral code ${referralCode} and get exclusive benefits on PakkaPass subscriptions.

Download PakkaPass and use my code while purchasing your subscription.

Thank you!`;

  const copyCode = () => {
    navigator.clipboard.writeText(
      referralCode
    );
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(
      referralMessage
    );
  };

  return (
    <div className="referral-container">
      <div className="referral-card">
        <p>
          Generated Referral
          Code
        </p>

        <h1>
          {referralCode}
        </h1>

        <button
          className="btn-primary"
          onClick={
            copyCode
          }
        >
          Copy Code
        </button>
      </div>

      <div className="message-card">
        <h3>
          Referral Message
        </h3>

        <textarea
          value={
            referralMessage
          }
          readOnly
          rows="8"
        />

        <button
          className="btn-secondary"
          onClick={
            copyMessage
          }
        >
          Copy Message
        </button>
      </div>
    </div>
  );
};

export default ReferralPreview;