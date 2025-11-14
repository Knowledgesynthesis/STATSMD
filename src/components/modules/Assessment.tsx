import React, { useState, useMemo } from 'react';
import { assessmentQuestions } from '../../data/schemas/assessment-questions';
import { useAppStore } from '../../stores/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle2, XCircle, Award, BarChart3, RotateCcw, ChevronRight } from 'lucide-react';

export const Assessment: React.FC = () => {
  const { userProgress, updateAssessmentScore } = useAppStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, boolean>>({});

  const filteredQuestions = useMemo(() => {
    if (selectedDifficulty === 'all') return assessmentQuestions;
    return assessmentQuestions.filter((q) => q.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const sessionScore = useMemo(() => {
    const answered = Object.keys(sessionAnswers).length;
    const correct = Object.values(sessionAnswers).filter(Boolean).length;
    return { answered, correct, percentage: answered > 0 ? (correct / answered) * 100 : 0 };
  }, [sessionAnswers]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionAnswers({});
  };

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = currentQuestion.options.find((o) => o.id === selectedAnswer)?.isCorrect || false;

    setSessionAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: isCorrect,
    }));

    setShowExplanation(true);

    // Update user progress
    const currentScore = userProgress.assessmentScores[currentQuestion.id] || 0;
    if (isCorrect && currentScore === 0) {
      updateAssessmentScore(currentQuestion.id, 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionAnswers({});
  };

  const isAnswerCorrect = useMemo(() => {
    if (!selectedAnswer || !currentQuestion) return false;
    return currentQuestion.options.find((o) => o.id === selectedAnswer)?.isCorrect || false;
  }, [selectedAnswer, currentQuestion]);

  if (!quizStarted) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Award className="h-8 w-8 text-primary" />
            Knowledge Assessment
          </h1>
          <p className="text-muted-foreground">
            Test your understanding of statistical concepts and test selection
          </p>
        </div>

        <div className="space-y-6">
          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {Object.values(userProgress.assessmentScores).filter((s) => s > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Questions Mastered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{assessmentQuestions.length}</div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round(
                      (Object.values(userProgress.assessmentScores).filter((s) => s > 0).length /
                        assessmentQuestions.length) *
                        100
                    )}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">Completion</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Difficulty Level</CardTitle>
              <CardDescription>Choose questions that match your learning level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-3">
                {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => {
                  const count =
                    difficulty === 'all'
                      ? assessmentQuestions.length
                      : assessmentQuestions.filter((q) => q.difficulty === difficulty).length;

                  return (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                      className="h-auto py-4"
                      onClick={() => setSelectedDifficulty(difficulty)}
                    >
                      <div className="text-center">
                        <div className="font-semibold capitalize">{difficulty}</div>
                        <div className="text-xs opacity-70">{count} questions</div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              <Button onClick={handleStartQuiz} className="w-full mt-6" size="lg">
                Start Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Information */}
          <Card className="border-blue-500/50 bg-blue-500/5">
            <CardHeader>
              <CardTitle>Assessment Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Read each question carefully before selecting an answer</p>
              <p>• Pay attention to keywords like "most appropriate," "always," "never"</p>
              <p>• Review the explanations even when you answer correctly</p>
              <p>• Use this as a learning tool, not just a test</p>
              <p>• Come back and retry questions you missed to reinforce learning</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Progress */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </h2>
          <p className="text-sm text-muted-foreground capitalize">
            Difficulty: {currentQuestion.difficulty}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRestart}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Restart
        </Button>
      </div>

      {/* Session Score */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-semibold">Session Score:</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {sessionScore.correct} / {sessionScore.answered} Correct
              </span>
              {sessionScore.answered > 0 && (
                <span className="text-sm font-semibold text-primary">
                  {Math.round(sessionScore.percentage)}%
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          {currentQuestion.scenario && (
            <CardDescription className="mt-3 p-4 bg-muted rounded-lg text-sm">
              <strong>Scenario:</strong> {currentQuestion.scenario}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <Button
                key={option.id}
                variant={
                  showExplanation
                    ? option.isCorrect
                      ? 'default'
                      : selectedAnswer === option.id
                      ? 'destructive'
                      : 'outline'
                    : selectedAnswer === option.id
                    ? 'default'
                    : 'outline'
                }
                className="w-full justify-start h-auto py-4 text-left"
                onClick={() => !showExplanation && handleAnswerSelect(option.id)}
                disabled={showExplanation}
              >
                <div className="flex items-start gap-3 flex-1">
                  <span className="font-bold">{option.id.toUpperCase()}.</span>
                  <span className="flex-1">{option.text}</span>
                  {showExplanation && option.isCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  )}
                  {showExplanation && !option.isCorrect && selectedAnswer === option.id && (
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  )}
                </div>
              </Button>
            ))}
          </div>

          {!showExplanation && selectedAnswer && (
            <Button onClick={handleSubmitAnswer} className="w-full mt-6">
              Submit Answer
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Explanation */}
      {showExplanation && (
        <Card
          className={`mb-6 border-2 ${
            isAnswerCorrect
              ? 'border-green-500 bg-green-500/5'
              : 'border-destructive bg-destructive/5'
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isAnswerCorrect ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-destructive" />
                  <span className="text-destructive">Incorrect</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {currentQuestion.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        {showExplanation && (
          <Button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === filteredQuestions.length - 1}
          >
            {currentQuestionIndex === filteredQuestions.length - 1 ? 'Finish' : 'Next Question'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Completion */}
      {showExplanation && currentQuestionIndex === filteredQuestions.length - 1 && (
        <Card className="mt-6 border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Assessment Complete!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You've completed this assessment. Your final score for this session:
            </p>
            <div className="text-3xl font-bold text-primary mb-4">
              {sessionScore.correct} / {sessionScore.answered} ({Math.round(sessionScore.percentage)}%)
            </div>
            <Button onClick={handleRestart} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Take Assessment Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
