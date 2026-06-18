import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft, HiOutlinePlus } from 'react-icons/hi';
import '../../styles/createEditPlan.css';

// Replace this with API data later
const mockPlans = [
  {
    id: '1',
    name: 'Class 10 Annual Plan',
    description: 'Complete access for Class 10 students.',
    price: '4999',
    duration: '365',
    status: 'Active',
    classes: ['10th'],
    boards: ['State'],
    branches: [],
    features: ['Full Video Access', 'PDF Notes Access'],
  },
  {
    id: '2',
    name: 'Class 11 MPC Premium Plan',
    description: 'Complete access for Class 11 and 12 MPC students.',
    price: '2999',
    duration: '180',
    status: 'Active',
    classes: ['11th', '12th'],
    boards: ['State'],
    branches: ['MPC'],
    features: ['Full Video Access', 'Question Papers Access', 'Learning Analytics'],
  },
];

const classOptions = ['10th', '11th', '12th'];

const boardOptions = ['State', 'CBSE', 'ICSE'];

const branchOptions = ['MPC', 'BiPC', 'MEC', 'CEC'];

const initialForm = {
  name: '',
  description: '',
  price: '',
  duration: '',
  status: 'Active',
  classes: [],
  boards: [],
  branches: [],
  features: [],
};

const CreateEditPlanPage = () => {
  const navigate = useNavigate();
  const { planId } = useParams();

  const isEdit = Boolean(planId);

  const [featureInput, setFeatureInput] = useState('');

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!isEdit) {
      setFormData(initialForm);
      return;
    }

    const selectedPlan = mockPlans.find((plan) => plan.id === planId);

    if (selectedPlan) {
      setFormData({
        name: selectedPlan.name,
        description: selectedPlan.description,
        price: selectedPlan.price,
        duration: selectedPlan.duration,
        status: selectedPlan.status,
        classes: selectedPlan.classes,
        boards: selectedPlan.boards,
        branches: selectedPlan.branches,
        features: selectedPlan.features,
      });
    }
  }, [planId, isEdit]);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSelection = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const addFeature = () => {
    const value = featureInput.trim();

    if (!value) return;

    if (formData.features.includes(value)) {
      setFeatureInput('');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, value],
    }));

    setFeatureInput('');
  };

  const removeFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((item) => item !== feature),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      console.log('Update Plan', formData);

      // PUT API
      // /plans/:planId
    } else {
      console.log('Create Plan', formData);

      // POST API
      // /plans
    }

    navigate('/admin/subscriptions/plans');
  };

  return (
    <div className="edit-plan-page">
      <div className="edit-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <HiArrowLeft />
          <span>Back</span>
        </button>

        {/* <div>
          <h1>{isEdit ? 'Edit Subscription Plan' : 'Create Subscription Plan'}</h1>

          <p>
            {isEdit
              ? 'Update pricing and academic mappings.'
              : 'Configure a new subscription plan.'}
          </p>
        </div> */}
      </div>

      <form className="edit-form" onSubmit={handleSubmit}>
        {/* Basic Information */}

        <div className="form-card">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label>Plan Name</label>

            <input
              type="text"
              placeholder="Enter plan name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="5"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>
        </div>

        {/* Academic Mapping */}

        <div className="form-card">
          <h3>Academic Mapping</h3>

          <div className="mapping-section">
            <label>Classes</label>

            <div className="options">
              {classOptions.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`option ${formData.classes.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleSelection('classes', item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <label>Boards</label>

            <div className="options">
              {boardOptions.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`option ${formData.boards.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleSelection('boards', item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <label>Branches</label>

            <div className="options">
              {branchOptions.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`option ${formData.branches.includes(item) ? 'selected' : ''}`}
                  onClick={() => toggleSelection('branches', item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}

        <div className="form-card">
          <h3>Pricing</h3>

          <div className="two-col">
            <div className="form-group">
              <label>Original Price</label>

              <input
                type="number"
                placeholder="Enter amount"
                value={formData.price}
                onChange={(e) => updateField('price', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (Days)</label>

              <input
                type="number"
                placeholder="Enter duration"
                value={formData.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Features */}

        <div className="form-card">
          <h3>Features</h3>

          <div className="feature-input">
            <input
              type="text"
              placeholder="Add feature"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
            />

            <button type="button" className="primary-btn" onClick={addFeature}>
              <HiOutlinePlus />
              Add
            </button>
          </div>

          {formData.features.length > 0 && (
            <div className="chips">
              {formData.features.map((feature) => (
                <div key={feature} className="chip">
                  {feature}

                  <button type="button" onClick={() => removeFeature(feature)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}

        <div className="form-card">
          <h3>Status</h3>

          <select value={formData.status} onChange={(e) => updateField('status', e.target.value)}>
            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Actions */}

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>

          <button type="submit" className="primary-btn">
            {isEdit ? 'Save Changes' : 'Create Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditPlanPage;
