# StatsMD - Statistical Method Navigator

**StatsMD** is an interactive, mobile-first educational platform designed to help clinicians, medical students, residents, fellows, and clinical researchers master statistical test selection, assumption validation, and clinical interpretation.

## 🎯 Mission

StatsMD addresses a critical challenge in medical research and evidence-based medicine: **choosing the right statistical test** and **interpreting results with clinical relevance**. This tool provides:

- **Step-by-step guidance** for statistical test selection
- **Assumption checking** with alternatives when assumptions are violated
- **Clinical interpretation** frameworks that go beyond p-values
- **Interactive learning** with realistic case scenarios
- **Comprehensive glossary** of statistical concepts

## ✨ Features

### 📊 Test Selection Wizard
Interactive flowchart that guides you through:
1. Identifying your outcome variable type (continuous, binary, categorical, etc.)
2. Selecting your study design (RCT, cohort, case-control, etc.)
3. Defining your comparison structure (two groups, multiple groups, regression, etc.)
4. **Receiving personalized test recommendations** with detailed explanations

### 📚 Statistical Glossary
- **20+ essential statistical terms** with clear definitions
- Clinical examples for each concept
- Related terms for deeper understanding
- Searchable and filterable by category

### 🌙 Dark Mode Support
- Default dark mode for reduced eye strain
- Toggle between light and dark themes
- Persists across sessions

### 📱 Mobile-First Design
- Responsive layout optimized for all devices
- Touch-friendly interface
- Works seamlessly on phones, tablets, and desktops

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand with persistence
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Visualization**: Recharts (for future modules)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
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

## 📖 Usage Guide

### For Medical Students
- Start with the **Test Selection Wizard** to learn the decision-making process
- Use the **Glossary** to understand statistical terminology
- Practice with **Interactive Cases** to reinforce learning

### For Residents & Fellows
- Use **Test Selection** for your research projects and quality improvement initiatives
- Check **Assumptions** to validate your statistical approach
- Reference the **Glossary** when reading literature

### For Clinical Researchers
- Navigate complex study designs with the **Test Selector**
- Validate statistical assumptions before analysis
- Consult when choosing between alternative tests

## 🎓 Educational Philosophy

StatsMD is built on evidence-based teaching principles:

1. **Conceptual Understanding** over rote memorization
2. **Clinical Relevance** in all examples and interpretations
3. **Active Learning** through interactive tools
4. **Just-in-Time** learning with contextual help
5. **Spaced Repetition** through progressive cases

## ⚠️ Important Disclaimers

- **Educational Purpose Only**: StatsMD is designed for learning, not for making real clinical or research decisions
- **Synthetic Data**: All datasets and examples use synthetic data
- **Consult Experts**: Always work with a qualified biostatistician for actual research projects
- **Not Medical Advice**: This tool does not provide medical advice or clinical decision support

## 📊 Statistical Tests Covered

### Parametric Tests
- Independent t-test
- Paired t-test
- One-way ANOVA
- Linear Regression
- Pearson's Correlation

### Non-Parametric Tests
- Mann-Whitney U test
- Wilcoxon Signed-Rank test
- Kruskal-Wallis test
- Chi-Square test
- Fisher's Exact test
- Spearman's Correlation

### Regression Models
- Linear Regression
- Logistic Regression
- Poisson Regression
- Cox Proportional Hazards

### Survival Analysis
- Kaplan-Meier
- Cox Regression

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- ✅ Test Selection Wizard
- ✅ Statistical Glossary
- ✅ Dark Mode Support
- ✅ Mobile-First Design
- ✅ Core Data Schemas

### Phase 2 (Planned)
- [ ] Assumption Checker Module
- [ ] Regression Playground
- [ ] Interactive Case Library
- [ ] Knowledge Assessment/Quiz
- [ ] Offline Capability (Service Worker + IndexedDB)

### Phase 3 (Future)
- [ ] Data Visualization Examples
- [ ] Sample Size Calculator
- [ ] Effect Size Calculator
- [ ] Personalized Learning Paths

## 📁 Project Structure

```
statsmd-app/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/       # Layout components (Navigation, etc.)
│   │   └── modules/      # Feature modules (Home, TestSelector, etc.)
│   ├── data/
│   │   └── schemas/      # Data definitions and databases
│   ├── stores/           # Zustand state management
│   ├── types/            # TypeScript type definitions
│   ├── lib/              # Utility functions
│   └── App.tsx           # Main application component
├── public/               # Static assets
└── package.json
```

## 🤝 Contributing

Contributions are welcome! This is an educational project aimed at improving statistical literacy in medicine.

### Areas for Contribution
- Additional statistical tests and methods
- More clinical case scenarios
- Improved explanations and visualizations
- Bug fixes and performance improvements
- Accessibility enhancements

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by the need for better statistical education in medicine
- Built following evidence-based instructional design principles
- Draws on standard biostatistics textbooks and guidelines (CONSORT, STROBE, ICH E9)

## 🔗 Recommended Resources

### Reading
- *Epidemiology* by Leon Gordis
- *Biostatistics: The Bare Essentials* by Norman & Streiner
- *Statistics in Medicine* by Colton
- CONSORT Statement for RCT reporting
- STROBE Guidelines for observational studies

### Online Resources
- [StatQuest with Josh Starmer](https://statquest.org/)
- [Cochrane Training](https://training.cochrane.org/)

---

**Built for medical education and evidence-based practice**

*Version 1.0.0 - November 2025*
