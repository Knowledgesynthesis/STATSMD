# StatsMD - Statistical Method Navigator

![StatsMD](https://img.shields.io/badge/StatsMD-v2.0-blue) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-blue)

**StatsMD** is a comprehensive, mobile-first educational platform designed to help clinicians, medical students, residents, fellows, and clinical researchers master statistical test selection, assumption validation, and clinical interpretation.

## 🎯 Mission

StatsMD addresses a critical challenge in medical research and evidence-based medicine: **choosing the right statistical test** and **interpreting results with clinical relevance**. This interactive tool provides complete guidance from test selection to interpretation.

## ✨ Core Features

### 📊 Test Selection Wizard
Interactive step-by-step flowchart that guides you through:
1. Identifying your outcome variable type (continuous, binary, categorical, ordinal, count, time-to-event)
2. Selecting your study design (RCT, cohort, case-control, cross-sectional, diagnostic accuracy, before-after, time series)
3. Defining your comparison structure (two groups, multiple groups, paired data, regression, correlation, proportions)
4. **Receiving personalized test recommendations** with detailed explanations, assumptions, and alternatives

**16 Statistical Tests Covered**: t-tests, ANOVA, Mann-Whitney U, Wilcoxon, Kruskal-Wallis, Chi-square, Fisher's exact, Linear/Logistic/Poisson/Cox regression, Kaplan-Meier, Pearson/Spearman correlation

### 🧠 Assumption Checker
- **Interactive assumption validation** for all statistical tests
- Mark assumptions as met or violated
- Get **instant remedies** when assumptions are violated
- View **alternative tests** based on violated assumptions
- Detailed explanations of:
  - How to check each assumption
  - Consequences of violations
  - Statistical remedies available

**6 Core Assumptions**: Normality, Homoscedasticity, Independence, Linearity, Proportional Hazards, No Multicollinearity

### 📈 Regression Playground
Comprehensive exploration of regression models:
- **Linear Regression** - Continuous outcomes
- **Logistic Regression** - Binary outcomes
- **Poisson Regression** - Count data
- **Cox Proportional Hazards** - Time-to-event
- **Multinomial Logistic** - Multiple unordered categories
- **Ordinal Logistic** - Ordered categories

Each model includes:
- Mathematical equations
- When to use guidelines
- Assumptions and diagnostics
- Output interpretation (coefficients, ORs, HRs, RRs)
- Clinical examples
- Pros and cons
- Interactive visualizations

### 📝 Interactive Case Library
**6 Realistic Clinical Scenarios** with:
- Detailed study descriptions
- Data characteristics
- Multiple-choice test selection
- Immediate feedback on correct/incorrect answers
- Comprehensive explanations for all options
- Key learning points
- Progressive difficulty

Practice scenarios include:
- Blood pressure RCT
- Pain score interventions
- Smoking and lung cancer association
- Hospital length of stay prediction
- ICU mortality risk
- Cancer survival analysis

### 🎓 Knowledge Assessment
**12 Evidence-Based Questions** covering:
- Test selection scenarios
- P-value interpretation
- Odds ratios vs relative risk
- Assumption violations
- Regression interpretation
- Multiple testing
- Confidence intervals
- Study design
- Data transformations

Features:
- Three difficulty levels (beginner, intermediate, advanced)
- Detailed explanations for every answer
- Progress tracking
- Session scoring
- Topical tags for focused review

### 📚 Statistical Glossary
**20+ Essential Terms** including:
- p-values
- Confidence intervals
- Effect sizes
- Odds ratios, Relative risk, Hazard ratios
- Type I & II errors
- Statistical power
- Sensitivity & Specificity
- Confounding
- Multiple testing
- Intention-to-treat

Each term includes:
- Clear definitions
- Clinical examples
- Related concepts
- Searchable and filterable interface

### 🌙 Additional Features
- **Dark Mode** - Default dark theme with toggle, persists across sessions
- **Mobile-First Design** - Fully responsive from phone to desktop
- **State Persistence** - Your progress and preferences are saved
- **Sticky Navigation** - Easy access to all modules
- **Educational Disclaimers** - Clear guidance on appropriate use

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript 5
- **Styling**: Tailwind CSS 4 with custom design tokens
- **State Management**: Zustand with localStorage persistence
- **Icons**: Lucide React
- **Build Tool**: Vite 7
- **Charts**: Recharts for data visualization
- **Type Safety**: Full TypeScript coverage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or later
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

### Deployment to Vercel

This project is optimized for Vercel deployment:

1. Push to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Vite and deploy
4. Done! Your app is live

## 📖 Usage Guide

### For Medical Students (MS2-MS4)
- Start with **Test Selection Wizard** to learn the decision-making framework
- Use **Glossary** to understand key statistical concepts
- Practice with **Interactive Cases** for hands-on learning
- Take **Assessments** to test your knowledge
- Revisit **Assumption Checker** when analyzing data

### For Residents & Fellows
- Use **Test Selector** for research projects and QI initiatives
- Validate your approach with **Assumption Checker**
- Explore **Regression Playground** for complex analyses
- Reference **Glossary** when reading literature
- Practice with **Cases** before journal clubs

### For Clinical Researchers
- Navigate complex designs with **Test Selector**
- Ensure validity with **Assumption Checker**
- Compare models in **Regression Playground**
- Use **Cases** for team training
- Reference all modules when writing methods sections

### For Biostatistics Educators
- Assign **Cases** as homework
- Use **Test Selector** for interactive lectures
- **Assessment** module for quizzes
- **Assumption Checker** for teaching diagnostics
- **Regression Playground** for model comparison lessons

## 🎓 Educational Philosophy

StatsMD is built on evidence-based learning principles:

1. **Conceptual Understanding** over rote memorization
2. **Clinical Relevance** in all examples and interpretations
3. **Active Learning** through interactive tools
4. **Immediate Feedback** for all exercises
5. **Spaced Repetition** through progressive complexity
6. **Metacognition** via explanations that explain the "why"

## ⚠️ Important Disclaimers

- **Educational Purpose Only**: StatsMD is designed for learning statistical concepts and methods
- **Not for Clinical Decisions**: This tool does not provide medical advice or clinical decision support
- **Synthetic Data Only**: All examples and cases use synthetic data
- **Consult Experts**: Always work with a qualified biostatistician for actual research projects
- **Verify Results**: Cross-check recommendations with standard references before publication

## 📊 Statistical Content Coverage

### Study Designs (7)
- Randomized Controlled Trials (RCT)
- Cohort Studies
- Case-Control Studies
- Cross-Sectional Studies
- Diagnostic Accuracy Studies
- Before-After Studies
- Time Series Studies

### Statistical Tests (16)
**Parametric**: Independent t-test, Paired t-test, One-way ANOVA, Linear Regression, Pearson's Correlation

**Non-Parametric**: Mann-Whitney U, Wilcoxon Signed-Rank, Kruskal-Wallis, Chi-Square, Fisher's Exact, Spearman's Correlation

**Regression**: Linear, Logistic, Poisson, Cox Proportional Hazards, Multinomial Logistic, Ordinal Logistic

**Survival**: Kaplan-Meier, Cox Regression

### Statistical Concepts (20+)
p-values, Confidence Intervals, Effect Sizes, Odds Ratios, Relative Risk, Hazard Ratios, Number Needed to Treat, Sensitivity, Specificity, PPV, NPV, Type I/II Errors, Power, Confounding, Multicollinearity, Interaction, Multiple Testing, Intent-to-Treat, and more

## 📁 Project Structure

```
STATSMD/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (Button, Card)
│   │   ├── layout/          # Navigation and layout
│   │   └── modules/         # Feature modules
│   │       ├── Home.tsx
│   │       ├── TestSelector.tsx
│   │       ├── AssumptionChecker.tsx
│   │       ├── RegressionPlayground.tsx
│   │       ├── CaseLibrary.tsx
│   │       ├── Assessment.tsx
│   │       └── Glossary.tsx
│   ├── data/
│   │   └── schemas/         # Data definitions
│   │       ├── statistical-tests.ts
│   │       ├── study-designs.ts
│   │       ├── assumptions.ts
│   │       ├── glossary.ts
│   │       ├── case-vignettes.ts
│   │       └── assessment-questions.ts
│   ├── stores/              # Zustand state management
│   │   └── useAppStore.ts
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   └── lib/                 # Utilities
│       └── utils.ts
├── public/                  # Static assets
└── dist/                    # Production build
```

## 🗺️ Development Roadmap

### ✅ Phase 1 - Core Platform (Completed)
- ✅ Test Selection Wizard
- ✅ Statistical Glossary
- ✅ Dark Mode Support
- ✅ Mobile-First Design
- ✅ Core Data Schemas

### ✅ Phase 2 - Interactive Learning (Completed)
- ✅ Assumption Checker Module
- ✅ Regression Playground
- ✅ Interactive Case Library (6 cases)
- ✅ Knowledge Assessment (12 questions)

### 🔮 Phase 3 - Advanced Features (Future)
- [ ] Additional case vignettes (20+ total)
- [ ] More assessment questions (50+ total)
- [ ] Sample size calculator
- [ ] Effect size calculator
- [ ] Power analysis tool
- [ ] Data visualization explorer
- [ ] Personalized learning paths
- [ ] Progress certificates

## 🤝 Contributing

Contributions are welcome! This is an educational project aimed at improving statistical literacy in medicine.

### Areas for Contribution
- Additional statistical tests and methods
- More clinical case scenarios
- Additional assessment questions
- Improved explanations and visualizations
- Bug fixes and performance improvements
- Accessibility enhancements
- Translations/localization

### Guidelines
- Ensure statistical accuracy (cite sources)
- Use clinically relevant examples
- Follow existing code patterns
- Add TypeScript types
- Update documentation
- Test thoroughly

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the need for better statistical education in clinical medicine
- Built following evidence-based instructional design principles
- Content draws on standard biostatistics textbooks and guidelines (CONSORT, STROBE, ICH E9)
- Special thanks to the medical education and biostatistics communities

## 🔗 Recommended Resources

### Essential Reading
- *Epidemiology* by Leon Gordis
- *Biostatistics: The Bare Essentials* by Norman & Streiner
- *Statistics in Medicine* by Colton
- *Designing Clinical Research* by Hulley et al.
- CONSORT Statement for RCT reporting
- STROBE Guidelines for observational studies

### Online Resources
- [StatQuest with Josh Starmer](https://statquest.org/)
- [Cochrane Training](https://training.cochrane.org/)
- [JASP Statistics](https://jasp-stats.org/)

---

**Built with ❤️ for medical education and evidence-based practice**

*Version 2.0.0 - November 2025*

**Star ⭐ this repo if you find it helpful!**
