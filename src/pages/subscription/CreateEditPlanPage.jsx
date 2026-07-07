import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft, HiOutlinePlus } from 'react-icons/hi';
import { useQuery } from '@tanstack/react-query';
import '../../styles/createEditPlan.css';
import { getPlanById, createPlan, updatePlan } from '../../services/SubscriptionServices';
import { contentService } from '../../services/content.service';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const initialForm = {
  name: '',
  // description: '',
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

  const {
    data: options = {
      grades: [],
      boards: [],
      branches: [],
      subjects: [],
    },
  } = useQuery({
    queryKey: ['content-options'],
    queryFn: async () => {
      const { data } = await api.get('/admin/content/options');
      return data;
    },
  });

  const { grades, boards, branches } = options;

  const filteredBoards = formData.classes.length > 0 
    ? boards.filter(b => formData.classes.includes(b.gradeId))
    : boards;

  const filteredBranches = branches.filter((branch) => {
    const matchClass = formData.classes.length === 0 || !branch.gradeId || formData.classes.includes(branch.gradeId);
    const matchBoard = formData.boards.length === 0 || !branch.boardId || formData.boards.includes(branch.boardId);
    return matchClass && matchBoard;
  });
  useEffect(() => {
    if (!isEdit) {
      setFormData(initialForm);
      return;
    }

    const loadPlan = async () => {
      try {
        const selectedPlan = await getPlanById(planId);

        setFormData({
          name: selectedPlan.name || '',
          price: selectedPlan.price || '',
          duration: selectedPlan.durationDays || '',
          status: selectedPlan.status || 'Active',
          classes: selectedPlan.gradeIds || [],
          boards: selectedPlan.boardIds || [],
          branches: selectedPlan.branchIds || [],
          features: selectedPlan.features || [],
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadPlan();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        durationDays: Number(formData.duration),
        gradeIds: formData.classes,
        boardIds: formData.boards.filter(id => filteredBoards.some(b => b.id === id)),
        branchIds: formData.branches.filter(id => filteredBranches.some(b => b.id === id)),
        features: formData.features,
        status: formData.status,
      };

      if (isEdit) {
        await updatePlan(planId, payload);
        toast.success('Plan updated successfully');
      } else {
        await createPlan(payload);
        toast.success('Plan created successfully');
      }

      navigate('/subscriptions');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save plan');
    }
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

          {/* <div className="form-group">
            <label>Description</label>

            <textarea
              rows="5"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div> */}
        </div>

        {/* Academic Mapping */}

        <div className="form-card">
          <h3>Academic Mapping</h3>

          <div className="mapping-section">
            <label>Classes</label>

            <div className="options">
              {grades.map((grade) => (
                <button
                  type="button"
                  key={grade.id}
                  className={`option ${formData.classes.includes(grade.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelection('classes', grade.id)}
                >
                  {grade.name}
                </button>
              ))}
            </div>

            <label>Boards</label>

            {formData.classes.length > 0 ? (
              formData.classes.map(classId => {
                const grade = grades.find(g => g.id === classId);
                const gradeBoards = boards.filter(b => b.gradeId === classId);
                
                if (gradeBoards.length === 0) return null;

                return (
                  <div key={`boards-${classId}`} style={{ marginBottom: '16px', marginLeft: '8px' }}>
                    <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '8px', fontWeight: '500' }}>{grade?.name} Boards</div>
                    <div className="options">
                      {gradeBoards.map((board) => (
                        <button
                          type="button"
                          key={board.id}
                          className={`option ${formData.boards.includes(board.id) ? 'selected' : ''}`}
                          onClick={() => toggleSelection('boards', board.id)}
                        >
                          {board.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="options">
                {boards.map((board) => (
                  <button
                    type="button"
                    key={board.id}
                    className={`option ${formData.boards.includes(board.id) ? 'selected' : ''}`}
                    onClick={() => toggleSelection('boards', board.id)}
                  >
                    {board.name}
                  </button>
                ))}
              </div>
            )}

            {filteredBranches.length > 0 && (
              <>
                <label>Branches</label>

                {formData.classes.length > 0 ? (
                  formData.classes.map(classId => {
                    const grade = grades.find(g => g.id === classId);
                    const gradeBranches = filteredBranches.filter(b => b.gradeId === classId);

                    if (gradeBranches.length === 0) return null;

                    return (
                      <div key={`branches-${classId}`} style={{ marginBottom: '16px', marginLeft: '8px' }}>
                        <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '8px', fontWeight: '500' }}>{grade?.name} Branches</div>
                        <div className="options">
                          {gradeBranches.map((branch) => (
                            <button
                              type="button"
                              key={branch.id}
                              className={`option ${formData.branches.includes(branch.id) ? 'selected' : ''}`}
                              onClick={() => toggleSelection('branches', branch.id)}
                            >
                              {branch.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="options">
                    {filteredBranches.map((branch) => (
                      <button
                        type="button"
                        key={branch.id}
                        className={`option ${formData.branches.includes(branch.id) ? 'selected' : ''}`}
                        onClick={() => toggleSelection('branches', branch.id)}
                      >
                        {branch.name}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
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
