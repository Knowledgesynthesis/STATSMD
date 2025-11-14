import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { statisticalTests } from '../../data/schemas/statistical-tests';
import { studyDesigns } from '../../data/schemas/study-designs';
import type { VariableType, ComparisonType } from '../../types';
import { AlertCircle, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';

export const TestSelector: React.FC = () => {
  const {
    studyDesign,
    setStudyDesign,
    resetSelections,
  } = useAppStore();

  const [step, setStep] = useState(1);
  const [outcomeType, setOutcomeType] = useState<VariableType | null>(null);
  const [comparisonType, setComparisonType] = useState<ComparisonType | null>(null);

  // Find recommended tests based on selections
  const recommendedTests = useMemo(() => {
    if (!outcomeType || !studyDesign) return [];

    return statisticalTests.filter((test) => {
      const matchesOutcome = test.applicableTo.outcomeType.includes(outcomeType);
      const matchesDesign = test.applicableTo.studyDesigns.includes(studyDesign);
      const matchesComparison = comparisonType
        ? test.applicableTo.comparisonTypes.includes(comparisonType)
        : true;

      return matchesOutcome && matchesDesign && matchesComparison;
    });
  }, [outcomeType, studyDesign, comparisonType]);

  const handleReset = () => {
    setStep(1);
    setOutcomeType(null);
    setComparisonType(null);
    resetSelections();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Statistical Test Selector</h1>
        <p className="text-muted-foreground">
          Answer the questions below to find the right statistical test for your study
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step > s ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Outcome Type */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: What type is your outcome variable?</CardTitle>
            <CardDescription>
              The outcome is what you're measuring or predicting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { value: 'continuous', label: 'Continuous', description: 'e.g., blood pressure, age, BMI' },
              { value: 'binary', label: 'Binary', description: 'e.g., yes/no, diseased/healthy, died/survived' },
              { value: 'categorical', label: 'Categorical (3+ groups)', description: 'e.g., blood type, disease stage' },
              { value: 'ordinal', label: 'Ordinal', description: 'e.g., pain scale (1-10), Likert scale' },
              { value: 'count', label: 'Count', description: 'e.g., number of falls, hospital admissions' },
              { value: 'time-to-event', label: 'Time-to-Event', description: 'e.g., time to death, time to recurrence' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={outcomeType === option.value ? 'default' : 'outline'}
                className="w-full justify-start h-auto py-4"
                onClick={() => {
                  setOutcomeType(option.value as VariableType);
                }}
              >
                <div className="text-left">
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs opacity-80">{option.description}</div>
                </div>
              </Button>
            ))}
            <Button
              className="w-full mt-4"
              disabled={!outcomeType}
              onClick={() => setStep(2)}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Study Design */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: What is your study design?</CardTitle>
            <CardDescription>
              The type of study affects which tests are appropriate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {studyDesigns.map((design) => (
              <Button
                key={design.id}
                variant={studyDesign === design.id ? 'default' : 'outline'}
                className="w-full justify-start h-auto py-4"
                onClick={() => {
                  setStudyDesign(design.id);
                }}
              >
                <div className="text-left">
                  <div className="font-semibold">{design.name}</div>
                  <div className="text-xs opacity-80">{design.description}</div>
                </div>
              </Button>
            ))}
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                disabled={!studyDesign}
                onClick={() => setStep(3)}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Comparison Type */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: What are you comparing or modeling?</CardTitle>
            <CardDescription>
              This helps narrow down the appropriate test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { value: 'two-groups', label: 'Two Groups', description: 'Comparing means/proportions between 2 groups' },
              { value: 'multiple-groups', label: 'Multiple Groups (3+)', description: 'Comparing across 3 or more groups' },
              { value: 'paired', label: 'Paired Data', description: 'Before/after or matched pairs' },
              { value: 'regression', label: 'Prediction/Association', description: 'Modeling outcome with multiple predictors' },
              { value: 'correlation', label: 'Correlation', description: 'Relationship between two continuous variables' },
              { value: 'proportion', label: 'Proportions', description: 'Categorical outcome and exposure' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={comparisonType === option.value ? 'default' : 'outline'}
                className="w-full justify-start h-auto py-4"
                onClick={() => {
                  setComparisonType(option.value as ComparisonType);
                }}
              >
                <div className="text-left">
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs opacity-80">{option.description}</div>
                </div>
              </Button>
            ))}
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                className="flex-1"
                disabled={!comparisonType}
                onClick={() => setStep(4)}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                Recommended Statistical Tests
              </CardTitle>
              <CardDescription>
                Based on your selections: {outcomeType} outcome, {studyDesign} design, {comparisonType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendedTests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tests match your criteria. Try adjusting your selections.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedTests.map((test) => (
                    <Card key={test.id} className="border-2">
                      <CardHeader>
                        <CardTitle className="text-lg">{test.displayName}</CardTitle>
                        <CardDescription>
                          <span className="inline-block px-2 py-1 rounded text-xs bg-primary/10 text-primary mr-2">
                            {test.category}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">When to use:</h4>
                          <p className="text-sm text-muted-foreground">
                            {test.interpretation.clinicalRelevance}
                          </p>
                        </div>

                        {test.assumptions.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Key Assumptions:</h4>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {test.assumptions.map((assumption) => (
                                <li key={assumption}>{assumption}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {test.alternatives.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Alternatives if assumptions violated:</h4>
                            <p className="text-sm text-muted-foreground">
                              {test.alternatives.map(altId => {
                                const altTest = statisticalTests.find(t => t.id === altId);
                                return altTest?.displayName;
                              }).join(', ')}
                            </p>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold text-sm mb-1">Output Metrics:</h4>
                          <div className="flex flex-wrap gap-2">
                            {test.interpretation.outputMetrics.map((metric) => (
                              <span
                                key={metric}
                                className="px-2 py-1 bg-muted text-xs rounded"
                              >
                                {metric}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex space-x-2 mt-6">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
