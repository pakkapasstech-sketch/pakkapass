const PartnerStepper = ({
  steps,
  activeStep,
}) => {
  return (
    <div className="partner-tabs">
      {steps.map((step, index) => (
        <button
          key={step}
          type="button"
          className={`partner-tab ${
            activeStep === index
              ? 'active'
              : activeStep > index
              ? 'completed'
              : ''
          }`}
        >
          {step}
        </button>
      ))}
    </div>
  );
};

export default PartnerStepper;