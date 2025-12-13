interface StepIndicatorProps {
    currentStep: "upload" | "analyze" | "results";
  }
  
  export function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = ["upload", "analyze", "results"];
  
    return (
      <div className="flex items-center justify-center gap-4 text-base md:text-lg font-medium">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
  
          return (
            <div key={step} className="flex items-center gap-4">
              <span
                className={
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                }
              >
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </span>
  
              {index < steps.length - 1 && (
                <span className="text-muted-foreground select-none">→</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }
  