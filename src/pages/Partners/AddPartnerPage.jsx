import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PartnerStepper from '../../components/partners/PartnerStepper';
import PartnerForm from '../../components/partners/PartnerForm';
import ReferralPreview from '../../components/partners/ReferralPreview';
import { HiArrowLeft } from 'react-icons/hi';
import '../../styles/addPartner.css';
import toast from 'react-hot-toast';
import partnerService from '../../services/partner.service';
import { useStudentFilterOptions } from '../../hooks/useStudents';

const steps = ['Personal', 'Organization', 'Contact', 'Partnership', 'Discount', 'Referral'];

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

  partnerId: `${Math.floor(1000 + Math.random() * 9000)}`,

  joiningDate: new Date().toISOString().split('T')[0],

  status: 'Active',

  settlementCycle: 'Monthly',

  discountType: 'Percentage',

  discountValue: '',

  couponExpiry: '',

  couponStatus: true,

  gradeIds: [],
};

const AddPartnerPage = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: filterOptions } = useStudentFilterOptions();
  const [activeStep, setActiveStep] = useState(0);

  const [formData, setFormData] = useState(initialState);
  useEffect(() => {
    if (isEdit && id) {
      fetchPartner();
    }
  }, [isEdit, id]);
  const [stepError, setStepError] =
  useState('');
  const fetchPartner = async () => {
    try {
      const res = await partnerService.getById(id);

      const partner = res.partner;

      setFormData({
        firstName: partner.contactFirstName || '',

        lastName: partner.contactLastName || '',

        dob: partner.dateOfBirth || null,

        gender: partner.gender || '',

        profilePhoto: null,

        existingProfilePhoto: partner.profilePhoto || null,

        logo: partner.logo || null,

        organizationName: partner.organizationName || '',

        institutionType: partner.institutionType || '',

        registrationNumber: partner.institutionRegistrationNumber || '',

        website: partner.websiteUrl || '',

        description: partner.description || '',

        mobile: partner.mobile || '',

        email: partner.email || '',

        alternateMobile: partner.alternateMobile || '',

        alternateEmail: partner.alternateEmail || '',

        address1: partner.addressLine1 || '',

        city: partner.city || '',

        district: partner.district || '',

        state: partner.state || '',

        country: partner.country || 'India',

        pincode: partner.pincode || '',

        partnerId: partner.partnerId || '',

        joiningDate: partner.joiningDate || '',

        status: partner.status || 'Active',

        discountType: partner.discountType === 'Percentage Based' ? 'Percentage' : 'Fixed',

        discountValue: partner.discountValue || '',

        couponExpiry: partner.couponExpiryDate || null,

        couponStatus: partner.couponActive ?? true,

        gradeIds: partner.gradeIds || [],
      });
    } catch (err) {
      toast.error('Failed to load partner');
    }
  };
  const updateField = (
  field,
  value
) => {
  setStepError('');

  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};
  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.firstName) return false;
        break;

      case 1:
        if (!formData.organizationName) return false;
        break;

      case 2:
        if (!formData.mobile || !formData.email) return false;
        break;

      default:
        return true;
    }

    return true;
  };

  const nextStep = () => {
  if (!validateStep()) {
    setStepError(
      'Please fill all required fields before continuing.'
    );
    return;
  }

  setStepError('');
  setActiveStep(
    (prev) => prev + 1
  );
};

  const prevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        contactFirstName: formData.firstName,
        contactLastName: formData.lastName,
        dateOfBirth: formData.dob,
        gender: formData.gender,
        organizationName: formData.organizationName,
        institutionType: formData.institutionType,
        institutionRegistrationNumber: formData.registrationNumber,
        websiteUrl: formData.website,
        description: formData.description,
        mobile: formData.mobile,
        alternateMobile: formData.alternateMobile,
        email: formData.email,
        alternateEmail: formData.alternateEmail,
        addressLine1: formData.address1,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        status: formData.status,
        discountType: formData.discountType === 'Percentage' ? 'Percentage Based' : 'Fixed Amount',
        discountValue: Number(formData.discountValue),
        couponExpiryDate: formData.couponExpiry,
        couponActive: formData.couponStatus,
        logo: formData.logo || null,
        gradeIds: formData.gradeIds || [],
      };

      if (isEdit) {
        // PUT /partner/:id has no upload middleware, send JSON
        await partnerService.update(id, payload);
        toast.success('Partner updated successfully');
      } else {
        // POST /partner has uploadImage middleware, send FormData
        const multipartData = new FormData();
        Object.keys(payload).forEach((key) => {
          if (key === 'gradeIds') return;
          const val = payload[key];
          if (val !== undefined && val !== null) {
            multipartData.append(key, val);
          }
        });

        if (Array.isArray(payload.gradeIds)) {
          payload.gradeIds.forEach((id) => {
            multipartData.append('gradeIds', Number(id));
          });
        }

        if (formData.profilePhoto) {
          multipartData.append('profilePic', formData.profilePhoto);
        }

        if (formData.logoFile) {
          multipartData.append('logo', formData.logoFile);
        }

        await partnerService.create(multipartData);
        toast.success('Partner created successfully');
      }

      navigate('/partners');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save partner');
    }
  };

  return (
    <div className="add-partner-page">
      <div className="page-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <HiArrowLeft />
          <span>Back</span>
        </button>

        {/* <div>
    <p className="page-badge">
      Channel Partner
    </p>

    <h1>
      Create Partner
    </h1>

    <p>
      Configure partner profile,
      discounts and
      referral settings.
    </p>
  </div> */}
      </div>

      <PartnerStepper steps={steps} activeStep={activeStep} />

      <div className="partner-form-card">
        {stepError && (
  <div className="form-error">
    {stepError}
  </div>
)}
        {activeStep === steps.length - 1 ? (
          <ReferralPreview formData={formData} />
        ) : (
          <PartnerForm 
            step={activeStep} 
            formData={formData} 
            updateField={updateField} 
            grades={filterOptions?.grades || []}
          />
        )}

        <div className="form-actions">
          <button disabled={activeStep === 0} className="btn-secondary" onClick={prevStep}>
            Previous
          </button>

          {activeStep === steps.length - 1 ? (
            <button className="btn-primary" onClick={handleSubmit}>
              {isEdit ? 'Update Partner' : 'Create Partner'}
            </button>
          ) : (
            <button className="btn-primary" onClick={nextStep}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPartnerPage;
