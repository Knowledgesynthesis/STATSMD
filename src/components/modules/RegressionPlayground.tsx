import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import type { VariableType } from '../../types';

interface RegressionModel {
  id: string;
  name: string;
  outcomeType: VariableType;
  description: string;
  equation: string;
  whenToUse: string;
  assumptions: string[];
  outputInterpretation: string;
  example: string;
  pros: string[];
  cons: string[];
}

const regressionModels: RegressionModel[] = [
  {
    id: 'linear',
    name: 'Linear Regression',
    outcomeType: 'continuous',
    description: 'Models a continuous outcome as a linear function of one or more predictors',
    equation: 'Y = β₀ + β₁X₁ + β₂X₂ + ... + ε',
    whenToUse: 'When your outcome is continuous (e.g., blood pressure, BMI, lab values) and you want to model it as a function of predictors',
    assumptions: [
      'Linearity: Relationship between predictors and outcome is linear',
      'Independence: Observations are independent',
      'Homoscedasticity: Constant variance of residuals',
      'Normality: Residuals are normally distributed',
      'No multicollinearity: Predictors are not highly correlated',
    ],
    outputInterpretation: 'Coefficients (β) represent the change in outcome for a 1-unit increase in the predictor, holding other variables constant. R² indicates proportion of variance explained.',
    example: 'Predicting systolic blood pressure based on age, BMI, and sodium intake',
    pros: [
      'Easy to interpret',
      'Can handle multiple continuous and categorical predictors',
      'Provides confidence intervals for predictions',
      'Well-understood and widely used',
    ],
    cons: [
      'Assumes linear relationships',
      'Sensitive to outliers',
      'Requires several assumptions to be met',
      'Cannot model non-continuous outcomes',
    ],
  },
  {
    id: 'logistic',
    name: 'Logistic Regression',
    outcomeType: 'binary',
    description: 'Models the probability of a binary outcome as a function of predictors',
    equation: 'log(p/(1-p)) = β₀ + β₁X₁ + β₂X₂ + ...',
    whenToUse: 'When your outcome is binary (yes/no, diseased/healthy, died/survived) and you want to model probability or odds',
    assumptions: [
      'Independence: Observations are independent',
      'Linearity in the logit: Linear relationship between predictors and log-odds',
      'No multicollinearity: Predictors not highly correlated',
      'Large sample size: Generally need at least 10-15 events per predictor',
    ],
    outputInterpretation: 'Exponentiated coefficients (eᵝ) are odds ratios (OR). OR > 1 means increased odds, OR < 1 means decreased odds. Note: OR ≠ Risk Ratio except when outcome is rare (<10%).',
    example: 'Modeling the probability of 30-day mortality based on age, severity score, and comorbidities',
    pros: [
      'Can model probability of binary outcomes',
      'Provides odds ratios for interpretation',
      'Can handle multiple predictors',
      'Robust to some assumption violations',
    ],
    cons: [
      'Odds ratios often misinterpreted as risk ratios',
      'Requires adequate sample size',
      'Assumes linearity in log-odds',
      'Cannot directly model count or continuous outcomes',
    ],
  },
  {
    id: 'poisson',
    name: 'Poisson Regression',
    outcomeType: 'count',
    description: 'Models count outcomes (events per unit time or space)',
    equation: 'log(λ) = β₀ + β₁X₁ + β₂X₂ + ...',
    whenToUse: 'When your outcome is a count (number of falls, hospitalizations, infections) and you want to model rates',
    assumptions: [
      'Independence: Observations are independent',
      'Mean equals variance: Poisson distribution assumes mean = variance',
      'Events are rare: Individual events have low probability',
      'Non-negative integers: Outcome is count data',
    ],
    outputInterpretation: 'Exponentiated coefficients (eᵝ) are rate ratios (RR). RR > 1 means increased rate, RR < 1 means decreased rate. Coefficients represent multiplicative effect on the rate.',
    example: 'Modeling the number of hospital readmissions per year based on patient characteristics',
    pros: [
      'Appropriate for count data',
      'Can model rates with offset terms',
      'Provides rate ratios',
      'Handles zeros naturally',
    ],
    cons: [
      'Assumes mean = variance (often violated)',
      'If overdispersed, use negative binomial instead',
      'Sensitive to model specification',
      'Requires understanding of rate vs count',
    ],
  },
  {
    id: 'cox',
    name: 'Cox Proportional Hazards',
    outcomeType: 'time-to-event',
    description: 'Models time-to-event data (survival analysis) with censoring',
    equation: 'h(t) = h₀(t) × exp(β₁X₁ + β₂X₂ + ...)',
    whenToUse: 'When your outcome is time until an event (death, recurrence, discharge) and you have censored observations',
    assumptions: [
      'Proportional hazards: Hazard ratio is constant over time',
      'Independence: Observations are independent',
      'Non-informative censoring: Censoring is unrelated to event probability',
    ],
    outputInterpretation: 'Exponentiated coefficients (eᵝ) are hazard ratios (HR). HR > 1 means increased hazard (faster event occurrence), HR < 1 means decreased hazard. Does not estimate baseline hazard.',
    example: 'Modeling time to death after cancer diagnosis based on stage, treatment, and patient characteristics',
    pros: [
      'Handles censored data appropriately',
      'Does not assume specific distribution for survival times',
      'Can handle time-varying covariates',
      'Widely used in clinical research',
    ],
    cons: [
      'Proportional hazards assumption may be violated',
      'Does not estimate absolute risk at specific times',
      'Interpretation can be challenging',
      'Requires adequate events for stability',
    ],
  },
  {
    id: 'multinomial',
    name: 'Multinomial Logistic Regression',
    outcomeType: 'categorical',
    description: 'Models categorical outcomes with 3+ unordered categories',
    equation: 'log(P(Y=k)/P(Y=reference)) = β₀ₖ + β₁ₖX₁ + β₂ₖX₂ + ...',
    whenToUse: 'When your outcome has 3+ categories with no inherent order (e.g., choice of treatment, disease subtype)',
    assumptions: [
      'Independence of irrelevant alternatives (IIA)',
      'Independence of observations',
      'No multicollinearity',
      'Large sample size relative to number of categories',
    ],
    outputInterpretation: 'Produces separate models for each outcome category vs a reference. Coefficients represent log odds ratios comparing each category to the reference.',
    example: 'Predicting choice of pain medication (opioid, NSAID, acetaminophen) based on pain severity and patient factors',
    pros: [
      'Can handle multiple unordered categories',
      'Provides comparisons across all categories',
      'Flexible for complex outcomes',
    ],
    cons: [
      'Requires large sample size',
      'Many parameters to estimate',
      'IIA assumption may be unrealistic',
      'Interpretation becomes complex with many categories',
    ],
  },
  {
    id: 'ordinal',
    name: 'Ordinal Logistic Regression',
    outcomeType: 'ordinal',
    description: 'Models ordered categorical outcomes (e.g., disease severity: mild < moderate < severe)',
    equation: 'logit(P(Y ≤ k)) = αₖ - (β₁X₁ + β₂X₂ + ...)',
    whenToUse: 'When your outcome has ordered categories (Likert scales, disease stages, functional scores)',
    assumptions: [
      'Proportional odds: Effect of predictors is same across all cutpoints',
      'Independence of observations',
      'Ordering is meaningful and consistent',
    ],
    outputInterpretation: 'Exponentiated coefficients are odds ratios for higher category (proportional odds model). Single OR applies across all cutpoints if proportional odds holds.',
    example: 'Modeling pain severity (none, mild, moderate, severe) based on treatment and patient characteristics',
    pros: [
      'Respects ordering of categories',
      'More efficient than multinomial when order exists',
      'Single coefficient per predictor',
      'Common in patient-reported outcomes',
    ],
    cons: [
      'Proportional odds assumption often violated',
      'Interpretation less intuitive than linear regression',
      'Alternative models (partial proportional odds) are complex',
    ],
  },
];

// Sample data for visualizations
const generateLinearData = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    x: i,
    y: 20 + 2.5 * i + (Math.random() - 0.5) * 20,
  }));
};

const generateLogisticData = () => {
  return Array.from({ length: 20 }, (_, i) => {
    const x = i;
    const prob = 1 / (1 + Math.exp(-(x - 10) / 2));
    return {
      x: x,
      probability: Math.min(1, Math.max(0, prob + (Math.random() - 0.5) * 0.2)),
    };
  });
};

const generateCountData = () => {
  return [
    { group: 'Control', count: 3.2 },
    { group: 'Treatment A', count: 1.8 },
    { group: 'Treatment B', count: 0.9 },
  ];
};

export const RegressionPlayground: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('linear');

  const currentModel = regressionModels.find((m) => m.id === selectedModel);

  const renderVisualization = () => {
    switch (selectedModel) {
      case 'linear':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={generateLinearData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" label={{ value: 'Predictor (X)', position: 'bottom' }} />
              <YAxis label={{ value: 'Outcome (Y)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Scatter name="Data Points" data={generateLinearData()} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'logistic':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateLogisticData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" label={{ value: 'Predictor Value', position: 'bottom' }} />
              <YAxis domain={[0, 1]} label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="monotone" dataKey="probability" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'poisson':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generateCountData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis label={{ value: 'Event Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
            <div className="text-center">
              <Activity className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">Visualization for this model</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          Regression Playground
        </h1>
        <p className="text-muted-foreground">
          Explore different regression models and understand when to use each approach
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Model Selection Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Regression Models</CardTitle>
              <CardDescription>Select a model to explore</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {regressionModels.map((model) => (
                  <Button
                    key={model.id}
                    variant={selectedModel === model.id ? 'default' : 'outline'}
                    className="w-full justify-start h-auto py-3"
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-sm">{model.name}</div>
                      <div className="text-xs opacity-70 capitalize">
                        {model.outcomeType} outcome
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Details */}
        <div className="lg:col-span-2 space-y-6">
          {currentModel && (
            <>
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{currentModel.name}</CardTitle>
                  <CardDescription className="text-base">
                    {currentModel.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Mathematical Form</h3>
                    <code className="text-sm font-mono">{currentModel.equation}</code>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">When to Use</h3>
                    <p className="text-sm text-muted-foreground">{currentModel.whenToUse}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Clinical Example</h3>
                    <p className="text-sm text-muted-foreground italic">"{currentModel.example}"</p>
                  </div>
                </CardContent>
              </Card>

              {/* Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Example Visualization
                  </CardTitle>
                  <CardDescription>
                    Conceptual illustration of the model
                  </CardDescription>
                </CardHeader>
                <CardContent>{renderVisualization()}</CardContent>
              </Card>

              {/* Assumptions */}
              <Card>
                <CardHeader>
                  <CardTitle>Assumptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentModel.assumptions.map((assumption, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2"></span>
                        <span className="text-sm text-muted-foreground">{assumption}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Interpretation */}
              <Card>
                <CardHeader>
                  <CardTitle>Output Interpretation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{currentModel.outputInterpretation}</p>
                </CardContent>
              </Card>

              {/* Pros and Cons */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-green-500/50 bg-green-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600 dark:text-green-400">
                      Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {currentModel.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span className="text-sm text-muted-foreground">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-yellow-500/50 bg-yellow-500/5">
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-600 dark:text-yellow-400">
                      Limitations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {currentModel.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-yellow-500 mt-0.5">!</span>
                          <span className="text-sm text-muted-foreground">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Comparison Hint */}
              <Card className="border-blue-500/50 bg-blue-500/5">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Decision Guide</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Outcome is continuous?</strong> → Linear Regression</p>
                  <p><strong>Outcome is binary (yes/no)?</strong> → Logistic Regression</p>
                  <p><strong>Outcome is a count?</strong> → Poisson (or Negative Binomial if overdispersed)</p>
                  <p><strong>Outcome is time-to-event?</strong> → Cox Regression</p>
                  <p><strong>Outcome is categorical (3+ unordered)?</strong> → Multinomial Logistic</p>
                  <p><strong>Outcome is ordinal (ordered categories)?</strong> → Ordinal Logistic</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
