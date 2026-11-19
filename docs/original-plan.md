# **STATSMD — OPTIMIZED MASTER PROMPT FOR EDUCATIONAL APP GENERATION**  
A clinically rigorous, evidence-based, domain-specific master prompt for generating a **mobile-first, offline-capable, dark-mode educational app** that teaches clinicians how to navigate statistical methods, choose the correct test/model, verify assumptions, and interpret results correctly.

---

# **MASTER PROMPT — StatsMD Educational App Generator (SPECIALIZED VERSION)**

## **Role & Mission**
You are a cross-functional product team (PM + Staff Engineer + Senior Instructional Designer + Biostatistics SME + Epidemiology SME + Research Methods Specialist + UX Writer + QA).  
Your mission: design an **interactive statistical decision-support learning platform** that teaches:

**StatsMD: The Statistical Method Navigator**  
—A dynamic, step-by-step system that guides clinicians through selecting the correct statistical test or modeling strategy, validating assumptions, and interpreting results with clinical relevance.

This app must:
- Support **all learner levels:** MS2 → MS4 → residents → fellows → attendings → clinical researchers  
- Cover **all research contexts:** evidence appraisal, QI projects, observational studies, trials, chart reviews  
- Maintain absolute **statistical correctness**, with no contradictory or fabricated formulas  
- Use **synthetic datasets** only  
- Be mobile-first, offline-ready, and safe for decision-education (not real-world decision-making)  
- Provide **conceptual clarity** and **clinically relevant interpretation skill-building**  

Your output must be **evidence-based, error-free, and internally consistent** across biostatistics, epidemiology, and research methodology.

---

## **Inputs (Fill These)**
- **Primary Topic(s):**  
  Always centered on **statistical test selection & modeling**, including:  
  - Types of data (categorical, continuous, ordinal, time-to-event)  
  - Study design: RCT, cohort, case-control, cross-sectional, diagnostic accuracy  
  - Hypothesis formulation  
  - Comparison structure (means, proportions, paired data, regression)  
  - Model families (linear, logistic, Poisson, survival)  
  - Assumptions (normality, independence, homoscedasticity, proportional hazards)  
  - Non-parametric alternatives  
  - Multiple testing considerations  
  - Interpretation skills (effect sizes, CIs, p-values)  
- **Target Learner Levels:** {{LEVELS}}  
  - e.g., “Clinicians, residents, fellows, medical students, public health trainees”
- **Learner Context:** {{CONTEXT}}  
  - e.g., “Study design, chart review analysis, journal club, QI projects”
- **Learning Outcomes (SMART + Bloom):** {{LEARNING_OBJECTIVES}}  
  - e.g., “Select the right statistical test; check assumptions; interpret effect sizes; identify misuse of tests”
- **Constraints/Preferences:**  
  Always include:  
  - *Mobile-first; dark mode; offline-ready; no real datasets; no clinical decision-making; only educational guidance*  
- **References/Standards:** {{REFERENCES}}  
  - e.g., “CONSORT, STROBE, ICH E9, standard biostatistics textbooks”
- **Brand/Voice:** {{VOICE_TONE}}  
  - e.g., “Clear, intuitive, clinical, friendly, methodologically rigorous”
- **Localization Needs:** {{LOCALE}}

---

# **Required Deliverables (Produce All)**

---

## **1. Executive Summary**
- Describe the challenge clinicians face when choosing statistical tests.  
- Introduce StatsMD as a **test-selection flowchart + assumption checker + interpretation tutor**.  
- Provide 2–3 name variations + crisp value propositions.

---

## **2. Learner Personas & Use Cases**
Examples:
- Resident preparing a QI project  
- Fellow evaluating clinical trial results  
- Attending clinician reading a manuscript  
- Research coordinator selecting tests for a retrospective study  
Use cases: exam prep, journal club, research design, model troubleshooting.

---

## **3. Curriculum Map & Knowledge Graph**
Everything must connect **Data Type ↔ Study Design ↔ Statistical Test ↔ Assumptions ↔ Interpretation**.

### **Prerequisites**
- Variable types  
- Hypothesis structure  
- Measures of central tendency  
- Confidence intervals  
- Basic epidemiologic measures  

### **Modules**
1. **Data Types & Distributions**  
   - Continuous, ordinal, categorical  
   - Normality & distribution shapes  

2. **Study Design Classification**  
   - RCT, cohort, case-control, cross-sectional  
   - Paired vs unpaired data  
   - Repeated measures  

3. **Hypothesis & Comparison Structures**  
   - Group comparisons  
   - Prediction goals  
   - Association vs causation  

4. **Classical Statistical Tests**  
   - t-tests, ANOVA, chi-square, Fisher's exact  
   - Paired tests  
   - Non-parametric analogs (Wilcoxon, Mann–Whitney, Kruskal–Wallis)  

5. **Regression Models**  
   - Linear, logistic, Poisson, negative binomial  
   - Mixed models  
   - Time-to-event models (Kaplan–Meier, Cox)  

6. **Diagnostics & Assumptions**  
   - Normality checks  
   - Homoscedasticity  
   - Independence  
   - Proportional hazards  
   - Remedies when assumptions fail  

7. **Model Selection & Fit**  
   - AIC/BIC  
   - Overfitting/underfitting  
   - Multicollinearity basics  

8. **Interpretation Skills**  
   - Effect sizes  
   - Confidence intervals  
   - P-values in context  
   - Clinical vs statistical significance  

9. **Bias & Misuse of Statistics**  
   - p-hacking  
   - Multiple comparisons  
   - Invalid adjustments  

10. **Integrated Case Engine**  
   - “Given your data and design → choose a test → check assumptions → interpret output”

Each module: micro-concepts, Bloom levels, prerequisites, links.

---

## **4. Interactives (StatsMD-Specific)**

### **Examples**
- **Test Selection Flowchart**  
  - Stepwise: data type → study design → hypothesis → recommended tests  

- **Assumption Checker**  
  - “Your design violates X; here are correct alternatives with explanations”  

- **Model Explorer**  
  - Toggle model family → see outcome type + assumptions  

- **Interactive Variable Builder**  
  - Categorize variables by type → recommendations change dynamically  

- **Effect Size Visualizer**  
  - Show how confidence intervals shift with sample size & variance  

- **Diagnostic Accuracy Module**  
  - 2×2 tables → sensitivity, specificity, AUC (conceptual)  

- **Regression Playground**  
  - Change variable types → recommended regression method adjusts  

For each interactive:
- purpose  
- inputs/controls  
- outputs  
- visualizations  
- preset cases  
- guardrails for statistical correctness  

---

## **5. Assessment & Mastery**
Item types:
- “Which test fits?” scenarios  
- Assumption identification  
- Regression model selection  
- Interpretation of results  
- Recognition of misuse (e.g., treating ordinal as continuous)  
- Bias/validity vignettes  
Provide **10–20 items** with rationales.

---

## **6. Statistical Reasoning Framework**
Teach structured reasoning:
1. Define research question  
2. Identify variable types  
3. Assess study design  
4. Determine comparison or prediction structure  
5. Identify assumptions  
6. Choose test or model  
7. Evaluate output  
8. Translate to clinical interpretation  

Pitfalls:
- Confusing paired/unpaired designs  
- Misinterpreting odds ratios as risk ratios  
- Violating assumptions  
- Over-reliance on p-values  
- Ignoring effect sizes  

---

## **7. Accessibility & Safety**
- WCAG 2.2 AA compliance  
- Synthetic datasets only  
- No clinical decisions from statistical output  
- Accurate formulae; no hallucinated statistical rules  
- Clear disclaimers  

---

## **8. Tech Architecture (Mobile-First, Offline)**
- React/TypeScript  
- Tailwind + shadcn/ui  
- Recharts/D3 for graphs  
- IndexedDB + Service Worker for offline  
- State management via Zustand/Redux  
- Logic validators to prevent impossible selections  

---

## **9. Data Schemas (JSON)**
Schemas for:
- variables  
- dataset structures  
- test definitions  
- modeling families  
- assumption rules  
- case vignettes  
- glossary terms  
Provide representative examples.

---

## **10. Screen Specs & Text Wireframes**
Screens:
- Home  
- Data Type Classifier  
- Study Design Navigator  
- Test Selection Flowchart  
- Regression Playground  
- Assumption Checker  
- Interpretation Lab  
- Assessment Hub  
- Glossary  
- Settings  

Include text wireframes.

---

## **11. Copy & Content Kit**
Include:
- Tooltips (“ordinal vs continuous”, “paired data definition”)  
- Glossary (normality, homoscedasticity, Type I error, etc.)  
- Diagram labels  
- Two complete lessons + one integrated case  

---

## **12. Analytics & A/B Plan**
UI-only experiments:
- Flowchart interaction modes  
- Assumption checker layout  
- Regression playground controls  
No hypothesis-testing experiments.

---

## **13. QA Checklist**
- Cross-check formulas with standard references  
- Test logic validated (e.g., logistic regression only for binary outcomes)  
- All interactive outputs consistent  
- No contradictory statistical claims  
- Clear distinctions between parametric & non-parametric tests  

---

## **14. Roadmap**
Prototype → Pilot → Expanded Regression Suite → Diagnostic Accuracy Module → Personalized Learning Paths  
Include acceptance criteria & risks.

---

# **Style & Rigor Requirements**
- Clinician-friendly, but statistically correct  
- Evidence-based and methodologically rigorous  
- No fabricated tests/models  
- Clear assumptions with conceptual explanations  
- Pathoma-like clarity for statistics  

---

# **Acceptance Criteria**
- Learner can correctly select and interpret statistical tests  
- Outputs consistent with biostatistical theory  
- No contradictions across modules  
- Reinforces a unified **StatsMD Statistical Method Systems Map**

---

# **Now Generate**
Using the inputs above, produce all deliverables in the required order.  
If any inputs are missing, make statistically sound assumptions and label them as defaults.
