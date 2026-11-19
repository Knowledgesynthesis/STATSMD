import type { Reference } from './types';

const doi = (d: string) => `https://doi.org/${d}`;

/** Every claim in the course cites one of these. DOIs are checked against Crossref (scripts/check-references.mjs). */
export const references: Reference[] = [
  // ---- Reporting guidelines & regulatory ----
  { id: 'consort2025', short: 'CONSORT 2025', citation: 'Hopewell S, Chan AW, Collins GS, et al. CONSORT 2025 statement: updated guideline for reporting randomised trials. BMJ 2025;389:e081123.', url: doi('10.1136/bmj-2024-081123'), note: '30-item checklist; new open-science section. Replaces CONSORT 2010.' },
  { id: 'spirit2025', short: 'SPIRIT 2025', citation: 'Chan AW, Boutron I, Hopewell S, et al. SPIRIT 2025 statement: updated guideline for protocols of randomised trials. BMJ 2025;389:e081477.', url: doi('10.1136/bmj-2024-081477'), note: '34-item protocol checklist.' },
  { id: 'strobe2007', short: 'STROBE 2007', citation: 'von Elm E, Altman DG, Egger M, et al. The Strengthening the Reporting of Observational Studies in Epidemiology (STROBE) statement. Lancet 2007;370:1453-7.', url: doi('10.1016/S0140-6736(07)61602-X') },
  { id: 'target2025', short: 'TARGET 2025', citation: 'Cashin AG, Hansford HJ, Hernán MA, et al. Transparent reporting of observational studies emulating a target trial: the TARGET guideline. BMJ 2025;390:e087179 (also JAMA 2025;334:1084-93).', url: 'https://www.equator-network.org/reporting-guidelines/22462/', note: '21-item checklist for target trial emulations.' },
  { id: 'stard2015', short: 'STARD 2015', citation: 'Bossuyt PM, Reitsma JB, Bruns DE, et al. STARD 2015: an updated list of essential items for reporting diagnostic accuracy studies. BMJ 2015;351:h5527.', url: doi('10.1136/bmj.h5527') },
  { id: 'tripodai2024', short: 'TRIPOD+AI 2024', citation: 'Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement: updated guidance for reporting clinical prediction models that use regression or machine learning methods. BMJ 2024;385:e078378.', url: doi('10.1136/bmj-2023-078378') },
  { id: 'probastai2025', short: 'PROBAST+AI 2025', citation: 'Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI: an updated quality, risk of bias, and applicability assessment tool for prediction models using regression or artificial intelligence methods. BMJ 2025;388:e082505.', url: doi('10.1136/bmj-2024-082505') },
  { id: 'prisma2020', short: 'PRISMA 2020', citation: 'Page MJ, McKenzie JE, Bossuyt PM, et al. The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. BMJ 2021;372:n71.', url: doi('10.1136/bmj.n71') },
  { id: 'consortcluster2012', short: 'Campbell 2012', citation: 'Campbell MK, Piaggio G, Elbourne DR, Altman DG. CONSORT 2010 statement: extension to cluster randomised trials. BMJ 2012;345:e5661.', url: doi('10.1136/bmj.e5661') },
  { id: 'piaggio2012', short: 'Piaggio 2012', citation: 'Piaggio G, Elbourne DR, Pocock SJ, et al. Reporting of noninferiority and equivalence randomized trials: extension of the CONSORT 2010 statement. JAMA 2012;308:2594-604.', url: doi('10.1001/jama.2012.87802') },
  { id: 'iche9r1', short: 'ICH E9(R1)', citation: 'International Council for Harmonisation. E9(R1) Addendum on estimands and sensitivity analysis in clinical trials. Step 4, 20 November 2019.', url: 'https://www.ich.org/page/efficacy-guidelines' },
  { id: 'kahan2024', short: 'Kahan 2024', citation: 'Kahan BC, Hindley J, Edwards M, Cro S, Morris TP. The estimands framework: a primer on the ICH E9(R1) addendum. BMJ 2024;384:e076316.', url: doi('10.1136/bmj-2023-076316') },
  { id: 'fda2022', short: 'FDA 2022', citation: 'US Food and Drug Administration. Multiple Endpoints in Clinical Trials: Guidance for Industry. October 2022.', url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/multiple-endpoints-clinical-trials' },
  { id: 'cochrane2024', short: 'Cochrane Handbook 6.5', citation: 'Higgins JPT, Thomas J, Chandler J, et al (eds). Cochrane Handbook for Systematic Reviews of Interventions, version 6.5 (updated August 2024). Cochrane, 2024.', url: 'https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current' },

  // ---- p-values, CIs, inference ----
  { id: 'asa2016', short: 'ASA 2016', citation: "Wasserstein RL, Lazar NA. The ASA's statement on p-values: context, process, and purpose. Am Stat 2016;70:129-33.", url: doi('10.1080/00031305.2016.1154108'), note: 'Six principles for using and interpreting p-values.' },
  { id: 'asa2019', short: 'Wasserstein 2019', citation: 'Wasserstein RL, Schirm AL, Lazar NA. Moving to a world beyond "p < 0.05". Am Stat 2019;73(sup1):1-19.', url: doi('10.1080/00031305.2019.1583913') },
  { id: 'greenland2016', short: 'Greenland 2016', citation: 'Greenland S, Senn SJ, Rothman KJ, et al. Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations. Eur J Epidemiol 2016;31:337-50.', url: doi('10.1007/s10654-016-0149-3'), note: '25 common misinterpretations, each explained.' },
  { id: 'amrhein2019', short: 'Amrhein 2019', citation: 'Amrhein V, Greenland S, McShane B. Scientists rise up against statistical significance. Nature 2019;567:305-7.', url: doi('10.1038/d41586-019-00857-9') },
  { id: 'benjamin2018', short: 'Benjamin 2018', citation: 'Benjamin DJ, Berger JO, Johannesson M, et al. Redefine statistical significance. Nat Hum Behav 2018;2:6-10.', url: doi('10.1038/s41562-017-0189-z') },
  { id: 'sellke2001', short: 'Sellke 2001', citation: 'Sellke T, Bayarri MJ, Berger JO. Calibration of p values for testing precise null hypotheses. Am Stat 2001;55:62-71.', url: doi('10.1198/000313001300339950') },
  { id: 'rafi2020', short: 'Rafi 2020', citation: 'Rafi Z, Greenland S. Semantic and cognitive tools to aid statistical science: replace confidence and significance by compatibility and surprise. BMC Med Res Methodol 2020;20:244.', url: doi('10.1186/s12874-020-01105-9') },
  { id: 'cumming2014', short: 'Cumming 2014', citation: 'Cumming G. The new statistics: why and how. Psychol Sci 2014;25:7-29.', url: doi('10.1177/0956797613504966') },
  { id: 'cumming2005', short: 'Cumming 2005', citation: 'Cumming G, Finch S. Inference by eye: confidence intervals and how to read pictures of data. Am Psychol 2005;60:170-80.', url: doi('10.1037/0003-066X.60.2.170') },
  { id: 'altman1995', short: 'Altman 1995', citation: 'Altman DG, Bland JM. Absence of evidence is not evidence of absence. BMJ 1995;311:485.', url: doi('10.1136/bmj.311.7003.485') },
  { id: 'altman2005', short: 'Altman 2005', citation: 'Altman DG, Bland JM. Standard deviations and standard errors. BMJ 2005;331:903.', url: doi('10.1136/bmj.331.7521.903') },
  { id: 'gelman2006', short: 'Gelman 2006', citation: 'Gelman A, Stern H. The difference between "significant" and "not significant" is not itself statistically significant. Am Stat 2006;60:328-31.', url: doi('10.1198/000313006X152649') },
  { id: 'lakens2017', short: 'Lakens 2017', citation: 'Lakens D. Equivalence tests: a practical primer for t tests, correlations, and meta-analyses. Soc Psychol Personal Sci 2017;8:355-62.', url: doi('10.1177/1948550617697177') },
  { id: 'brown2001', short: 'Brown 2001', citation: 'Brown LD, Cai TT, DasGupta A. Interval estimation for a binomial proportion. Stat Sci 2001;16:101-33.', url: doi('10.1214/ss/1009213286') },
  { id: 'guenther1981', short: 'Guenther 1981', citation: 'Guenther WC. Sample size formulas for normal theory t tests. Am Stat 1981;35:243-4.', url: doi('10.1080/00031305.1981.10479363') },
  { id: 'cohen1988', short: 'Cohen 1988', citation: 'Cohen J. Statistical Power Analysis for the Behavioral Sciences. 2nd ed. Lawrence Erlbaum, 1988.' },

  // ---- Choosing tests, assumptions ----
  { id: 'delacre2017', short: 'Delacre 2017', citation: "Delacre M, Lakens D, Leys C. Why psychologists should by default use Welch's t-test instead of Student's t-test. Int Rev Soc Psychol 2017;30:92-101.", url: doi('10.5334/irsp.82') },
  { id: 'ruxton2006', short: 'Ruxton 2006', citation: "Ruxton GD. The unequal variance t-test is an underused alternative to Student's t-test and the Mann-Whitney U test. Behav Ecol 2006;17:688-90.", url: doi('10.1093/beheco/ark016') },
  { id: 'zimmerman2004', short: 'Zimmerman 2004', citation: 'Zimmerman DW. A note on preliminary tests of equality of variances. Br J Math Stat Psychol 2004;57:173-81.', url: doi('10.1348/000711004849222') },
  { id: 'rochon2012', short: 'Rochon 2012', citation: 'Rochon J, Gondan M, Kieser M. To test or not to test: preliminary assessment of normality when comparing two independent samples. BMC Med Res Methodol 2012;12:81.', url: doi('10.1186/1471-2288-12-81') },
  { id: 'lumley2002', short: 'Lumley 2002', citation: 'Lumley T, Diehr P, Emerson S, Chen L. The importance of the normality assumption in large public health data sets. Annu Rev Public Health 2002;23:151-69.', url: doi('10.1146/annurev.publhealth.23.100901.140546') },
  { id: 'fagerland2012', short: 'Fagerland 2012', citation: 'Fagerland MW. t-tests, non-parametric tests, and large studies—a paradox of statistical practice? BMC Med Res Methodol 2012;12:78.', url: doi('10.1186/1471-2288-12-78') },
  { id: 'hart2001', short: 'Hart 2001', citation: 'Hart A. Mann-Whitney test is not just a test of medians: differences in spread can be important. BMJ 2001;323:391-3.', url: doi('10.1136/bmj.323.7309.391') },
  { id: 'vickers2001', short: 'Vickers 2001', citation: 'Vickers AJ, Altman DG. Analysing controlled trials with baseline and follow up measurements. BMJ 2001;323:1123-4.', url: doi('10.1136/bmj.323.7321.1123') },
  { id: 'senn1994', short: 'Senn 1994', citation: 'Senn S. Testing for baseline balance in clinical trials. Stat Med 1994;13:1715-26.', url: doi('10.1002/sim.4780131703') },
  { id: 'altman2006', short: 'Altman 2006', citation: 'Altman DG, Royston P. The cost of dichotomising continuous variables. BMJ 2006;332:1080.', url: doi('10.1136/bmj.332.7549.1080') },
  { id: 'royston2006', short: 'Royston 2006', citation: 'Royston P, Altman DG, Sauerbrei W. Dichotomizing continuous predictors in multiple regression: a bad idea. Stat Med 2006;25:127-41.', url: doi('10.1002/sim.2331') },

  // ---- Categorical ----
  { id: 'campbell2007', short: 'Campbell 2007', citation: 'Campbell I. Chi-squared and Fisher-Irwin tests of two-by-two tables with small sample recommendations. Stat Med 2007;26:3661-75.', url: doi('10.1002/sim.2832') },
  { id: 'cochran1954', short: 'Cochran 1954', citation: 'Cochran WG. Some methods for strengthening the common χ² tests. Biometrics 1954;10:417-51.', url: doi('10.2307/3001616') },
  { id: 'agresti2013', short: 'Agresti 2013', citation: 'Agresti A. Categorical Data Analysis. 3rd ed. Wiley, 2013.' },
  { id: 'pearce2016', short: 'Pearce 2016', citation: 'Pearce N. Analysis of matched case-control studies. BMJ 2016;352:i969.', url: doi('10.1136/bmj.i969') },
  { id: 'altman1998', short: 'Altman 1998', citation: 'Altman DG. Confidence intervals for the number needed to treat. BMJ 1998;317:1309-12.', url: doi('10.1136/bmj.317.7168.1309') },
  { id: 'laupacis1988', short: 'Laupacis 1988', citation: 'Laupacis A, Sackett DL, Roberts RS. An assessment of clinically useful measures of the consequences of treatment. N Engl J Med 1988;318:1728-33.', url: doi('10.1056/NEJM198806303182605') },
  { id: 'zou2004', short: 'Zou 2004', citation: 'Zou G. A modified Poisson regression approach to prospective studies with binary data. Am J Epidemiol 2004;159:702-6.', url: doi('10.1093/aje/kwh090') },
  { id: 'newcombe1998', short: 'Newcombe 1998', citation: 'Newcombe RG. Interval estimation for the difference between independent proportions: comparison of eleven methods. Stat Med 1998;17:873-90.', url: 'https://pubmed.ncbi.nlm.nih.gov/9595617/' },

  // ---- Agreement ----
  { id: 'bland1986', short: 'Bland 1986', citation: 'Bland JM, Altman DG. Statistical methods for assessing agreement between two methods of clinical measurement. Lancet 1986;1:307-10.', url: doi('10.1016/S0140-6736(86)90837-8') },
  { id: 'koo2016', short: 'Koo 2016', citation: 'Koo TK, Li MY. A guideline of selecting and reporting intraclass correlation coefficients for reliability research. J Chiropr Med 2016;15:155-63.', url: doi('10.1016/j.jcm.2016.02.012') },
  { id: 'feinstein1990', short: 'Feinstein 1990', citation: 'Feinstein AR, Cicchetti DV. High agreement but low kappa: I. The problems of two paradoxes. J Clin Epidemiol 1990;43:543-9.', url: doi('10.1016/0895-4356(90)90158-L') },

  // ---- Regression & modelling ----
  { id: 'harrell2015', short: 'Harrell 2015', citation: 'Harrell FE Jr. Regression Modeling Strategies. 2nd ed. Springer, 2015.' },
  { id: 'hosmer2013', short: 'Hosmer 2013', citation: 'Hosmer DW, Lemeshow S, Sturdivant RX. Applied Logistic Regression. 3rd ed. Wiley, 2013.' },
  { id: 'peduzzi1996', short: 'Peduzzi 1996', citation: 'Peduzzi P, Concato J, Kemper E, Holford TR, Feinstein AR. A simulation study of the number of events per variable in logistic regression analysis. J Clin Epidemiol 1996;49:1373-9.', url: doi('10.1016/S0895-4356(96)00236-3') },
  { id: 'vittinghoff2007', short: 'Vittinghoff 2007', citation: 'Vittinghoff E, McCulloch CE. Relaxing the rule of ten events per variable in logistic and Cox regression. Am J Epidemiol 2007;165:710-8.', url: doi('10.1093/aje/kwk052') },
  { id: 'heinze2018', short: 'Heinze 2018', citation: 'Heinze G, Wallisch C, Dunkler D. Variable selection – a review and recommendations for the practicing statistician. Biom J 2018;60:431-49.', url: doi('10.1002/bimj.201700067') },
  { id: 'sun1996', short: 'Sun 1996', citation: 'Sun GW, Shook TL, Kay GL. Inappropriate use of bivariable analysis to screen risk factors for use in multivariable analysis. J Clin Epidemiol 1996;49:907-16.', url: doi('10.1016/0895-4356(96)00025-X') },
  { id: 'westreich2013', short: 'Westreich 2013', citation: 'Westreich D, Greenland S. The Table 2 fallacy: presenting and interpreting confounder and modifier coefficients. Am J Epidemiol 2013;177:292-8.', url: doi('10.1093/aje/kws412') },

  // ---- Correlated data & missing data ----
  { id: 'fitzmaurice2011', short: 'Fitzmaurice 2011', citation: 'Fitzmaurice GM, Laird NM, Ware JH. Applied Longitudinal Analysis. 2nd ed. Wiley, 2011.' },
  { id: 'matthews1990', short: 'Matthews 1990', citation: 'Matthews JN, Altman DG, Campbell MJ, Royston P. Analysis of serial measurements in medical research. BMJ 1990;300:230-5.', url: doi('10.1136/bmj.300.6719.230') },
  { id: 'killip2004', short: 'Killip 2004', citation: 'Killip S, Mahfoud Z, Pearce K. What is an intracluster correlation coefficient? Crucial concepts for primary care researchers. Ann Fam Med 2004;2:204-8.', url: doi('10.1370/afm.141') },
  { id: 'kahan2012', short: 'Kahan 2012', citation: 'Kahan BC, Morris TP. Improper analysis of trials randomised using stratified blocks or minimisation. Stat Med 2012;31:328-40.', url: doi('10.1002/sim.4431') },
  { id: 'rubin1976', short: 'Rubin 1976', citation: 'Rubin DB. Inference and missing data. Biometrika 1976;63:581-92.', url: doi('10.1093/biomet/63.3.581') },
  { id: 'sterne2009', short: 'Sterne 2009', citation: 'Sterne JAC, White IR, Carlin JB, et al. Multiple imputation for missing data in epidemiological and clinical research: potential and pitfalls. BMJ 2009;338:b2393.', url: doi('10.1136/bmj.b2393') },
  { id: 'little2012', short: 'Little 2012', citation: 'Little RJ, D’Agostino R, Cohen ML, et al. The prevention and treatment of missing data in clinical trials. N Engl J Med 2012;367:1355-60.', url: doi('10.1056/NEJMsr1203730') },

  // ---- Causal inference & bias ----
  { id: 'hernan2020', short: 'Hernán 2020', citation: 'Hernán MA, Robins JM. Causal Inference: What If. Chapman & Hall/CRC, 2020 (free online).', url: 'https://miguelhernan.org/whatifbook' },
  { id: 'greenland1999', short: 'Greenland 1999', citation: 'Greenland S, Pearl J, Robins JM. Causal diagrams for epidemiologic research. Epidemiology 1999;10:37-48.', url: doi('10.1097/00001648-199901000-00008') },
  { id: 'hernan2016', short: 'Hernán 2016', citation: 'Hernán MA, Robins JM. Using big data to emulate a target trial when a randomized trial is not available. Am J Epidemiol 2016;183:758-64.', url: doi('10.1093/aje/kwv254') },
  { id: 'cole2010', short: 'Cole 2010', citation: 'Cole SR, Platt RW, Schisterman EF, et al. Illustrating bias due to conditioning on a collider. Int J Epidemiol 2010;39:417-20.', url: doi('10.1093/ije/dyp334') },
  { id: 'suissa2008', short: 'Suissa 2008', citation: 'Suissa S. Immortal time bias in pharmaco-epidemiology. Am J Epidemiol 2008;167:492-9.', url: doi('10.1093/aje/kwm324') },
  { id: 'barnett2005', short: 'Barnett 2005', citation: 'Barnett AG, van der Pols JC, Dobson AJ. Regression to the mean: what it is and how to deal with it. Int J Epidemiol 2005;34:215-20.', url: doi('10.1093/ije/dyh299') },
  { id: 'vanderweele2017', short: 'VanderWeele 2017', citation: 'VanderWeele TJ, Ding P. Sensitivity analysis in observational research: introducing the E-value. Ann Intern Med 2017;167:268-74.', url: doi('10.7326/M16-2607') },
  { id: 'austin2011', short: 'Austin 2011', citation: 'Austin PC. An introduction to propensity score methods for reducing the effects of confounding in observational studies. Multivariate Behav Res 2011;46:399-424.', url: doi('10.1080/00273171.2011.568786') },

  // ---- Survival ----
  { id: 'kaplan1958', short: 'Kaplan 1958', citation: 'Kaplan EL, Meier P. Nonparametric estimation from incomplete observations. J Am Stat Assoc 1958;53:457-81.', url: doi('10.1080/01621459.1958.10501452') },
  { id: 'cox1972', short: 'Cox 1972', citation: 'Cox DR. Regression models and life-tables. J R Stat Soc B 1972;34:187-220.', url: doi('10.1111/j.2517-6161.1972.tb00899.x') },
  { id: 'grambsch1994', short: 'Grambsch 1994', citation: 'Grambsch PM, Therneau TM. Proportional hazards tests and diagnostics based on weighted residuals. Biometrika 1994;81:515-26.', url: doi('10.1093/biomet/81.3.515') },
  { id: 'hernan2010', short: 'Hernán 2010', citation: 'Hernán MA. The hazards of hazard ratios. Epidemiology 2010;21:13-5.', url: doi('10.1097/EDE.0b013e3181c1ea43') },
  { id: 'uno2014', short: 'Uno 2014', citation: 'Uno H, Claggett B, Tian L, et al. Moving beyond the hazard ratio in quantifying the between-group difference in survival analysis. J Clin Oncol 2014;32:2380-5.', url: doi('10.1200/JCO.2014.55.2208') },
  { id: 'royston2013', short: 'Royston 2013', citation: 'Royston P, Parmar MKB. Restricted mean survival time: an alternative to the hazard ratio for the design and analysis of randomized trials with a time-to-event outcome. BMC Med Res Methodol 2013;13:152.', url: doi('10.1186/1471-2288-13-152') },
  { id: 'austin2016', short: 'Austin 2016', citation: 'Austin PC, Lee DS, Fine JP. Introduction to the analysis of survival data in the presence of competing risks. Circulation 2016;133:601-9.', url: doi('10.1161/CIRCULATIONAHA.115.017719') },

  // ---- Diagnostic & prediction ----
  { id: 'deeks2004', short: 'Deeks 2004', citation: 'Deeks JJ, Altman DG. Diagnostic tests 4: likelihood ratios. BMJ 2004;329:168-9.', url: doi('10.1136/bmj.329.7458.168') },
  { id: 'pewsner2004', short: 'Pewsner 2004', citation: 'Pewsner D, Battaglia M, Minder C, et al. Ruling a diagnosis in or out with "SpPIn" and "SnNOut": a note of caution. BMJ 2004;329:209-13.', url: doi('10.1136/bmj.329.7459.209') },
  { id: 'whiting2011', short: 'Whiting 2011', citation: 'Whiting PF, Rutjes AWS, Westwood ME, et al. QUADAS-2: a revised tool for the quality assessment of diagnostic accuracy studies. Ann Intern Med 2011;155:529-36.', url: doi('10.7326/0003-4819-155-8-201110180-00009') },
  { id: 'vancalster2019', short: 'Van Calster 2019', citation: 'Van Calster B, McLernon DJ, van Smeden M, et al. Calibration: the Achilles heel of predictive analytics. BMC Med 2019;17:230.', url: doi('10.1186/s12916-019-1466-7') },
  { id: 'vickers2006', short: 'Vickers 2006', citation: 'Vickers AJ, Elkin EB. Decision curve analysis: a novel method for evaluating prediction models. Med Decis Making 2006;26:565-74.', url: doi('10.1177/0272989X06295361') },
  { id: 'riley2020', short: 'Riley 2020', citation: 'Riley RD, Ensor J, Snell KIE, et al. Calculating the sample size required for developing a clinical prediction model. BMJ 2020;368:m441.', url: doi('10.1136/bmj.m441') },
  { id: 'vansmeden2019', short: 'van Smeden 2019', citation: 'van Smeden M, Moons KGM, de Groot JAH, et al. Sample size for binary logistic prediction models: beyond events per variable criteria. Stat Methods Med Res 2019;28:2455-74.', url: doi('10.1177/0962280218784726') },
  { id: 'collins2016', short: 'Collins 2016', citation: 'Collins GS, Ogundimu EO, Altman DG. Sample size considerations for the external validation of a multivariable prognostic model: a resampling study. Stat Med 2016;35:214-26.', url: doi('10.1002/sim.6787') },
  { id: 'steyerberg2019', short: 'Steyerberg 2019', citation: 'Steyerberg EW. Clinical Prediction Models: A Practical Approach to Development, Validation, and Updating. 2nd ed. Springer, 2019.' },

  // ---- Multiplicity & research integrity ----
  { id: 'benjamini1995', short: 'Benjamini 1995', citation: 'Benjamini Y, Hochberg Y. Controlling the false discovery rate: a practical and powerful approach to multiple testing. J R Stat Soc B 1995;57:289-300.', url: doi('10.1111/j.2517-6161.1995.tb02031.x') },
  { id: 'holm1979', short: 'Holm 1979', citation: 'Holm S. A simple sequentially rejective multiple test procedure. Scand J Stat 1979;6:65-70.', url: 'https://www.jstor.org/stable/4615733' },
  { id: 'bender2001', short: 'Bender 2001', citation: 'Bender R, Lange S. Adjusting for multiple testing—when and how? J Clin Epidemiol 2001;54:343-9.', url: doi('10.1016/S0895-4356(00)00314-0') },
  { id: 'rothman1990', short: 'Rothman 1990', citation: 'Rothman KJ. No adjustments are needed for multiple comparisons. Epidemiology 1990;1:43-6.', url: doi('10.1097/00001648-199001000-00010') },
  { id: 'simmons2011', short: 'Simmons 2011', citation: 'Simmons JP, Nelson LD, Simonsohn U. False-positive psychology: undisclosed flexibility in data collection and analysis allows presenting anything as significant. Psychol Sci 2011;22:1359-66.', url: doi('10.1177/0956797611417632') },
  { id: 'gelman2014', short: 'Gelman 2014', citation: 'Gelman A, Loken E. The statistical crisis in science. Am Sci 2014;102:460-5.', url: doi('10.1511/2014.111.460') },
  { id: 'ioannidis2005', short: 'Ioannidis 2005', citation: 'Ioannidis JPA. Why most published research findings are false. PLoS Med 2005;2:e124.', url: doi('10.1371/journal.pmed.0020124') },

  // ---- Meta-analysis ----
  { id: 'higgins2003', short: 'Higgins 2003', citation: 'Higgins JPT, Thompson SG, Deeks JJ, Altman DG. Measuring inconsistency in meta-analyses. BMJ 2003;327:557-60.', url: doi('10.1136/bmj.327.7414.557') },
  { id: 'inthout2016', short: 'IntHout 2016', citation: 'IntHout J, Ioannidis JPA, Rovers MM, Goeman JJ. Plea for routinely presenting prediction intervals in meta-analysis. BMJ Open 2016;6:e010247.', url: doi('10.1136/bmjopen-2015-010247') },
  { id: 'inthout2014', short: 'IntHout 2014', citation: 'IntHout J, Ioannidis JPA, Borm GF. The Hartung-Knapp-Sidik-Jonkman method for random effects meta-analysis is straightforward and considerably outperforms the standard DerSimonian-Laird method. BMC Med Res Methodol 2014;14:25.', url: doi('10.1186/1471-2288-14-25') },

  // ---- Added for curriculum ----
  { id: 'altman1996', short: 'Altman 1996', citation: 'Altman DG, Bland JM. Detecting skewness from summary information. BMJ 1996;313:1200.', url: doi('10.1136/bmj.313.7066.1200') },
  { id: 'hanley1983', short: 'Hanley 1983', citation: 'Hanley JA, Lippman-Hand A. If nothing goes wrong, is everything all right? Interpreting zero numerators. JAMA 1983;249:1743-5.', url: doi('10.1001/jama.1983.03330370053031') },
  { id: 'gelman2014b', short: 'Gelman 2014b', citation: 'Gelman A, Carlin J. Beyond power calculations: assessing type S (sign) and type M (magnitude) errors. Perspect Psychol Sci 2014;9:641-51.', url: doi('10.1177/1745691614551642') },
  { id: 'button2013', short: 'Button 2013', citation: 'Button KS, Ioannidis JPA, Mokrysz C, et al. Power failure: why small sample size undermines the reliability of neuroscience. Nat Rev Neurosci 2013;14:365-76.', url: doi('10.1038/nrn3475') },
  { id: 'hoenig2001', short: 'Hoenig 2001', citation: 'Hoenig JM, Heisey DM. The abuse of power: the pervasive fallacy of power calculations for data analysis. Am Stat 2001;55:19-24.', url: doi('10.1198/000313001300339897') },
  { id: 'anscombe1973', short: 'Anscombe 1973', citation: 'Anscombe FJ. Graphs in statistical analysis. Am Stat 1973;27:17-21.', url: doi('10.1080/00031305.1973.10478966') },
  { id: 'sterne2019', short: 'Sterne 2019', citation: 'Sterne JAC, Savović J, Page MJ, et al. RoB 2: a revised tool for assessing risk of bias in randomised trials. BMJ 2019;366:l4898.', url: doi('10.1136/bmj.l4898') },
  { id: 'sterne2016', short: 'Sterne 2016', citation: 'Sterne JAC, Hernán MA, Reeves BC, et al. ROBINS-I: a tool for assessing risk of bias in non-randomised studies of interventions. BMJ 2016;355:i4919.', url: doi('10.1136/bmj.i4919') },
  { id: 'guyatt2008', short: 'Guyatt 2008', citation: 'Guyatt GH, Oxman AD, Vist GE, et al. GRADE: an emerging consensus on rating quality of evidence and strength of recommendations. BMJ 2008;336:924-6.', url: doi('10.1136/bmj.39489.470347.AD') },
  { id: 'sun2010', short: 'Sun 2010', citation: 'Sun X, Briel M, Walter SD, Guyatt GH. Is a subgroup effect believable? Updating criteria to evaluate the credibility of subgroup analyses. BMJ 2010;340:c117.', url: doi('10.1136/bmj.c117') },
  { id: 'schandelmaier2020', short: 'Schandelmaier 2020', citation: 'Schandelmaier S, Briel M, Varadhan R, et al. Development of the Instrument to assess the Credibility of Effect Modification Analyses (ICEMAN) in randomized controlled trials and meta-analyses. CMAJ 2020;192:E901-6.', url: doi('10.1503/cmaj.200077') },

  // ---- Textbooks ----
  { id: 'kirkwood2003', short: 'Kirkwood 2003', citation: 'Kirkwood BR, Sterne JAC. Essential Medical Statistics. 2nd ed. Blackwell, 2003.' },
  { id: 'altman1991', short: 'Altman 1991', citation: 'Altman DG. Practical Statistics for Medical Research. Chapman & Hall, 1991.' },
];

export const referencesById: Record<string, Reference> = Object.fromEntries(references.map((r) => [r.id, r]));
