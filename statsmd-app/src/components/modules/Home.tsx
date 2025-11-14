import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { FlaskConical, Brain, BookOpen, Target, TrendingUp, CheckCircle } from 'lucide-react';

export const Home: React.FC = () => {
  const { setCurrentView } = useAppStore();

  const features = [
    {
      icon: FlaskConical,
      title: 'Test Selection Wizard',
      description: 'Interactive flowchart guides you to the right statistical test based on your data and study design.',
      action: () => setCurrentView('test-selector'),
      color: 'text-blue-500',
    },
    {
      icon: Brain,
      title: 'Assumption Checker',
      description: 'Verify statistical assumptions and get alternatives when assumptions are violated.',
      action: () => setCurrentView('assumption-checker'),
      color: 'text-purple-500',
    },
    {
      icon: TrendingUp,
      title: 'Regression Playground',
      description: 'Explore different regression models and understand when to use each approach.',
      action: () => setCurrentView('regression-playground'),
      color: 'text-green-500',
    },
    {
      icon: Target,
      title: 'Interactive Cases',
      description: 'Practice with realistic clinical scenarios and master statistical decision-making.',
      action: () => setCurrentView('cases'),
      color: 'text-orange-500',
    },
    {
      icon: BookOpen,
      title: 'Statistical Glossary',
      description: 'Comprehensive reference for statistical terms, concepts, and interpretations.',
      action: () => setCurrentView('glossary'),
      color: 'text-pink-500',
    },
    {
      icon: CheckCircle,
      title: 'Knowledge Assessment',
      description: 'Test your understanding with evidence-based questions and detailed explanations.',
      action: () => setCurrentView('assessment'),
      color: 'text-teal-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Welcome to StatsMD
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Your interactive guide to statistical test selection, assumption checking, and clinical interpretation.
          Master the art of choosing and interpreting the right statistical methods for your research.
        </p>
      </div>

      {/* Value Proposition */}
      <Card className="mb-12 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Navigate Statistical Methods with Confidence</CardTitle>
          <CardDescription className="text-base">
            StatsMD helps clinicians and researchers at all levels:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-3 text-sm">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Select the correct statistical test for your study design and data type</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Validate statistical assumptions and find alternatives when needed</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Interpret results with clinical relevance, not just statistical significance</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Recognize common statistical misuse and avoid p-hacking pitfalls</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={feature.action}
            >
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`h-8 w-8 ${feature.color}`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" onClick={feature.action}>
                  Explore
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Educational Disclaimer */}
      <Card className="mt-12 border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="text-yellow-500 mr-2">⚠️</span>
            Educational Purpose Only
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            StatsMD is designed for educational purposes to teach statistical reasoning and test selection.
            This tool uses synthetic datasets and should not be used for making real clinical decisions.
            Always consult with a qualified biostatistician for actual research and clinical trial analyses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
