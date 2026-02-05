import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  label?: string;
  name?: string;
  id?: number;
  icon?: React.ReactNode;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepLabel = step.label || step.name || `Step ${index + 1}`;
          const stepIndex = step.id !== undefined ? step.id - 1 : index;
          const isComplete = stepIndex < currentStep - 1;
          const isCurrent = stepIndex === currentStep - 1;
          
          return (
            <div key={index} className="flex flex-1 items-center">
              <button
                onClick={() => onStepClick(step.id !== undefined ? step.id : index)}
                className={cn(
                  'flex flex-col items-center gap-2 transition-all duration-300',
                  isComplete || isCurrent ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 text-sm font-medium',
                    isComplete
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isCurrent
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-muted-foreground/30 bg-background text-muted-foreground'
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    step.id || index + 1
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block max-w-[60px] text-center truncate">
                  {stepLabel}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-1 transition-all duration-300',
                    isComplete ? 'bg-primary' : 'bg-muted-foreground/20'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
