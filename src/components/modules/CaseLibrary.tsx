import React, { useState } from 'react';
import { caseVignettes } from '../../data/schemas/case-vignettes';
import { statisticalTests } from '../../data/schemas/statistical-tests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle2, XCircle, FileText, ChevronRight, RotateCcw } from 'lucide-react';

export const CaseLibrary: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentCase = caseVignettes.find((c) => c.id === selectedCase);

  const handleSelectCase = (caseId: string) => {
    setSelectedCase(caseId);
    setUserAnswer(null);
    setShowExplanation(false);
  };

  const handleSubmitAnswer = (testId: string) => {
    setUserAnswer(testId);
    setShowExplanation(true);
  };

  const handleReset = () => {
    setUserAnswer(null);
    setShowExplanation(false);
  };

  const isCorrect = userAnswer === currentCase?.correctTest;

  // Get all possible test options for this case
  const getPossibleTests = () => {
    if (!currentCase) return [];

    const allTestIds = [
      currentCase.correctTest,
      ...currentCase.incorrectTests.map((t) => t.testId),
    ];

    return statisticalTests
      .filter((test) => allTestIds.includes(test.id))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Interactive Case Library
        </h1>
        <p className="text-muted-foreground">
          Practice statistical test selection with realistic clinical scenarios
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Case Selection Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Clinical Cases</CardTitle>
              <CardDescription>Select a case to work through</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {caseVignettes.map((vignette, idx) => (
                  <Button
                    key={vignette.id}
                    variant={selectedCase === vignette.id ? 'default' : 'outline'}
                    className="w-full justify-start h-auto py-3"
                    onClick={() => handleSelectCase(vignette.id)}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-sm">Case {idx + 1}</div>
                      <div className="text-xs opacity-70 line-clamp-2">{vignette.title}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Case Content */}
        <div className="lg:col-span-2 space-y-6">
          {!currentCase ? (
            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardHeader>
                <CardTitle>Welcome to the Case Library</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Each case presents a realistic clinical research scenario. Your task is to:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-2">
                  <li>Read the scenario carefully</li>
                  <li>Identify the key features: outcome type, study design, comparison structure</li>
                  <li>Select the most appropriate statistical test</li>
                  <li>Review the explanation to understand why your answer is correct or incorrect</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-4">
                  <strong>Tip:</strong> Think through the statistical reasoning framework before selecting an answer.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Case Scenario */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{currentCase.title}</CardTitle>
                  <CardDescription>Clinical Research Scenario</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground">{currentCase.scenario}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Data Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Characteristics</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Outcome Variable</h4>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="font-medium text-sm">{currentCase.dataDescription.outcome.name}</p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        Type: {currentCase.dataDescription.outcome.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {currentCase.dataDescription.outcome.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Predictor Variable(s)</h4>
                    <div className="space-y-2">
                      {currentCase.dataDescription.predictors.map((predictor) => (
                        <div key={predictor.id} className="bg-muted rounded-lg p-3">
                          <p className="font-medium text-sm">{predictor.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            Type: {predictor.type}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Study Design</h4>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="font-medium text-sm uppercase">
                        {currentCase.dataDescription.studyDesign}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Sample Size</h4>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="font-medium text-sm">
                        n = {currentCase.dataDescription.sampleSize}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question */}
              {!showExplanation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Which statistical test would you use?</CardTitle>
                    <CardDescription>
                      Select the most appropriate test for this scenario
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {getPossibleTests().map((test) => (
                        <Button
                          key={test.id}
                          variant={userAnswer === test.id ? 'default' : 'outline'}
                          className="w-full justify-start h-auto py-4"
                          onClick={() => handleSubmitAnswer(test.id)}
                        >
                          <div className="text-left flex-1">
                            <div className="font-semibold">{test.displayName}</div>
                            <div className="text-xs opacity-70 capitalize">{test.category}</div>
                          </div>
                          <ChevronRight className="h-5 w-5 ml-2" />
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Result & Explanation */}
              {showExplanation && (
                <>
                  <Card
                    className={`border-2 ${
                      isCorrect
                        ? 'border-green-500 bg-green-500/5'
                        : 'border-destructive bg-destructive/5'
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">
                              Correct!
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-6 w-6 text-destructive" />
                            <span className="text-destructive">Not Quite</span>
                          </>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isCorrect ? (
                        <div>
                          <p className="text-sm text-muted-foreground mb-4">
                            You selected the correct test! Here's why it's appropriate:
                          </p>
                          <div className="bg-background rounded-lg p-4 border">
                            <p className="text-sm">{currentCase.interpretation}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Let's understand why this choice isn't optimal:
                          </p>
                          {currentCase.incorrectTests
                            .filter((t) => t.testId === userAnswer)
                            .map((incorrectTest) => (
                              <div
                                key={incorrectTest.testId}
                                className="bg-destructive/10 rounded-lg p-4 border border-destructive/20"
                              >
                                <p className="text-sm font-semibold mb-2">Why this is incorrect:</p>
                                <p className="text-sm text-muted-foreground">
                                  {incorrectTest.whyIncorrect}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Correct Answer */}
                  {!isCorrect && (
                    <Card className="border-2 border-green-500 bg-green-500/5">
                      <CardHeader>
                        <CardTitle className="text-green-600 dark:text-green-400">
                          The Correct Answer
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="font-semibold mb-2">
                            {
                              statisticalTests.find((t) => t.id === currentCase.correctTest)
                                ?.displayName
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {currentCase.interpretation}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Learning Points */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Learning Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2"></span>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">Outcome Type</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {currentCase.dataDescription.outcome.type} variable requires specific test families
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2"></span>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">Study Design</p>
                            <p className="text-sm text-muted-foreground uppercase">
                              {currentCase.dataDescription.studyDesign} design influences test choice and interpretation
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2"></span>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">Always Check Assumptions</p>
                            <p className="text-sm text-muted-foreground">
                              Before using any test, verify its assumptions are met or consider alternatives
                            </p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Try Again
                    </Button>
                    <Button
                      onClick={() => {
                        const currentIdx = caseVignettes.findIndex((c) => c.id === selectedCase);
                        const nextIdx = (currentIdx + 1) % caseVignettes.length;
                        handleSelectCase(caseVignettes[nextIdx].id);
                      }}
                      className="flex items-center gap-2"
                    >
                      Next Case
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
