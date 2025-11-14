import React, { useState } from 'react';
import { assumptions } from '../../data/schemas/assumptions';
import { statisticalTests } from '../../data/schemas/statistical-tests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import type { AssumptionType } from '../../types';

export const AssumptionChecker: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [expandedAssumption, setExpandedAssumption] = useState<string | null>(null);
  const [violatedAssumptions, setViolatedAssumptions] = useState<Set<AssumptionType>>(new Set());

  const selectedTestData = statisticalTests.find((t) => t.id === selectedTest);
  const relevantAssumptions = selectedTestData
    ? assumptions.filter((a) => selectedTestData.assumptions.includes(a.id))
    : [];

  const toggleAssumptionViolation = (assumptionId: AssumptionType) => {
    const newViolated = new Set(violatedAssumptions);
    if (newViolated.has(assumptionId)) {
      newViolated.delete(assumptionId);
    } else {
      newViolated.add(assumptionId);
    }
    setViolatedAssumptions(newViolated);
  };

  const getAlternativeTests = () => {
    if (!selectedTestData || violatedAssumptions.size === 0) return [];
    return selectedTestData.alternatives.map((altId) =>
      statisticalTests.find((t) => t.id === altId)
    ).filter(Boolean);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assumption Checker</h1>
        <p className="text-muted-foreground">
          Verify statistical assumptions and find alternatives when assumptions are violated
        </p>
      </div>

      {/* Test Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select a Statistical Test</CardTitle>
          <CardDescription>Choose the test you're planning to use</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {statisticalTests.map((test) => (
              <Button
                key={test.id}
                variant={selectedTest === test.id ? 'default' : 'outline'}
                className="h-auto py-3 justify-start"
                onClick={() => {
                  setSelectedTest(test.id);
                  setViolatedAssumptions(new Set());
                  setExpandedAssumption(null);
                }}
              >
                <div className="text-left">
                  <div className="font-semibold text-sm">{test.displayName}</div>
                  <div className="text-xs opacity-70">
                    {test.assumptions.length} assumption{test.assumptions.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assumptions Check */}
      {selectedTestData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test: {selectedTestData.displayName}</CardTitle>
              <CardDescription>
                Check each assumption below. Mark as violated if your data doesn't meet the requirement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {relevantAssumptions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <p className="text-lg font-semibold mb-2">No Specific Assumptions</p>
                  <p className="text-muted-foreground">
                    This test is assumption-free or very robust. However, always ensure your data is appropriate for the research question.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {relevantAssumptions.map((assumption) => {
                    const isViolated = violatedAssumptions.has(assumption.id);
                    const isExpanded = expandedAssumption === assumption.id;

                    return (
                      <Card
                        key={assumption.id}
                        className={`border-2 ${
                          isViolated
                            ? 'border-destructive bg-destructive/5'
                            : 'border-border'
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg flex items-center gap-2">
                                {isViolated ? (
                                  <XCircle className="h-5 w-5 text-destructive" />
                                ) : (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                )}
                                {assumption.name}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                {assumption.description}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant={isViolated ? 'destructive' : 'outline'}
                                onClick={() => toggleAssumptionViolation(assumption.id)}
                              >
                                {isViolated ? 'Violated' : 'Met'}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setExpandedAssumption(isExpanded ? null : assumption.id)
                                }
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        {isExpanded && (
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                                How to Check This Assumption
                              </h4>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                {assumption.howToCheck.map((method, idx) => (
                                  <li key={idx} className="text-muted-foreground">
                                    {method}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {isViolated && (
                              <>
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    What If Violated?
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {assumption.whatIfViolated}
                                  </p>
                                </div>

                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Remedies
                                  </h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm">
                                    {assumption.remedies.map((remedy, idx) => (
                                      <li key={idx} className="text-muted-foreground">
                                        {remedy}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alternative Tests */}
          {violatedAssumptions.size > 0 && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Recommended Alternatives
                </CardTitle>
                <CardDescription>
                  Based on the violated assumptions, consider these alternative tests:
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getAlternativeTests().length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No built-in alternatives available. Consider consulting a biostatistician for alternative approaches or remedies listed above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getAlternativeTests().map((altTest) => (
                      altTest && (
                        <Card key={altTest.id} className="bg-primary/5">
                          <CardHeader>
                            <CardTitle className="text-lg">{altTest.displayName}</CardTitle>
                            <CardDescription>
                              <span className="inline-block px-2 py-1 rounded text-xs bg-primary/10 text-primary mr-2 capitalize">
                                {altTest.category}
                              </span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-sm">
                              <span className="font-semibold">When to use: </span>
                              {altTest.interpretation.clinicalRelevance}
                            </p>
                            <div>
                              <span className="font-semibold text-sm">Assumptions: </span>
                              <span className="text-sm text-muted-foreground">
                                {altTest.assumptions.length === 0
                                  ? 'Minimal assumptions'
                                  : altTest.assumptions.join(', ')}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {relevantAssumptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-semibold">
                      {relevantAssumptions.length - violatedAssumptions.size} Met
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <span className="font-semibold">{violatedAssumptions.size} Violated</span>
                  </div>
                </div>
                {violatedAssumptions.size === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">
                    ✅ All assumptions are met. You can proceed with {selectedTestData.displayName}.
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    ⚠️ Some assumptions are violated. Review the remedies or consider the alternative tests suggested above.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Educational Content */}
      {!selectedTestData && (
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardHeader>
            <CardTitle>Why Check Assumptions?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Statistical tests are based on mathematical assumptions about your data. When these assumptions are violated, the results may be:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>Inaccurate p-values:</strong> Your conclusions about statistical significance may be wrong</li>
              <li><strong>Biased estimates:</strong> Effect sizes and confidence intervals may not reflect the true relationship</li>
              <li><strong>Increased errors:</strong> Higher risk of Type I (false positive) or Type II (false negative) errors</li>
            </ul>
            <p className="mt-4">
              <strong>Best Practice:</strong> Always check assumptions before interpreting results. If assumptions are violated, use remedies or alternative tests.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
