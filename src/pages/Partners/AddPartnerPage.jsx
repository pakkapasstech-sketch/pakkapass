import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PartnerStepper from '../../components/partners/PartnerStepper';
import PartnerForm from '../../components/partners/PartnerForm';
import ReferralPreview from '../../components/partners/ReferralPreview';

import '../../styles/addPartner.css';

const steps = [
  'Personal',
  'Organization',
  'Contact',
  'Partnership',
  'Commission',
  'Discount',
  'Referral',
];

const initialState = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',

  profilePhoto: null,
  logo: null,

  organizationName: '',
  institutionType: '',
  registrationNumber: '',
  website: '',
  description: '',

  mobile: '',
  email: '',
  alternateMobile: '',
  alternateEmail: '',

  address1: '',
  city: '',
  district: '',
  state: '',
  country: 'India',
  pincode: '',

  partnerId: `PP${Math.floor(
    1000 + Math.random() * 9000
  )}`,

  joiningDate: new Date()
    .toISOString()
    .split('T')[0],

  status: 'Active',

  commissionType:
    'Percentage',

  commissionValue: '',

  settlementCycle:
    'Monthly',

  discountType:
    'Percentage',

  discountValue: '',

  maxDiscount: '',

  usageLimit: '',

  couponExpiry: '',

  couponStatus: true,
};

const AddPartnerPage = () => {
  const navigate =
    useNavigate();

  const [activeStep, setActiveStep] =
    useState(0);

  const [formData, setFormData] =
    useState(initialState);

  const updateField = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.firstName)
          return false;
        break;

      case 1:
        if (
          !formData.organizationName
        )
          return false;
        break;

      case 2:
        if (
          !formData.mobile ||
          !formData.email
        )
          return false;
        break;

      default:
        return true;
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) {
      alert(
        'Please fill all required fields'
      );
      return;
    }

    setActiveStep(
      (prev) => prev + 1
    );
  };

  const prevStep = () => {
    setActiveStep(
      (prev) => prev - 1
    );
  };

  const handleSubmit =
    async () => {
      try {
        console.log(
          formData
        );

        alert(
          'Partner Created Successfully'
        );

        navigate(
          '/partners'
        );
      } catch {
        alert(
          'Failed to create partner'
        );
      }
    };

  return (
    <div className="add-partner-page">
      <div className="page-header">
        <div>
          <p className="page-badge">
            Channel Partner
          </p>

          <h1>
            Create Partner
          </h1>

          <p>
            Configure
            partner profile,
            commissions,
            discounts and
            referral settings.
          </p>
        </div>
      </div>

      <PartnerStepper
        steps={steps}
        activeStep={
          activeStep
        }
      />

      <div className="partner-form-card">
        {activeStep ===
        steps.length - 1 ? (
          <ReferralPreview
            formData={
              formData
            }
          />
        ) : (
          <PartnerForm
            step={
              activeStep
            }
            formData={
              formData
            }
            updateField={
              updateField
            }
          />
        )}

        <div className="form-actions">
          <button
            disabled={
              activeStep ===
              0
            }
            className="btn-secondary"
            onClick={
              prevStep
            }
          >
            Previous
          </button>

          {activeStep ===
          steps.length -
            1 ? (
            <button
              className="btn-primary"
              onClick={
                handleSubmit
              }
            >
              Create Partner
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={
                nextStep
              }
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPartnerPage;