import toast from 'react-hot-toast';
const ReferralPreview = ({
  formData,
}) => {
  const first =
  formData.firstName?.[0]?.toUpperCase() ||
  'X';

const last =
  formData.lastName?.[0]?.toUpperCase() ||
  'X';

const partner =
  String(formData.partnerId || '')
    .slice(-4);

const discount =
  String(formData.discountValue || '')
    .replace(/\D/g, '');

const referralCode =
  `${first}${last}${partner}${discount}`;

  const referralMessage = `Hi,

Use my referral code ${referralCode} and get exclusive benefits on PakkaPass subscriptions.

Download PakkaPass and use my code while purchasing your subscription.

Thank you!`;

  const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(
      referralCode
    );
    toast.success(
      'Referral code copied!'
    );
  } catch {
    toast.error(
      'Failed to copy referral code'
    );
  }
};

  const copyMessage = async () => {
  try {
    await navigator.clipboard.writeText(
      referralMessage
    );
    toast.success(
      'Referral message copied!'
    );
  } catch {
    toast.error(
      'Failed to copy referral message'
    );
  }
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