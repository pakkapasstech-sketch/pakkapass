const PartnerStepper = ({
  steps,
  activeStep,
}) => {
  return (
    <div className="partner-stepper">
      {steps.map(
        (step, index) => (
          <div
            key={step}
            className={`step-item ${
              activeStep >=
              index
                ? 'active'
                : ''
            }`}
          >
            <div className="step-circle">
              {index + 1}
            </div>

            <p>{step}</p>
          </div>
        )
      )}
    </div>
  );
};

export default PartnerStepper;