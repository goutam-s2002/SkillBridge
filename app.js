/**
 * SkillBridge AI - Application Engine
 * Handles State, Roadmaps, Resume Analysis, Job Matcher, and Interview Prep Simulator.
 */

// --- GLOBAL APPLICATION STATE ---
const STATE = {
    activeTab: 'dashboard',
    userProfile: {
        name: 'Kapil Sharma',
        role: 'Aspiring Developer',
        readinessScore: 50,
        completedSkills: ['htmlcss', 'basicjs', 'git'], // Initial completions
        resumeScore: 0,
        resumeAnalyzed: false,
        resumeText: '',
        appliedJobs: [] // Tracked job objects: { id, status }
    },
    currentSelectedNodeId: null,
    currentCareerPath: 'frontend',
    
    // Interview prep state
    interviewActive: false,
    interviewRole: 'frontend',
    interviewType: 'technical',
    interviewCurrentQ: 0,
    interviewAnswers: [], // { question, userAns, score, feedback }
    interviewQuestions: []
};

// --- DATA STRUCTURES ---

// Career Paths & Skill Nodes
const ROADMAP_DATA = {
    frontend: {
        title: "Frontend Web Developer",
        phases: [
            {
                name: "Phase 1: Web Foundations",
                nodes: [
                    {
                        id: "htmlcss",
                        name: "HTML & CSS Core",
                        tag: "Foundational",
                        difficulty: "Easy",
                        desc: "Learn document structure, semantics, styling elements, and modern layout layouts using Flexbox and Grid systems.",
                        resources: [
                            { name: "MDN Web Docs: Learn HTML", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML" },
                            { name: "CSS Tricks: Flexbox Guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" },
                            { name: "freeCodeCamp Responsive Web Design", url: "https://www.freecodecamp.org/learn/responsive-web-design/" }
                        ],
                        subtopics: ["HTML5 Semantic Tags", "CSS Selectors & Specificity", "CSS Flexbox & Grid layouts", "Box Model & Positioning"]
                    },
                    {
                        id: "basicjs",
                        name: "Basic JavaScript",
                        tag: "Programming",
                        difficulty: "Easy",
                        desc: "Master variables, loops, conditionals, functions, arrays, objects, and foundational DOM manipulation.",
                        resources: [
                            { name: "JavaScript.info - Fundamentals", url: "https://javascript.info/" },
                            { name: "MDN: JavaScript First Steps", url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript" }
                        ],
                        subtopics: ["Variables, Data Types & Operators", "Control Flow & Loops", "Functions & Scope", "DOM Selection & Event Handling"]
                    },
                    {
                        id: "git",
                        name: "Git & Version Control",
                        tag: "Developer Tools",
                        difficulty: "Easy",
                        desc: "Track changes, collaborate with Git, manage branches, and sync codebases to cloud repositories like GitHub.",
                        resources: [
                            { name: "GitHub Git Guides", url: "https://github.com/git-guides" },
                            { name: "Git Immersion tutorial", url: "https://gitimmersion.com/" }
                        ],
                        subtopics: ["init, clone, add, commit commands", "Branching & Merge Conflicts", "Pull Requests & Collaborating", "GitHub Actions introduction"]
                    }
                ]
            },
            {
                name: "Phase 2: Intermediate Concepts",
                nodes: [
                    {
                        id: "responsive",
                        name: "Responsive & CSS Grid",
                        tag: "Layout Design",
                        difficulty: "Medium",
                        desc: "Optimize sites across mobile, tablet, and desktop views. Utilize CSS Media Queries, CSS variables, and fluid typography.",
                        resources: [
                            { name: "Learn CSS Grid Interactive", url: "https://cssgrid.io/" },
                            { name: "MDN: Responsive Web Design", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design" }
                        ],
                        subtopics: ["Media Queries & Breakpoints", "Mobile-First Design approach", "CSS Custom Properties (Variables)", "Aspect Ratios & Clamp typography"]
                    },
                    {
                        id: "es6",
                        name: "Advanced ES6+ JavaScript",
                        tag: "Programming",
                        difficulty: "Medium",
                        desc: "Write modular code using modern features: ES6 Modules, Destructuring, Promises, and asynchronous async/await pipelines.",
                        resources: [
                            { name: "ES6 Features Overview", url: "http://es6-features.org/" },
                            { name: "Async/Await Tutorial", url: "https://javascript.info/async-await" }
                        ],
                        subtopics: ["Array Methods (Map, Filter, Reduce)", "Promises & API Fetching", "Async/Await Error Handling", "ES6 Modules Import/Export"]
                    },
                    {
                        id: "reactbasics",
                        name: "React Basics",
                        tag: "UI Framework",
                        difficulty: "Medium",
                        desc: "Understand components, state, props, JSX syntax, and react lifecycle methods to construct reactive, dynamic views.",
                        resources: [
                            { name: "Official React Docs - Learn", url: "https://react.dev/learn" },
                            { name: "Scrimba: Learn React Free", url: "https://scrimba.com/learn/learnreact" }
                        ],
                        subtopics: ["Functional Components & JSX", "useState & useEffect Hooks", "Props Drilling & Event Bubbling", "Lists & Keys in Rendering"]
                    }
                ]
            },
            {
                name: "Phase 3: Advanced Frontend Mastery",
                nodes: [
                    {
                        id: "statemgmt",
                        name: "State Management",
                        tag: "Architecture",
                        difficulty: "Hard",
                        desc: "Organize state globally. Connect state stores across components using React Context API or state libraries like Redux Toolkit/Zustand.",
                        resources: [
                            { name: "Zustand Documentation", url: "https://zustand-demo.pmnd.rs/" },
                            { name: "Redux Toolkit Tutorial", url: "https://redux-toolkit.js.org/tutorials/quick-start" }
                        ],
                        subtopics: ["Prop-drilling problems", "React Context API", "Redux Reducers & Actions", "Zustand Store integration"]
                    },
                    {
                        id: "apiintegration",
                        name: "API Integration & Routing",
                        tag: "Network Logic",
                        difficulty: "Medium",
                        desc: "Connect frontend applications to backend APIs using Axios or fetch. Implement multi-page client-side routing via React Router.",
                        resources: [
                            { name: "React Router Quick Start", url: "https://reactrouter.com/" },
                            { name: "Axios Crash Course", url: "https://www.freecodecamp.org/news/how-to-use-axios-in-react/" }
                        ],
                        subtopics: ["Client-side Routing", "Axios Interceptors", "Loading & Error States", "CRUD operations integration"]
                    },
                    {
                        id: "testing",
                        name: "Testing Fundamentals",
                        tag: "QA & Testing",
                        difficulty: "Hard",
                        desc: "Safeguard codebase stability. Build Jest unit tests and component interactions using React Testing Library.",
                        resources: [
                            { name: "React Testing Library Guide", url: "https://testing-library.com/docs/react-testing-library/intro/" },
                            { name: "Jest Crash Course", url: "https://jestjs.io/" }
                        ],
                        subtopics: ["Unit Testing Concepts", "Mocking Functions & APIs", "RTL Selectors & FireEvent", "Integration Testing flows"]
                    }
                ]
            }
        ]
    },
    datascience: {
        title: "Data Scientist",
        phases: [
            {
                name: "Phase 1: Foundations",
                nodes: [
                    {
                        id: "python",
                        name: "Python for Data Science",
                        tag: "Programming",
                        difficulty: "Easy",
                        desc: "Master Python fundamentals: variables, lists, dicts, file I/O, OOP, and data pipelines.",
                        resources: [
                            { name: "Python for Everybody", url: "https://www.py4e.com/" },
                            { name: "Kaggle Python Course", url: "https://www.kaggle.com/learn/python" }
                        ],
                        subtopics: ["Syntax & Basic Types", "List Comprehensions", "OOP in Python", "File Parsing & JSON handling"]
                    },
                    {
                        id: "sql",
                        name: "SQL & Databases",
                        tag: "Database",
                        difficulty: "Easy",
                        desc: "Query databases efficiently. Write SELECT queries, joins, aggregates, groupings, and data filter queries.",
                        resources: [
                            { name: "SelectStarSQL Interactive", url: "https://selectstarsql.com/" },
                            { name: "SQLBolt Tutorials", url: "https://sqlbolt.com/" }
                        ],
                        subtopics: ["Joins & Union Tables", "GROUP BY & HAVING Clauses", "Subqueries", "Database Indexes"]
                    }
                ]
            },
            {
                name: "Phase 2: Data Wrangling & Math",
                nodes: [
                    {
                        id: "pandas",
                        name: "Data Manipulation (Pandas)",
                        tag: "Data Analysis",
                        difficulty: "Medium",
                        desc: "Load, clean, merge, reshape, filter, and extract insights from raw CSV/Excel datasets using Pandas & NumPy.",
                        resources: [
                            { name: "Pandas User Guide", url: "https://pandas.pydata.org/docs/user_guide/index.html" },
                            { name: "Kaggle Pandas Tutorial", url: "https://www.kaggle.com/learn/pandas" }
                        ],
                        subtopics: ["DataFrames & Series basics", "Handling Missing Data", "Merge, Join & Concatenate", "GroupBy & Pivot tables"]
                    },
                    {
                        id: "stats",
                        name: "Statistics & Math",
                        tag: "Mathematics",
                        difficulty: "Hard",
                        desc: "Study stats concepts required for modeling: probability distributions, hypothesis testing, linear algebra, and calculus.",
                        resources: [
                            { name: "Khan Academy Statistics", url: "https://www.khanacademy.org/math/statistics-probability" },
                            { name: "Practical Stats for Data Science", url: "https://github.com/gedeck/practical-statistics-for-data-scientists" }
                        ],
                        subtopics: ["Descriptive Statistics", "Hypothesis Testing & P-Values", "Matrix Operations & Eigenvectors", "Probability Distributions"]
                    },
                    {
                        id: "visualization",
                        name: "Data Visualization",
                        tag: "Presentation",
                        difficulty: "Medium",
                        desc: "Tell visual stories with data. Create interactive graphs, scatter plots, and maps using Matplotlib, Seaborn, and Plotly.",
                        resources: [
                            { name: "Seaborn Gallery Examples", url: "https://seaborn.pydata.org/examples/index.html" },
                            { name: "Plotly Python Graphing Library", url: "https://plotly.com/python/" }
                        ],
                        subtopics: ["Matplotlib chart customizations", "Seaborn categorical plots", "Plotly dashboard creation", "Dashboard design principles"]
                    }
                ]
            },
            {
                name: "Phase 3: Machine Learning & Beyond",
                nodes: [
                    {
                        id: "mlalgos",
                        name: "Supervised ML Models",
                        tag: "Machine Learning",
                        difficulty: "Hard",
                        desc: "Implement core ML models (Linear/Logistic Regression, Decision Trees, Random Forests) using Scikit-Learn.",
                        resources: [
                            { name: "Scikit-Learn Tutorials", url: "https://scikit-learn.org/stable/tutorial/index.html" },
                            { name: "StatQuest Machine Learning Video Playlist", url: "https://youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF" }
                        ],
                        subtopics: ["Regression vs Classification", "Model Overfitting & Underfitting", "Cross-Validation & GridSearch", "Metrics (Precision, Recall, ROC)"]
                    },
                    {
                        id: "dlbasics",
                        name: "Deep Learning (TensorFlow)",
                        tag: "Deep Learning",
                        difficulty: "Hard",
                        desc: "Design artificial neural networks. Learn backpropagation, activation functions, CNNs for images, and RNNs.",
                        resources: [
                            { name: "Fast.ai Practical Deep Learning", url: "https://course.fast.ai/" },
                            { name: "TensorFlow Tutorials", url: "https://www.tensorflow.org/tutorials" }
                        ],
                        subtopics: ["Perceptrons & Backpropagation", "Dense & CNN layer layers", "Optimizers (Adam, SGD)", "Overfitting mitigation (Dropout)"]
                    }
                ]
            }
        ]
    },
    productmanager: {
        title: "Product Manager",
        phases: [
            {
                name: "Phase 1: PM Core Principles",
                nodes: [
                    {
                        id: "pmfoundations",
                        name: "Product Foundations",
                        tag: "Product Theory",
                        difficulty: "Easy",
                        desc: "Understand what a Product Manager does: product lifecycle management, strategy, and cross-functional leadership.",
                        resources: [
                            { name: "Product School - Resources", url: "https://productschool.com/resources/" },
                            { name: "SVPG Insights blog", url: "https://www.svpg.com/articles/" }
                        ],
                        subtopics: ["Product Lifecycle (PLC)", "Difference between PM, PO, Project Manager", "UX vs Business vs Tech intersection", "Product Strategy basics"]
                    },
                    {
                        id: "userresearch",
                        name: "User Research & Personas",
                        tag: "User Experience",
                        difficulty: "Easy",
                        desc: "Gather customer insights. Construct user personas, write user interview plans, and run usability testing programs.",
                        resources: [
                            { name: "NN/g User Research Guides", url: "https://www.nngroup.com/articles/user-research-methods/" },
                            { name: "The Mom Test book summary", url: "https://www.youtube.com/watch?v=txX4Y4Bv_U8" }
                        ],
                        subtopics: ["Qualitative vs Quantitative research", "Creating User Persona profiles", "Empathy Mapping", "Usability test planning"]
                    }
                ]
            },
            {
                name: "Phase 2: Execution & Strategy",
                nodes: [
                    {
                        id: "scrumagile",
                        name: "Agile & Scrum Delivery",
                        tag: "Agile Management",
                        difficulty: "Medium",
                        desc: "Manage product backlogs, write detailed PRDs, write user stories, run sprint planning, and coordinate with engineering teams.",
                        resources: [
                            { name: "Atlassian Agile Coach Guide", url: "https://www.atlassian.com/agile" },
                            { name: "Scrum Alliance Resources", url: "https://www.scrumalliance.org/resources" }
                        ],
                        subtopics: ["Writing PRDs & User Stories", "Sprint planning & backlog grooming", "Estimation techniques (Story Points)", "Kanban vs Scrum methodologies"]
                    },
                    {
                        id: "pmmetrics",
                        name: "Product Analytics & Metrics",
                        tag: "Analytics",
                        difficulty: "Medium",
                        desc: "Measure product success. Track North Star metrics, cohort retention, conversion funnels, and customer acquisition costs.",
                        resources: [
                            { name: "Mixpanel Product Analytics Guide", url: "https://mixpanel.com/blog/" },
                            { name: "Amplitude Product Analytics Book", url: "https://amplitude.com/playbook" }
                        ],
                        subtopics: ["North Star Metric & KPIs", "HEART Framework (Google)", "Cohort Analysis & Retention", "Pirate Metrics (AARRR)"]
                    }
                ]
            },
            {
                name: "Phase 3: Launch & Testing",
                nodes: [
                    {
                        id: "abtesting",
                        name: "A/B Testing & Optimization",
                        tag: "Experimentation",
                        difficulty: "Hard",
                        desc: "Design scientific experiments. Formulate hypotheses, determine statistical significance, calculate sample size, and run A/B splits.",
                        resources: [
                            { name: "Optimizely A/B Testing Guide", url: "https://www.optimizely.com/optimization-glossary/ab-testing/" },
                            { name: "Evan Miller Sample Size Calculator", url: "https://www.evanmiller.org/ab-testing/sample-size.html" }
                        ],
                        subtopics: ["Hypothesis Formulation", "Control vs Variant groups", "Statistical Power & Significance", "Type I and Type II errors"]
                    }
                ]
            }
        ]
    }
};

// Job Database
const JOB_DATABASE = [
    {
        id: "job-1",
        title: "Junior React Developer",
        company: "Vercel Inc.",
        logo: "V",
        location: "Remote (Global)",
        salary: "$75k - $90k",
        track: "frontend",
        requiredSkills: ["htmlcss", "basicjs", "git", "responsive", "es6", "reactbasics"],
        desc: "We are seeking a developer with high attention to detail to help us implement beautiful interface pages for Vercel's cloud control deck."
    },
    {
        id: "job-2",
        title: "Frontend Engineer (Design System)",
        company: "Tailwind Labs",
        logo: "T",
        location: "Remote",
        salary: "$85k - $105k",
        track: "frontend",
        requiredSkills: ["htmlcss", "basicjs", "git", "responsive", "es6", "reactbasics", "statemgmt", "testing"],
        desc: "Help create modular CSS utilities and responsive component frameworks. Expertise in responsive layouts, component architectures, and clean code paradigms is required."
    },
    {
        id: "job-3",
        title: "Junior Data Analyst",
        company: "FinData Services",
        logo: "F",
        location: "Mumbai / Hybrid",
        salary: "₹6L - ₹8L",
        track: "datascience",
        requiredSkills: ["python", "sql", "pandas", "visualization"],
        desc: "Clean and analyze market datasets, assemble client dashboard visualizations, and deliver reports on financial trend findings."
    },
    {
        id: "job-4",
        title: "Associate Data Scientist",
        company: "Snowflake",
        logo: "S",
        location: "Bangalore",
        salary: "₹12L - ₹15L",
        track: "datascience",
        requiredSkills: ["python", "sql", "pandas", "stats", "mlalgos", "dlbasics"],
        desc: "Work on deploying predictive modeling pipelines inside our cloud databases. Experience cleaning noisy tables and training custom classifier networks is key."
    },
    {
        id: "job-5",
        title: "Product Manager Intern",
        company: "Airbnb",
        logo: "A",
        location: "San Francisco / Remote",
        salary: "$45/hr",
        track: "productmanager",
        requiredSkills: ["pmfoundations", "userresearch", "scrumagile"],
        desc: "Shadow product directors on host-experience teams, run customer discovery interviews, outline specifications, and document features."
    },
    {
        id: "job-6",
        title: "Associate Product Manager",
        company: "TechCorp Tech",
        logo: "TC",
        location: "Delhi NCR",
        salary: "₹8L - ₹11L",
        track: "productmanager",
        requiredSkills: ["pmfoundations", "userresearch", "scrumagile", "pmmetrics", "abtesting"],
        desc: "Own execution tracks for consumer mobile applications. Coordinate with tech leads, refine metrics, and launch A/B validation experiments."
    }
];

// Resume Optimization Suggestions
const RESUME_SUGGESTIONS = {
    frontend: [
        {
            category: "Action-Oriented Impact",
            before: "Worked on building user interfaces using React.",
            after: "Created and launched 12 reusable React components, decreasing page response latency by 28% and boosting mobile view interaction scores."
        },
        {
            category: "Keyword Maximization",
            before: "Responsible for making layouts look good on mobile views.",
            after: "Implemented mobile-first Responsive Web Design principles using CSS Flexbox, Grid systems, and custom media-query variables across 5 core dashboard routes."
        },
        {
            category: "Technical Specificity",
            before: "Did programming in JS and updated code on Git repository.",
            after: "Refined modular codebase modules utilizing modern ES6+ JS practices, managing version integrity and release branch structures via GitHub pipelines."
        }
    ],
    datascience: [
        {
            category: "Quantifiable Impact",
            before: "Wrote code to analyze client data tables using Pandas.",
            after: "Wrote automated Pandas sanitization pipelines that filtered out 1.2M erroneous rows, cutting pipeline prep run duration from 4 hours down to 20 minutes."
        },
        {
            category: "Database Engineering",
            before: "Retrieved information from server SQL tables.",
            after: "Engineered complex SQL query templates with index hooks and JOIN layers, boosting data analysis fetch speed by 40%."
        }
    ],
    productmanager: [
        {
            category: "Agile Leadership",
            before: "Wrote descriptions of features for developers to build.",
            after: "Authored 14 Agile PRDs and user story criteria docs in JIRA, guiding 6 engineers to launch beta tools on-time."
        },
        {
            category: "Analytics & Testing",
            before: "Checked results of user experiments.",
            after: "Designed and ran multivariate A/B testing on pricing models, resulting in a 12.4% rise in signup checkout conversions."
        }
    ]
};

// Interview Question Database
const INTERVIEW_QUESTIONS = {
    frontend: {
        technical: [
            {
                q: "What is the Virtual DOM in React, and how does React optimize UI updates?",
                keywords: ["Virtual DOM", "reconciliation", "diffing", "real DOM", "state change", "render"],
                model: "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. When state changes, React constructs a new Virtual DOM tree, compares it with the previous one using a diffing algorithm (reconciliation), and batch updates only the changed elements in the real DOM, avoiding heavy re-renders."
            },
            {
                q: "Explain the difference between local component state and global state, and when would you use Context API or Redux?",
                keywords: ["local state", "global state", "prop drilling", "context api", "redux", "zustand", "store"],
                model: "Local state (useState) is managed within a single component or its children. Global state is shared application-wide. We use global state like Context API or Redux when multiple non-sibling components need access to the same data, preventing 'prop drilling' issues across deep hierarchy trees."
            },
            {
                q: "What does 'mobile-first responsive design' mean, and what tools do you use to implement it in CSS?",
                keywords: ["mobile-first", "media queries", "breakpoints", "flexbox", "grid", "min-width"],
                model: "Mobile-first responsive design means writing styling rules starting with mobile devices first, then applying media query rules using 'min-width' declarations to adjust layouts for tablets and desktops. We use Flexbox, Grid, viewport units, and clamp function sizes for fluid adjustment."
            }
        ],
        behavioral: [
            {
                q: "Describe a time when your code caused a bug or production crash. How did you identify it and what did you learn?",
                keywords: ["STAR method", "rollback", "debugging", "post-mortem", "collaboration", "git"],
                model: "Use the STAR method. Describe a specific Situation (e.g., bug introduced during release), Task (need to restore service), Action (used Git log to locate commit, rolled back version, applied Jest test to block future regression), and Result (restored systems in 10 mins, implemented automated pre-commit tests)."
            }
        ]
    },
    datascience: {
        technical: [
            {
                q: "What is the bias-variance tradeoff in machine learning, and how do you prevent overfitting?",
                keywords: ["bias", "variance", "overfitting", "regularization", "cross-validation", "noise"],
                model: "The bias-variance tradeoff is the conflict of trying to minimize both errors: high bias causes underfitting (missing trends), and high variance causes overfitting (learning training noise). We prevent overfitting by using L1/L2 regularization, cross-validation, and reducing parameters."
            },
            {
                q: "Explain what GROUP BY and HAVING clauses do in SQL queries, and how they differ from WHERE.",
                keywords: ["GROUP BY", "HAVING", "aggregation", "filter", "WHERE", "row-level"],
                model: "GROUP BY groups row data into summary buckets based on column values for aggregation (COUNT, SUM). The HAVING clause filters these aggregated buckets (e.g., HAVING COUNT > 5), whereas WHERE filters individual, raw data rows before grouping operations occur."
            }
        ],
        behavioral: [
            {
                q: "Tell me about a time you had to explain a complex statistical model or data insight to a non-technical stakeholder.",
                keywords: ["STAR method", "visualization", "business impact", "translation", "charts", "simplification"],
                model: "Use STAR method. Frame how you translated technical formulas into business terms (like ROI or client conversion). Emphasize using simple visualization dashboards (bar charts, scatter plots) instead of deep model equations to win stakeholder trust."
            }
        ]
    },
    productmanager: {
        technical: [
            {
                q: "How do you identify, define, and track the 'North Star Metric' for a new software product?",
                keywords: ["North Star Metric", "KPI", "user value", "retention", "engagement", "alignment"],
                model: "The North Star Metric is the key measure that best captures the core value your product delivers to customers. It must represent user value, align with long-term business growth, and guide development directions. E.g., for Spotify: 'Total listening hours', not just signups."
            },
            {
                q: "What is statistical significance in A/B testing, and why is sample size sizing important before launch?",
                keywords: ["statistical significance", "p-value", "sample size", "variance", "power", "type I error"],
                model: "Statistical significance (typically p-value < 0.05) ensures test differences are not due to random chance. Pre-determining sample size ensures the test has sufficient statistical power to detect true performance gains and avoids premature terminations."
            }
        ],
        behavioral: [
            {
                q: "How do you handle a situation where engineers disagree with your feature prioritization choices?",
                keywords: ["STAR method", "data-driven", "consensus", "listening", "alignment", "impact metrics"],
                model: "Use STAR. Establish collaboration by listening to engineers' concerns (like tech debt or scope bloat). Back up decisions with data metrics (user request logs, impact models), find alignment on key business goals, and adjust priorities collectively."
            }
        ]
    }
};

// Mock Career Coach Responses for Chatbot
const CHATBOT_RESPONSES = [
    {
        keywords: ["get", "first", "job", "career", "hired"],
        response: "To secure your first job: 1. Target a roadmap track (like Frontend Dev) and achieve 80%+ progress. 2. Build 3 distinct portfolio apps (not basic templates!). 3. Put your resume through our **Resume Analyzer** to score 80+. 4. Solve mock interviews in our **Interview Prep** portal."
    },
    {
        keywords: ["datascience", "data", "science", "ml", "python"],
        response: "For Data Science, start with Python basics and Pandas data manipulation. Learn database SQL queries early. Build a portfolio showing you can clean dirty datasets and train model classifiers in Scikit-Learn. Use our **Skill Roadmaps** tab and select 'Data Scientist' for tutorials!"
    },
    {
        keywords: ["resume", "cv", "optimize", "improve", "ats"],
        response: "Your resume is your gatekeeper. To optimize it: upload it into our **Resume Analyzer** tab. Swap simple lines ('was responsible for...') with active, quantified metrics ('Redesigned routing, boosting speeds by 24%...'). Ensure key skills (React, Git, SQL) are written exactly to bypass ATS filters."
    },
    {
        keywords: ["interview", "questions", "prep", "practice"],
        response: "The secret to interviewing is structured confidence. Go to the **Interview Prep** tab, select a track, and run a mock session. Try using the **STAR Method** for behavioral questions: Situation, Task, Action, Result. Highlight specific tools and numbers!"
    },
    {
        keywords: ["react", "frontend", "css", "html"],
        response: "Frontend engineering demands a blend of design and logic. Master HTML/CSS, Flexbox/Grid structures, clean ES6 JS, and React. Work through our interactive Frontend roadmap, mark milestones complete, and watch your Job compatibility ratings climb."
    }
];

// --- APP UTILITIES & INTERACTIVITY ---

// Switch Active Navigation Tabs
function switchTab(tabId) {
    STATE.activeTab = tabId;
    
    // Update Sidebar CSS
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update Content Pane CSS
    document.querySelectorAll('.tab-content').forEach(pane => {
        if (pane.id === `tab-${tabId}`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Page title adjustment
    const titleMap = {
        dashboard: "Dashboard Overview",
        roadmaps: "Skill Roadmap & Learning Path",
        resume: "Resume Optimizer & ATS Audit",
        jobs: "Job Compatibility Matcher",
        interview: "AI Interview Simulator Chamber"
    };
    document.getElementById('page-title').innerText = titleMap[tabId] || "SkillBridge AI";
    
    // Re-draw SVG connections if entering roadmap tab
    if (tabId === 'roadmaps') {
        setTimeout(drawRoadmapConnections, 50);
    }
}

// Calculate Career Readiness and Job Matches
function calculateMetrics() {
    const totalSkillsMap = {
        frontend: 9,
        datascience: 7,
        productmanager: 5
    };
    
    const currentTrackSkills = Object.values(ROADMAP_DATA[STATE.currentCareerPath].phases)
        .flatMap(phase => phase.nodes)
        .map(n => n.id);

    const completedInCurrentTrack = STATE.userProfile.completedSkills.filter(s => currentTrackSkills.includes(s));
    const skillCount = completedInCurrentTrack.length;
    const totalCount = totalSkillsMap[STATE.currentCareerPath] || 1;
    
    // 1. Skill Progress Percentage
    const skillPercent = Math.min(100, Math.round((skillCount / totalCount) * 100));
    
    // 2. Career Readiness Score: calculated from skills (60%) + resume analyzer (40%)
    const resumeScore = STATE.userProfile.resumeScore || 0;
    const readinessScore = Math.round((skillPercent * 0.6) + (resumeScore * 0.4));
    STATE.userProfile.readinessScore = readinessScore;

    // Update DOM Widgets
    document.getElementById('topbar-readiness-value').innerText = `${readinessScore}%`;
    document.getElementById('topbar-readiness-bar').style.width = `${readinessScore}%`;
    
    // Dashboard Stats Card Updates
    const skillsCountText = document.getElementById('stats-skills-count');
    const skillsProgressFill = document.getElementById('stats-skills-progress');
    if (skillsCountText && skillsProgressFill) {
        skillsCountText.innerText = `${skillCount} / ${totalCount}`;
        skillsProgressFill.style.width = `${skillPercent}%`;
    }

    const resumeCountText = document.getElementById('stats-resume-score');
    const resumeProgressFill = document.getElementById('stats-resume-progress');
    if (resumeCountText && resumeProgressFill) {
        resumeCountText.innerText = `${resumeScore}/100`;
        resumeProgressFill.style.width = `${resumeScore}%`;
    }

    const readinessPill = document.getElementById('roadmap-progress-percent');
    if (readinessPill) {
        readinessPill.innerText = `${skillPercent}%`;
    }

    // Refresh pages dependent on these numbers
    renderJobMatches();
    updateDashboardActionItems();
    saveStateToLocalStorage();
}

// --- LOCAL STORAGE STATE HANDLING ---
function saveStateToLocalStorage() {
    localStorage.setItem('SKILLBRIDGE_STATE_V2', JSON.stringify(STATE.userProfile));
}

function loadStateFromLocalStorage() {
    const saved = localStorage.getItem('SKILLBRIDGE_STATE_V2');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            STATE.userProfile = { ...STATE.userProfile, ...data };
        } catch (e) {
            console.error("Error loading LocalStorage state", e);
        }
    }
}

// Update Action plan recommendations
function updateDashboardActionItems() {
    const skillsAction = document.getElementById('action-skills-item');
    const resumeAction = document.getElementById('action-resume-item');
    
    if (skillsAction) {
        const pathData = ROADMAP_DATA[STATE.currentCareerPath];
        const uncompletedNode = Object.values(pathData.phases)
            .flatMap(p => p.nodes)
            .find(n => !STATE.userProfile.completedSkills.includes(n.id));
            
        if (uncompletedNode) {
            skillsAction.querySelector('h4').innerText = `Learn: ${uncompletedNode.name}`;
            skillsAction.querySelector('p').innerText = `Track Path: ${pathData.title}`;
            skillsAction.querySelector('.action-tag').innerText = "In Progress";
            skillsAction.querySelector('.action-tag').className = "action-tag info";
        } else {
            skillsAction.querySelector('h4').innerText = `Roadmap Complete!`;
            skillsAction.querySelector('p').innerText = `You completed all nodes for ${pathData.title}.`;
            skillsAction.querySelector('.action-tag').innerText = "Done";
            skillsAction.querySelector('.action-tag').className = "action-tag success";
        }
    }

    if (resumeAction) {
        if (STATE.userProfile.resumeAnalyzed) {
            if (STATE.userProfile.resumeScore >= 85) {
                resumeAction.querySelector('h4').innerText = `Resume optimized!`;
                resumeAction.querySelector('p').innerText = `Your Resume has excellent ATS score formatting.`;
                resumeAction.querySelector('.action-tag').innerText = "Complete";
                resumeAction.querySelector('.action-tag').className = "action-tag success";
            } else {
                resumeAction.querySelector('h4').innerText = `Implement Resume Improvements`;
                resumeAction.querySelector('p').innerText = `Apply action verbs recommended in Resume Analyzer.`;
                resumeAction.querySelector('.action-tag').innerText = "Medium Priority";
                resumeAction.querySelector('.action-tag').className = "action-tag warning";
            }
        } else {
            resumeAction.querySelector('h4').innerText = `Analyze Your Resume`;
            resumeAction.querySelector('p').innerText = `Upload your resume to audit key career term compliance.`;
            resumeAction.querySelector('.action-tag').innerText = "High Priority";
            resumeAction.querySelector('.action-tag').className = "action-tag warning";
        }
    }
}

// --- MODULE 1: ROADMAP GRAPH COMPONENT ---
function renderRoadmap() {
    const treeContainer = document.getElementById('roadmap-tree-nodes');
    if (!treeContainer) return;
    
    // Clear Container
    treeContainer.innerHTML = '';
    
    const trackData = ROADMAP_DATA[STATE.currentCareerPath];
    
    // Build connection SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('class', 'roadmap-connection-line');
    svg.setAttribute('id', 'roadmap-svg-canvas');
    treeContainer.appendChild(svg);
    
    // Append Phases & Nodes
    trackData.phases.forEach((phase, phaseIdx) => {
        const phaseDiv = document.createElement('div');
        phaseDiv.className = 'roadmap-phase';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'phase-title';
        titleDiv.innerText = phase.name;
        phaseDiv.appendChild(titleDiv);
        
        const rowDiv = document.createElement('div');
        rowDiv.className = 'nodes-row';
        
        phase.nodes.forEach(node => {
            const isCompleted = STATE.userProfile.completedSkills.includes(node.id);
            const isActive = STATE.currentSelectedNodeId === node.id;
            
            const nodeDiv = document.createElement('div');
            nodeDiv.className = `roadmap-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active-selection' : ''}`;
            nodeDiv.setAttribute('data-node-id', node.id);
            nodeDiv.id = `node-${node.id}`;
            
            nodeDiv.innerHTML = `
                <div class="node-status-check">✓</div>
                <div class="node-icon-wrapper">
                    ${getNodeIconSymbol(node.id)}
                </div>
                <span class="node-name">${node.name}</span>
            `;
            
            nodeDiv.addEventListener('click', () => selectRoadmapNode(node));
            rowDiv.appendChild(nodeDiv);
        });
        
        phaseDiv.appendChild(rowDiv);
        treeContainer.appendChild(phaseDiv);
    });
    
    // Re-draw connection lines
    setTimeout(drawRoadmapConnections, 50);
}

// Returns appropriate icons/emojis for nodes
function getNodeIconSymbol(nodeId) {
    const symbolMap = {
        htmlcss: '🎨',
        basicjs: '☕',
        git: '🌿',
        responsive: '📱',
        es6: '🚀',
        reactbasics: '⚛️',
        statemgmt: '📁',
        apiintegration: '🔌',
        testing: '🧪',
        python: '🐍',
        sql: '📊',
        pandas: '🐼',
        stats: '🧮',
        visualization: '📈',
        mlalgos: '🤖',
        dlbasics: '🧠',
        pmfoundations: '🎯',
        userresearch: '👥',
        scrumagile: '🔄',
        pmmetrics: '📈',
        abtesting: '🧪'
    };
    return symbolMap[nodeId] || '⭐️';
}

// Render connection lines dynamically between nodes
function drawRoadmapConnections() {
    const canvas = document.getElementById('roadmap-svg-canvas');
    if (!canvas) return;
    
    // Clear canvas lines
    canvas.innerHTML = '';
    
    const tree = document.getElementById('roadmap-tree-nodes');
    const nodes = tree.querySelectorAll('.roadmap-node');
    if (nodes.length <= 1) return;
    
    const treeRect = tree.getBoundingClientRect();
    canvas.setAttribute('width', treeRect.width);
    canvas.setAttribute('height', treeRect.height);
    
    // Connect sequential rows of nodes
    const nodeRows = tree.querySelectorAll('.nodes-row');
    
    for (let r = 0; r < nodeRows.length - 1; r++) {
        const parentNodes = nodeRows[r].querySelectorAll('.roadmap-node');
        const childNodes = nodeRows[r + 1].querySelectorAll('.roadmap-node');
        
        parentNodes.forEach(parent => {
            const parentRect = parent.getBoundingClientRect();
            const parentX = (parentRect.left + parentRect.width / 2) - treeRect.left;
            const parentY = (parentRect.bottom) - treeRect.top;
            
            childNodes.forEach(child => {
                const childRect = child.getBoundingClientRect();
                const childX = (childRect.left + childRect.width / 2) - treeRect.left;
                const childY = (childRect.top) - treeRect.top;
                
                // Draw bezier line between nodes
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                const cpY1 = parentY + (childY - parentY) / 2;
                const cpY2 = childY - (childY - parentY) / 2;
                
                const pathStr = `M ${parentX} ${parentY} C ${parentX} ${cpY1}, ${childX} ${cpY2}, ${childX} ${childY}`;
                path.setAttribute("d", pathStr);
                path.setAttribute("stroke", "rgba(99, 102, 241, 0.2)");
                path.setAttribute("stroke-width", "3");
                path.setAttribute("fill", "none");
                
                // Highlight path if both nodes are completed
                const pId = parent.getAttribute('data-node-id');
                const cId = child.getAttribute('data-node-id');
                if (STATE.userProfile.completedSkills.includes(pId) && STATE.userProfile.completedSkills.includes(cId)) {
                    path.setAttribute("stroke", "#10b981");
                    path.setAttribute("stroke-width", "4");
                }
                
                canvas.appendChild(path);
            });
        });
    }
}

// Select roadmap node and show inspector details
function selectRoadmapNode(node) {
    STATE.currentSelectedNodeId = node.id;
    
    // Update active styles in DOM
    document.querySelectorAll('.roadmap-node').forEach(div => {
        if (div.getAttribute('data-node-id') === node.id) {
            div.classList.add('active-selection');
        } else {
            div.classList.remove('active-selection');
        }
    });

    const emptyInspector = document.getElementById('inspector-empty');
    const contentInspector = document.getElementById('inspector-content');
    
    emptyInspector.classList.add('hidden');
    contentInspector.classList.remove('hidden');

    document.getElementById('node-title').innerText = node.name;
    document.getElementById('node-tag').innerText = node.tag;
    
    const difficultyEl = document.getElementById('node-difficulty');
    difficultyEl.innerText = node.difficulty;
    difficultyEl.className = ''; // reset classes
    if (node.difficulty === 'Easy') difficultyEl.classList.add('diff-easy');
    else if (node.difficulty === 'Medium') difficultyEl.classList.add('diff-medium');
    else difficultyEl.classList.add('diff-hard');
    
    document.getElementById('node-description').innerText = node.desc;
    
    // Load Tutorials
    const resourcesList = document.getElementById('node-resources');
    resourcesList.innerHTML = '';
    node.resources.forEach(res => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${res.url}" target="_blank"><i data-lucide="external-link" style="width: 14px; height: 14px;"></i> ${res.name}</a>`;
        resourcesList.appendChild(li);
    });

    // Load Subtopics
    const subtopicsList = document.getElementById('node-subtopics');
    subtopicsList.innerHTML = '';
    node.subtopics.forEach(topic => {
        const li = document.createElement('li');
        li.innerText = topic;
        subtopicsList.appendChild(li);
    });

    // Complete Button state toggle
    const completeBtn = document.getElementById('complete-node-btn');
    const isCompleted = STATE.userProfile.completedSkills.includes(node.id);
    
    if (isCompleted) {
        completeBtn.querySelector('span').innerText = "Mark as Incomplete";
        completeBtn.className = "btn btn-secondary btn-block";
        completeBtn.querySelector('i').setAttribute('data-lucide', 'x-circle');
    } else {
        completeBtn.querySelector('span').innerText = "Mark as Completed";
        completeBtn.className = "btn btn-primary btn-block";
        completeBtn.querySelector('i').setAttribute('data-lucide', 'check-circle-2');
    }
    
    lucide.createIcons();
}

// Toggle skill node completion state
function toggleSkillCompletion() {
    const nodeId = STATE.currentSelectedNodeId;
    if (!nodeId) return;

    const skillIndex = STATE.userProfile.completedSkills.indexOf(nodeId);
    
    if (skillIndex > -1) {
        // Mark Incomplete
        STATE.userProfile.completedSkills.splice(skillIndex, 1);
    } else {
        // Mark Completed
        STATE.userProfile.completedSkills.push(nodeId);
    }
    
    // Update node details inspector button immediately
    const nodeData = Object.values(ROADMAP_DATA[STATE.currentCareerPath].phases)
        .flatMap(p => p.nodes)
        .find(n => n.id === nodeId);
        
    if (nodeData) {
        selectRoadmapNode(nodeData);
    }
    
    // Render and update progress values
    renderRoadmap();
    calculateMetrics();
}

// --- MODULE 2: RESUME OPTIMIZER COMPONENT ---

// Simulate resume upload analysis pipeline
function triggerResumeAnalysis(rawText = "") {
    const placeholder = document.getElementById('resume-result-placeholder');
    const loading = document.getElementById('resume-result-loading');
    const display = document.getElementById('resume-result-display');

    placeholder.classList.add('hidden');
    loading.classList.remove('hidden');
    display.classList.add('hidden');

    setTimeout(() => {
        loading.classList.add('hidden');
        display.classList.remove('hidden');
        
        // Setup stats & score
        STATE.userProfile.resumeAnalyzed = true;
        
        // Random score or text matching evaluation score
        let targetScore = 65;
        if (rawText.length > 500) targetScore = 82;
        if (rawText.toLowerCase().includes('react') || rawText.toLowerCase().includes('python')) targetScore += 5;
        
        STATE.userProfile.resumeScore = Math.min(95, targetScore);
        
        // Render score indicators
        document.getElementById('resume-score-num').innerText = STATE.userProfile.resumeScore;
        const ring = document.getElementById('resume-score-ring');
        // SVG circle perimeter is 2 * PI * R (2 * 3.14159 * 40 = 251.2)
        const offset = 251.2 - (251.2 * STATE.userProfile.resumeScore) / 100;
        ring.style.strokeDashoffset = offset;

        // Label changes based on quality score
        const label = document.getElementById('resume-health-label');
        if (STATE.userProfile.resumeScore < 60) {
            label.innerText = "Critical Gaps";
            label.className = "text-danger";
        } else if (STATE.userProfile.resumeScore < 85) {
            label.innerText = "Optimization Recommended";
            label.className = "text-warning";
        } else {
            label.innerText = "ATS Optimized";
            label.className = "text-success";
        }

        // Render sections based on career track
        renderResumeDetails();
        calculateMetrics();
    }, 1800);
}

function renderResumeDetails() {
    const track = STATE.currentCareerPath;
    
    // 1. Load Suggestions (Before/After details)
    const diffContainer = document.getElementById('resume-diff-list');
    diffContainer.innerHTML = '';
    
    const items = RESUME_SUGGESTIONS[track] || RESUME_SUGGESTIONS['frontend'];
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'diff-item';
        div.innerHTML = `
            <div class="diff-category">${item.category}</div>
            <div class="diff-box">
                <div class="diff-row minus">
                    <span class="diff-icon">−</span>
                    <span>"${item.before}"</span>
                </div>
                <div class="diff-row plus">
                    <span class="diff-icon">+</span>
                    <span>"${item.after}"</span>
                </div>
            </div>
        `;
        diffContainer.appendChild(div);
    });

    // 2. Load missing keywords
    const criticalList = document.getElementById('missing-keywords-critical');
    const secondaryList = document.getElementById('missing-keywords-secondary');
    
    criticalList.innerHTML = '';
    secondaryList.innerHTML = '';
    
    const criticalMap = {
        frontend: ["React.js", "Responsive Web Design", "ES6 Promises", "CSS Grid"],
        datascience: ["Pandas DataFrames", "Machine Learning Model", "SQL Joining"],
        productmanager: ["PRD Specification", "A/B Testing Experiments", "Agile Roadmap"]
    };
    
    const secondaryMap = {
        frontend: ["Git Control", "Axios Interceptor", "Redux Store", "Jest Tests"],
        datascience: ["Hypothesis Testing", "Seaborn Charts", "Neural Networks"],
        productmanager: ["User Personas", "HEART metrics", "Sprint backlogs"]
    };
    
    criticalMap[track].forEach(w => {
        const span = document.createElement('span');
        span.className = "tag critical";
        span.innerText = w;
        criticalList.appendChild(span);
    });
    
    secondaryMap[track].forEach(w => {
        const span = document.createElement('span');
        span.className = "tag nice";
        span.innerText = w;
        secondaryList.appendChild(span);
    });

    // 3. Load ATS Audit Checklist
    const checklist = document.getElementById('resume-ats-checklist');
    checklist.innerHTML = `
        <div class="checklist-item pass">
            <span class="checklist-icon pass">✔</span>
            <span>Standard PDF format verified (Parsing friendly)</span>
        </div>
        <div class="checklist-item ${STATE.userProfile.resumeScore >= 80 ? 'pass' : 'fail'}">
            <span class="checklist-icon ${STATE.userProfile.resumeScore >= 80 ? 'pass' : 'fail'}">${STATE.userProfile.resumeScore >= 80 ? '✔' : '✘'}</span>
            <span>Technical profile terms density (Need minimum 8 critical terms)</span>
        </div>
        <div class="checklist-item pass">
            <span class="checklist-icon pass">✔</span>
            <span>No tables, graphics, or nested textboxes detected in styling</span>
        </div>
        <div class="checklist-item ${STATE.userProfile.resumeScore >= 75 ? 'pass' : 'fail'}">
            <span class="checklist-icon ${STATE.userProfile.resumeScore >= 75 ? 'pass' : 'fail'}">${STATE.userProfile.resumeScore >= 75 ? '✔' : '✘'}</span>
            <span>Action Verbs count (At least 12 strong operational verbs)</span>
        </div>
    `;
}

// --- MODULE 3: JOB COMPATIBILITY MATCHER ---

// Calculate compatibility score and render match lists
function renderJobMatches() {
    const listContainer = document.getElementById('jobs-list-container');
    const alertsContainer = document.getElementById('dashboard-job-alerts');
    const filterChecked = document.getElementById('filter-match-high')?.checked || false;
    const searchVal = document.getElementById('job-search-input')?.value.toLowerCase() || "";

    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    if (alertsContainer) alertsContainer.innerHTML = '';

    // Filter jobs by current chosen career path
    const filteredJobs = JOB_DATABASE.filter(job => job.track === STATE.currentCareerPath);
    
    let renderedCount = 0;
    
    filteredJobs.forEach(job => {
        // Calculate match percentage
        const matchingCount = job.requiredSkills.filter(s => STATE.userProfile.completedSkills.includes(s)).length;
        const matchPct = Math.round((matchingCount / job.requiredSkills.length) * 100);
        
        // Skill gaps identification
        const gaps = job.requiredSkills.filter(s => !STATE.userProfile.completedSkills.includes(s));
        
        // Filter actions
        if (filterChecked && matchPct < 80) return;
        if (searchVal && !job.title.toLowerCase().includes(searchVal) && !job.company.toLowerCase().includes(searchVal)) return;

        renderedCount++;
        
        // Determine coloring indicator
        let matchClass = 'match-high';
        if (matchPct < 50) matchClass = 'match-low';
        else if (matchPct < 80) matchClass = 'match-mid';

        // Check if job is already applied
        const isApplied = STATE.userProfile.appliedJobs.some(j => j.id === job.id);

        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="job-card-left">
                <div class="job-card-header">
                    <div class="company-logo">${job.logo}</div>
                    <div class="job-meta">
                        <h4>${job.title}</h4>
                        <span class="job-company">${job.company} • ${job.location}</span>
                    </div>
                </div>
                <div class="job-tags">
                    <span class="job-tag">${job.salary}</span>
                    <span class="job-tag">${job.track === 'frontend' ? 'React Framework' : job.track === 'datascience' ? 'Python Data' : 'Agile Management'}</span>
                </div>
                ${gaps.length > 0 ? `
                    <div class="job-gap-warning">
                        <i data-lucide="alert-circle" style="width: 13px; height: 13px;"></i>
                        <span>Gaps: ${gaps.map(g => getSkillNameById(g)).slice(0, 3).join(', ')}${gaps.length > 3 ? '...' : ''}</span>
                    </div>
                ` : `
                    <div class="job-gap-warning text-success" style="color: var(--secondary);">
                        <i data-lucide="check-circle-2" style="width: 13px; height: 13px;"></i>
                        <span>100% Match! Ready to apply.</span>
                    </div>
                `}
            </div>
            <div class="job-card-right">
                <div class="job-match-radial ${matchClass}">
                    <span class="pct">${matchPct}%</span>
                    <span class="match-lbl">Match</span>
                </div>
                <button class="btn btn-secondary btn-sm" id="apply-btn-${job.id}" ${isApplied ? 'disabled' : ''}>
                    ${isApplied ? 'Applied' : 'Apply Now'}
                </button>
            </div>
        `;

        listContainer.appendChild(card);
        
        // Add Apply Listener
        card.querySelector(`#apply-btn-${job.id}`).addEventListener('click', () => applyToJob(job));

        // Render in dashboard top matches panel (limit to 3 matches)
        if (alertsContainer && renderedCount <= 3) {
            const alertCard = document.createElement('div');
            alertCard.className = 'alert-job-card';
            alertCard.onclick = () => switchTab('jobs');
            alertCard.innerHTML = `
                <div class="alert-job-details">
                    <h4>${job.title}</h4>
                    <p>${job.company}</p>
                </div>
                <div class="alert-job-badge">
                    <span class="match-pct">${matchPct}%</span>
                    <span class="match-lbl">Match</span>
                </div>
            `;
            alertsContainer.appendChild(alertCard);
        }
    });

    if (renderedCount === 0) {
        listContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">
                <i data-lucide="briefcase" style="width: 48px; height: 48px; margin-bottom: 12px; stroke-width: 1px;"></i>
                <p>No job matches found. Complete more skill nodes or adjust your filters.</p>
            </div>
        `;
    }
    
    lucide.createIcons();
    renderKanbanTracker();
}

function getSkillNameById(id) {
    const list = {
        htmlcss: "HTML/CSS",
        basicjs: "JS Core",
        git: "Git",
        responsive: "CSS Grid",
        es6: "ES6 Logic",
        reactbasics: "React JS",
        statemgmt: "State Stores",
        apiintegration: "Axios API",
        testing: "Jest Unit Tests",
        python: "Python DS",
        sql: "SQL Query",
        pandas: "Pandas",
        stats: "Stats & Math",
        visualization: "Seaborn Visuals",
        mlalgos: "ML Classifier",
        dlbasics: "Keras Networks",
        pmfoundations: "Product Theory",
        userresearch: "User Interviews",
        scrumagile: "Agile Scrum",
        pmmetrics: "Analytics KPIs",
        abtesting: "A/B Validation"
    };
    return list[id] || id;
}

// Kanban tracking Board Operations
function applyToJob(job) {
    if (STATE.userProfile.appliedJobs.some(j => j.id === job.id)) return;
    
    STATE.userProfile.appliedJobs.push({
        id: job.id,
        title: job.title,
        company: job.company,
        status: 'applied'
    });

    renderJobMatches();
    calculateMetrics();
}

function moveJobStatus(jobId, newStatus) {
    const idx = STATE.userProfile.appliedJobs.findIndex(j => j.id === jobId);
    if (idx === -1) return;

    if (newStatus === 'remove') {
        STATE.userProfile.appliedJobs.splice(idx, 1);
    } else {
        STATE.userProfile.appliedJobs[idx].status = newStatus;
    }
    
    renderJobMatches();
    calculateMetrics();
}

function renderKanbanTracker() {
    const cols = {
        applied: document.getElementById('cards-applied'),
        interview: document.getElementById('cards-interview'),
        offered: document.getElementById('cards-offered')
    };

    const counts = {
        applied: document.getElementById('count-applied'),
        interview: document.getElementById('count-interview'),
        offered: document.getElementById('count-offered')
    };

    // Reset columns
    Object.values(cols).forEach(col => {
        if (col) col.innerHTML = '';
    });
    
    const countTrackers = { applied: 0, interview: 0, offered: 0 };

    STATE.userProfile.appliedJobs.forEach(job => {
        const col = cols[job.status];
        if (!col) return;

        countTrackers[job.status]++;

        const card = document.createElement('div');
        card.className = 'kanban-card';
        
        let moveBtnStr = '';
        if (job.status === 'applied') {
            moveBtnStr = `<button class="k-move-btn" onclick="moveJobStatus('${job.id}', 'interview')">Move to Interview ➔</button>`;
        } else if (job.status === 'interview') {
            moveBtnStr = `<button class="k-move-btn" onclick="moveJobStatus('${job.id}', 'offered')">Move to Offer 🎉➔</button>`;
        }

        card.innerHTML = `
            <h5>${job.title}</h5>
            <span class="kanban-card-company">${job.company}</span>
            <div class="kanban-card-actions">
                ${moveBtnStr}
                <button class="k-remove-btn" onclick="moveJobStatus('${job.id}', 'remove')" title="Withdraw application">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;

        col.appendChild(card);
    });

    // Update Counts
    Object.keys(counts).forEach(key => {
        if (counts[key]) counts[key].innerText = countTrackers[key];
    });

    // Update Dashboard Applications Active Card
    const statsJobsCount = document.getElementById('stats-jobs-count');
    const statsJobsSubtext = document.getElementById('stats-jobs-subtext');
    if (statsJobsCount) {
        statsJobsCount.innerText = `${STATE.userProfile.appliedJobs.length} Jobs`;
    }
    if (statsJobsSubtext) {
        statsJobsSubtext.innerText = `${countTrackers.interview} Interviews Scheduled`;
    }
    
    lucide.createIcons();
}

// --- MODULE 4: INTERVIEW SIMULATOR CHAMBER ---

// Start Interview Prep Session
function startInterviewSession() {
    const selectedRole = document.getElementById('interview-role').value;
    const selectedType = document.getElementById('interview-type').value;

    STATE.interviewRole = selectedRole;
    STATE.interviewType = selectedType;
    STATE.interviewCurrentQ = 0;
    STATE.interviewAnswers = [];
    
    const roleQuestions = INTERVIEW_QUESTIONS[selectedRole]?.[selectedType] || INTERVIEW_QUESTIONS['frontend']['technical'];
    STATE.interviewQuestions = roleQuestions;

    document.getElementById('interview-setup').classList.add('hidden');
    document.getElementById('interview-session').classList.remove('hidden');
    document.getElementById('interview-summary').classList.add('hidden');

    STATE.interviewActive = true;
    renderInterviewQuestion();
}

function renderInterviewQuestion() {
    const qIndex = STATE.interviewCurrentQ;
    const qData = STATE.interviewQuestions[qIndex];

    document.getElementById('q-current').innerText = qIndex + 1;
    document.getElementById('interview-answer-input').value = '';
    document.getElementById('char-count').innerText = 0;

    // Load Chat Messages
    const chatContainer = document.getElementById('interview-messages');
    chatContainer.innerHTML = `
        <div class="q-msg">
            <p><strong>AI Interviewer:</strong> Welcome. Let's begin the interview. Here is your question:</p>
            <p style="margin-top: 8px; font-weight: 600; font-size: 15px;">"${qData.q}"</p>
        </div>
    `;

    // Clear Evaluation side pane
    document.getElementById('evaluation-placeholder').classList.remove('hidden');
    document.getElementById('evaluation-content').classList.add('hidden');
}

// Simulated User speaking answers (Speech-to-text emulation)
function simulateVoiceInput() {
    const inputArea = document.getElementById('interview-answer-input');
    const voiceBtn = document.getElementById('voice-input-btn');
    const voiceText = document.getElementById('voice-status-text');

    voiceBtn.classList.add('recording');
    voiceText.innerText = "Listening...";
    inputArea.placeholder = "Simulating voice analysis... speaking into mic...";

    // Mock speaking transcript
    setTimeout(() => {
        const speechSamples = {
            frontend: {
                technical: [
                    "The virtual DOM is a light copy of the real DOM in React. When state updates, React creates a new tree and diffs it with the old one, changing only the nodes that differ. This reconciliation is fast.",
                    "Local state stays inside the component via useState, while global state Redux or Context API lets store data globally so deep-nested elements read variables without props passing.",
                    "Mobile first means you write style sheets styling mobile dimensions first. Use min-width media query statements to add styling properties on tablet screens and big desktop boxes."
                ]
            },
            datascience: {
                technical: [
                    "Bias is underfitting error where model is too simple, while variance is overfitting error where model learns noise. We balance it with cross-validation and L1 regularization tools.",
                    "GROUP BY aggregates database rows like summing categories, and HAVING operates filter checks on the output summary aggregates, unlike WHERE which filters the raw data rows beforehand."
                ]
            }
        };

        const samples = speechSamples[STATE.interviewRole]?.[STATE.interviewType] || speechSamples['frontend']['technical'];
        inputArea.value = samples[STATE.interviewCurrentQ] || "In my experience, using structured models and tools lets teams resolve prioritization conflicts effectively by relying on clear impact metrics and stakeholder consensus.";
        
        document.getElementById('char-count').innerText = inputArea.value.length;
        voiceBtn.classList.remove('recording');
        voiceText.innerText = "Simulate Voice";
        inputArea.placeholder = "Type your answer here or click Simulate Voice to record...";
    }, 1500);
}

// Evaluate user answers based on matches
function submitInterviewAnswer() {
    const userText = document.getElementById('interview-answer-input').value.trim();
    if (!userText) return;

    const qData = STATE.interviewQuestions[STATE.interviewCurrentQ];
    
    // Perform Evaluation
    const wordCount = userText.split(' ').length;
    const matchCount = qData.keywords.filter(kw => userText.toLowerCase().includes(kw.toLowerCase())).length;
    const keywordDensity = Math.round((matchCount / qData.keywords.length) * 100);

    // Calculate Grade metrics
    let score = 50;
    if (wordCount > 15) score += 15;
    if (wordCount > 35) score += 10;
    score += Math.round(keywordDensity * 0.25);
    score = Math.min(98, score);

    let grade = 'C';
    if (score >= 90) grade = 'A+';
    else if (score >= 80) grade = 'A';
    else if (score >= 70) grade = 'B+';
    else if (score >= 60) grade = 'B';
    
    // Strengths and Gaps determination
    const strengths = [];
    const gaps = [];

    if (wordCount > 25) strengths.push("Provided a detailed explanation with solid articulation structure.");
    else gaps.push("Response was brief. Try adding code implementation or STAR frameworks details.");

    if (matchCount >= qData.keywords.length / 2) {
        strengths.push(`Excellent vocabulary: hit critical terms like: ${qData.keywords.slice(0, 3).join(', ')}.`);
    } else {
        gaps.push(`Missing industry terminology. You should include terms like: ${qData.keywords.filter(kw => !userText.toLowerCase().includes(kw.toLowerCase())).slice(0, 2).join(', ')}.`);
    }

    // Save Answer details to state
    STATE.interviewAnswers.push({
        question: qData.q,
        userAns: userText,
        score: score,
        grade: grade,
        strengths: strengths,
        gaps: gaps,
        model: qData.model
    });

    // Display evaluation pane
    document.getElementById('evaluation-placeholder').classList.add('hidden');
    const content = document.getElementById('evaluation-content');
    content.classList.remove('hidden');

    document.getElementById('eval-grade').innerText = grade;
    document.getElementById('score-completeness').innerText = `${score}%`;
    document.getElementById('fill-completeness').style.width = `${score}%`;

    const clarityScore = Math.min(100, Math.round(score * 0.95));
    document.getElementById('score-clarity').innerText = `${clarityScore}%`;
    document.getElementById('fill-clarity').style.width = `${clarityScore}%`;

    // Strengths list render
    const strList = document.getElementById('eval-strengths');
    strList.innerHTML = '';
    strengths.forEach(s => {
        const li = document.createElement('li');
        li.innerText = s;
        strList.appendChild(li);
    });

    // Gaps list render
    const gapList = document.getElementById('eval-gaps');
    gapList.innerHTML = '';
    gaps.forEach(g => {
        const li = document.createElement('li');
        li.innerText = g;
        gapList.appendChild(li);
    });

    // Model answer loading
    document.getElementById('eval-model-answer').innerText = qData.model;

    // Append User Answer into chat timeline
    const chatContainer = document.getElementById('interview-messages');
    const aDiv = document.createElement('div');
    aDiv.className = 'a-msg';
    aDiv.innerHTML = `<p><strong>You:</strong> ${userText}</p>`;
    chatContainer.appendChild(aDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Next question or Final summary screen transition
function proceedToNextQuestion() {
    STATE.interviewCurrentQ++;
    
    if (STATE.interviewCurrentQ < STATE.interviewQuestions.length) {
        renderInterviewQuestion();
    } else {
        // Show Report Card
        document.getElementById('interview-session').classList.add('hidden');
        const summary = document.getElementById('interview-summary');
        summary.classList.remove('hidden');

        // Math totals
        const totalScore = STATE.interviewAnswers.reduce((sum, item) => sum + item.score, 0);
        const avgScore = Math.round(totalScore / STATE.interviewAnswers.length);

        // Update dashboard score state
        STATE.userProfile.interviewScore = `${avgScore}%`;
        const statsInterviewScore = document.getElementById('stats-interview-score');
        if (statsInterviewScore) {
            statsInterviewScore.innerText = `${avgScore}%`;
        }

        document.getElementById('summary-giant-score').innerText = `${avgScore}%`;
        document.getElementById('sum-topic-track').innerText = `${STATE.interviewRole === 'frontend' ? 'Frontend Web Dev' : STATE.interviewRole === 'datascience' ? 'Data Scientist' : 'Product Manager'} (${STATE.interviewType})`;
        
        STATE.interviewActive = false;
        calculateMetrics();
    }
}

// --- MODULE 5: FLOATING PERSISTENT AI COACH ---

function handleAssistantSend() {
    const input = document.getElementById('assistant-text-input');
    const text = input.value.trim();
    if (!text) return;

    appendAssistantMessage(text, 'user-msg');
    input.value = '';

    // Mock AI analysis typing delays
    setTimeout(() => {
        const query = text.toLowerCase();
        let matchedResp = "I appreciate that question. To succeed in your career, I recommend following your track's specific **Skill Roadmap**, analyzing your resume to target missing keywords, and executing mock interviews.";

        for (const item of CHATBOT_RESPONSES) {
            if (item.keywords.some(kw => query.includes(kw))) {
                matchedResp = item.response;
                break;
            }
        }

        appendAssistantMessage(matchedResp, 'ai-msg');
    }, 800);
}

function appendAssistantMessage(text, className) {
    const body = document.getElementById('assistant-chat-body');
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = `<p>${text}</p>`;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}

// Initialize setup listeners
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State Loading
    loadStateFromLocalStorage();

    // Init Lucide
    lucide.createIcons();

    // 2. Navigation Tab switching
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(item.getAttribute('data-tab'));
        });
    });

    // 3. Floating Assistant Toggles
    const openAssistantBtn = document.getElementById('open-assistant-btn');
    const closeAssistantBtn = document.getElementById('close-assistant-btn');
    const assistantPanel = document.getElementById('assistant-chat-panel');

    if (openAssistantBtn && assistantPanel) {
        openAssistantBtn.addEventListener('click', () => {
            assistantPanel.classList.remove('hidden');
            const chatBody = document.getElementById('assistant-chat-body');
            chatBody.scrollTop = chatBody.scrollHeight;
        });
    }

    if (closeAssistantBtn && assistantPanel) {
        closeAssistantBtn.addEventListener('click', () => {
            assistantPanel.classList.add('hidden');
        });
    }

    const sendMsgBtn = document.getElementById('send-assistant-msg-btn');
    const assistantInput = document.getElementById('assistant-text-input');
    if (sendMsgBtn && assistantInput) {
        sendMsgBtn.addEventListener('click', handleAssistantSend);
        assistantInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleAssistantSend();
        });
    }

    // Suggested prompts listeners
    document.querySelectorAll('.prompt-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const promptText = pill.getAttribute('data-prompt');
            document.getElementById('assistant-text-input').value = promptText;
            handleAssistantSend();
        });
    });

    // 4. Career Track Selection changes
    const selectTrack = document.getElementById('career-path-select');
    if (selectTrack) {
        selectTrack.value = STATE.currentCareerPath; // Sync default
        
        // Listen to both change and input to ensure compatibility with all browser triggers
        const syncTrackChange = (e) => {
            STATE.currentCareerPath = e.target.value;
            STATE.currentSelectedNodeId = null;
            
            // Sync Profile details role
            const roleMap = {
                frontend: "Aspiring Frontend Dev",
                datascience: "Aspiring Data Scientist",
                productmanager: "Aspiring Product Manager"
            };
            STATE.userProfile.role = roleMap[e.target.value] || "Aspiring Specialist";
            document.querySelector('.user-role').innerText = STATE.userProfile.role;

            // Redraw modules
            renderRoadmap();
            calculateMetrics();
            
            // If resume display is active, reset it to match track suggestions
            if (STATE.userProfile.resumeAnalyzed) {
                renderResumeDetails();
            }
        };
        
        selectTrack.addEventListener('change', syncTrackChange);
        selectTrack.addEventListener('input', syncTrackChange);
    }

    // 5. Complete Node Listener
    const completeNodeBtn = document.getElementById('complete-node-btn');
    if (completeNodeBtn) {
        completeNodeBtn.addEventListener('click', toggleSkillCompletion);
    }

    // 6. Resume Analyzer elements
    const dropzone = document.getElementById('resume-dropzone');
    const fileInput = document.getElementById('resume-file-input');

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                triggerResumeAnalysis(fileInput.files[0].name);
            }
        });

        // Drag/Drop visual styles
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                triggerResumeAnalysis(e.dataTransfer.files[0].name);
            }
        });
    }

    const analyzeTextBtn = document.getElementById('analyze-text-btn');
    const pasteArea = document.getElementById('resume-paste-area');
    if (analyzeTextBtn && pasteArea) {
        analyzeTextBtn.addEventListener('click', () => {
            const txt = pasteArea.value.trim();
            if (txt) {
                triggerResumeAnalysis(txt);
            }
        });
    }

    const sampleResumeBtn = document.getElementById('use-sample-resume-btn');
    if (sampleResumeBtn) {
        sampleResumeBtn.addEventListener('click', () => {
            const sampleText = "Kapil Sharma - Aspiring Software Engineer. Tech Skills: HTML5, CSS3, JavaScript, Git. Experience: Developed basic static web projects, resolved minor bugs, worked in teams.";
            triggerResumeAnalysis(sampleText);
        });
    }

    // Resume Subtabs
    document.querySelectorAll('.tabs-subnav .subnav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active CSS
            document.querySelectorAll('.tabs-subnav .subnav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('#resume-result-display .subtab-content').forEach(p => p.classList.add('hidden'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-subtab');
            document.getElementById(`subtab-${target}`).classList.remove('hidden');
        });
    });

    // 7. Job Match Filters & search inputs
    const jobSearch = document.getElementById('job-search-input');
    if (jobSearch) {
        jobSearch.addEventListener('input', renderJobMatches);
    }
    const jobFilter = document.getElementById('filter-match-high');
    if (jobFilter) {
        jobFilter.addEventListener('change', renderJobMatches);
    }

    // 8. Interview Prep elements
    const startIntBtn = document.getElementById('start-interview-btn');
    if (startIntBtn) {
        startIntBtn.addEventListener('click', startInterviewSession);
    }

    const voiceBtn = document.getElementById('voice-input-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', simulateVoiceInput);
    }

    const submitAnsBtn = document.getElementById('submit-answer-btn');
    if (submitAnsBtn) {
        submitAnsBtn.addEventListener('click', submitInterviewAnswer);
    }

    const nextQBtn = document.getElementById('next-question-btn');
    if (nextQBtn) {
        nextQBtn.addEventListener('click', proceedToNextQuestion);
    }

    const restartIntBtn = document.getElementById('restart-interview-btn');
    if (restartIntBtn) {
        restartIntBtn.addEventListener('click', () => {
            document.getElementById('interview-summary').classList.add('hidden');
            document.getElementById('interview-setup').classList.remove('hidden');
        });
    }

    const ansInput = document.getElementById('interview-answer-input');
    if (ansInput) {
        ansInput.addEventListener('input', (e) => {
            document.getElementById('char-count').innerText = e.target.value.length;
        });
    }

    // SVG Redraw handles on resize
    window.addEventListener('resize', () => {
        if (STATE.activeTab === 'roadmaps') {
            drawRoadmapConnections();
        }
    });

    // 9. Boot calculations
    calculateMetrics();
    renderRoadmap();
    renderJobMatches();
});
