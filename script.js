// Ensure DOM is loaded
document.addEventListener('DOMContentLoaded', () => {

    // Always load at the top of the page on refresh
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- Preloader Removed (Instant Load) ---
    document.body.classList.add('site-loaded');
    
    
    // Start typing effect immediately
    setTimeout(() => {
        const nameContainer = document.getElementById('typewriter-name');
        if (nameContainer) {
            const fullName = "Praneeth Gowda K";
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < fullName.length) {
                    nameContainer.textContent += fullName.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    // Hide the cursor after a short delay for a cleaner look
                    const cursor = document.querySelector('.typewriter-cursor');
                    if (cursor) {
                        setTimeout(() => cursor.style.display = 'none', 1500);
                    }
                }
            }, 100); // Typing speed
        }
    }, 1200); // Wait for Navbar and Greeting to fade in first (1.2s)


    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    let lastMouseX = window.innerWidth / 2;
    let lastMouseY = window.innerHeight / 2;
    let lastHoveredElement = null;
    
    function checkCursorHover() {
        if (!cursorDot) return;
        const elUnderCursor = document.elementFromPoint(lastMouseX, lastMouseY);
        if (elUnderCursor) {
            // Force browser to recalculate native CSS :hover states on scroll
            if (elUnderCursor !== lastHoveredElement) {
                lastHoveredElement = elUnderCursor;
                document.body.style.pointerEvents = 'none';
                void document.body.offsetHeight; // Force reflow
                document.body.style.pointerEvents = 'auto';
            }

            // Check if element or its parent is interactive (Standard: Only true clickable elements)
            const isInteractive = elUnderCursor.closest('a, button, input, textarea, label, select');
            if (isInteractive) {
                cursorDot.classList.add('cursor-hover');
            } else {
                cursorDot.classList.remove('cursor-hover');
            }
        }
    }

    window.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        cursorDot.animate({
            left: `${lastMouseX}px`,
            top: `${lastMouseY}px`
        }, { duration: 200, fill: "forwards" });
        
        checkCursorHover();
    });

    // Fire on scroll so hover updates even if the physical mouse is completely still
    window.addEventListener('scroll', () => {
        checkCursorHover();
    }, { passive: true });

    // --- Navbar & Scroll Progress ---
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.querySelector('.scroll-progress');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Smooth Scroll for Nav Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetAttr = this.getAttribute('href');
            if (targetAttr && targetAttr.startsWith('#')) {
                e.preventDefault();
                const targetId = targetAttr.substring(1);
                if (targetId === 'contact') {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                } else {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        window.scrollTo({ top: targetElement.offsetTop, behavior: 'smooth' });
                    }
                }
            }
        });
    });

    // --- Glowing Arsenal Cards & Skill Pills Logic ---
    const glowCards = document.querySelectorAll('.glow-card');
    const skillPills = document.querySelectorAll('.skill-pill');
    
    function updateGlowEffects() {
        glowCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            // Update if mouse is near the card vertically
            if (lastMouseY >= rect.top - 100 && lastMouseY <= rect.bottom + 100) {
                const x = lastMouseX - rect.left;
                const y = lastMouseY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }
        });

        skillPills.forEach(pill => {
            const rect = pill.getBoundingClientRect();
            if (lastMouseY >= rect.top - 100 && lastMouseY <= rect.bottom + 100) {
                const x = lastMouseX - rect.left;
                const y = lastMouseY - rect.top;
                pill.style.setProperty('--pill-mouse-x', `${x}px`);
                pill.style.setProperty('--pill-mouse-y', `${y}px`);
            }
        });
    }

    // Keep the glow in sync when scrolling
    window.addEventListener('scroll', updateGlowEffects, { passive: true });
    // And when moving the mouse
    window.addEventListener('mousemove', updateGlowEffects);

    // Accordion Logic (Moved to scroll-spy logic below)

    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section, footer');
        
        sections.forEach(section => {
            const sectionId = section.getAttribute('id');
            // Skip contact from the standard offset calculation because it is fixed
            if (sectionId === 'contact') return;
            
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - window.innerHeight / 3)) {
                current = sectionId;
            }
        });

        // Contact is fixed, so we only trigger it when we hit the absolute bottom
        if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            current = 'contact';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Navbar glass effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollProgress && document.body.style.overflow !== 'hidden') {
            const totalHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
            const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
            scrollProgress.style.width = `${progress}%`;
        }
    });

    // --- Premium Element Reveal Animations ---
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    function startObservingReveals() {
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
    
    // Start observing immediately
    startObservingReveals();

    // --- Custom Smooth Scrolling & Active Links ---
    
    // Handle click for proper navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // We now rely on native CSS scroll-margin-top for offset
                let offsetTop = targetSection.offsetTop; 
                
                // Special handling for the curtain footer (contact)
                if (targetId === 'contact') {
                    offsetTop = document.documentElement.scrollHeight;
                }

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Cosmic Timeline Animation Removed ---
    // Skills are now displayed via CSS Bento Grid.

    // --- Project Modal Logic ---
    const oldProjectData = {
        'clastrix': {
            title: 'Clastrix',
            icon: 'ph-scan',
            tech: ['React', 'FastAPI', 'DeepFace', 'Node.js'],
            problem: 'Manual attendance tracking in universities is time-consuming and prone to proxy attendance. Existing systems lack seamless integration and require specialized hardware.',
            solution: 'Developed an automated face-recognition attendance system that integrates with standard webcams. It processes images via a FastAPI backend powered by DeepFace, reducing attendance time by 90% and completely eliminating proxies.',
            features: [
                'Automated facial recognition using DeepFace AI',
                'Teacher dashboard for real-time attendance monitoring',
                'Secure Admin portal for managing student records',
                'FastAPI backend for high-performance image processing'
            ]
        },
        'healthcare': {
            title: 'Predictive Healthcare UI',
            icon: 'ph-heartbeat',
            tech: ['Python', 'Pandas', 'SciKit-Learn', 'PyQt5'],
            problem: 'Healthcare professionals need rapid, data-driven insights to predict patient outcomes and identify early warning signs of chronic diseases.',
            solution: 'Engineered a machine learning-based desktop application that analyzes patient data in real-time. By utilizing trained Logistic Regression models, the tool provides immediate risk assessments to aid clinical decision-making.',
            features: [
                'Trained Logistic Regression model on large healthcare datasets',
                'Real-time risk assessment dashboard',
                'Clean, intuitive desktop UI built with PyQt5',
                'Extensive data preprocessing and feature engineering using Pandas'
            ]
        },
        'ecommerce': {
            title: 'E-Commerce Backend',
            icon: 'ph-shopping-bag',
            tech: ['Node.js', 'Express', 'MongoDB', 'JWT'],
            problem: 'Growing online stores struggle with backend bottlenecks during high traffic spikes, leading to failed transactions and poor user experience.',
            solution: 'Architected a scalable, microservices-ready Node.js backend tailored for high concurrency. Optimized database queries and implemented secure, role-based access control to ensure seamless performance under load.',
            features: [
                'Scalable microservices-ready architecture',
                'Secure JWT authentication and role-based access control',
                'Optimized MongoDB aggregation pipelines for fast product searching',
                'Integrated payment gateway endpoints'
            ]
        }
    };

    const oldModalOverlay = document.getElementById('project-modal');
    const oldModalCloseBtn = document.getElementById('modal-close-btn');
    
    if (false) {
        const mTitle = document.getElementById('modal-title');
        const mIcon = document.getElementById('modal-icon');
        const mTech = document.getElementById('modal-tech');
        const mProblem = document.getElementById('modal-problem');
        const mSolution = document.getElementById('modal-solution');
        const mFeatures = document.getElementById('modal-features');
        // Get the scrolling container
        const modalContent = document.querySelector('.full-modal-content');

        document.querySelectorAll('.explore-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = e.currentTarget.getAttribute('data-project-id');
                const data = projectData[projectId];
                
                if(data) {
                    mTitle.innerText = data.title;
                    mIcon.className = `ph ${data.icon} size-large text-gradient`;
                    mProblem.innerText = data.problem;
                    if(mSolution) mSolution.innerText = data.solution;
                    
                    mTech.innerHTML = '';
                    data.tech.forEach(t => {
                        const span = document.createElement('span');
                        span.innerText = t;
                        mTech.appendChild(span);
                    });

                    mFeatures.innerHTML = '';
                    data.features.forEach(f => {
                        const li = document.createElement('li');
                        li.innerText = f;
                        mFeatures.appendChild(li);
                    });

                    // Reset scroll position before opening
                    modalOverlay.scrollTop = 0;
                    
                    modalOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeModal() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        modalCloseBtn.addEventListener('click', closeModal);
        // Also close when clicking outside the content (on the overlay itself)
        modalOverlay.addEventListener('click', (e) => {
            if(e.target === modalOverlay) closeModal();
        });
    }

    // --- Scroll-Spy Process Accordion ---
    const accordionContainer = document.getElementById('process-accordion');
    const accordionItems = document.querySelectorAll('#process-accordion .accordion-item');

    window.addEventListener('scroll', () => {
        // Process Accordion Spy Logic
        if (accordionContainer && accordionItems.length > 0) {
            const rect = accordionContainer.getBoundingClientRect();
            const containerTop = rect.top + window.scrollY;
            const containerHeight = rect.height;
            const scrollCenter = window.scrollY + (window.innerHeight / 2);

            if (scrollCenter >= containerTop && scrollCenter <= containerTop + containerHeight) {
                const scrolledAmount = scrollCenter - containerTop;
                let scrollPercentage = scrolledAmount / containerHeight;
                
                scrollPercentage = Math.max(0, Math.min(scrollPercentage, 0.999));
                const itemIndex = Math.floor(scrollPercentage * accordionItems.length);

                accordionItems.forEach((item, index) => {
                    if (index === itemIndex) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            } else if (scrollCenter < containerTop) {
                // Force first item active if we are above the container
                accordionItems.forEach((item, index) => {
                    if (index === 0) item.classList.add('active');
                    else item.classList.remove('active');
                });
            } else {
                // Force last item active if we are below the container
                accordionItems.forEach((item, index) => {
                    if (index === accordionItems.length - 1) item.classList.add('active');
                    else item.classList.remove('active');
                });
            }
        }

        // --- Certifications Horizontal Scroll Logic ---
        const certSection = document.getElementById('certifications');
        const certContent = document.getElementById('cert-scroll-content');
        
        if (certSection && certContent) {
            const certTop = certSection.offsetTop;
            const certHeight = certSection.offsetHeight;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            if (scrollY >= certTop && scrollY <= certTop + certHeight - windowHeight) {
                const maxScroll = certHeight - windowHeight;
                const scrolledAmount = scrollY - certTop;
                const scrollPercentage = scrolledAmount / maxScroll;
                
                const contentWidth = certContent.scrollWidth;
                const maxTranslate = contentWidth - window.innerWidth;
                
                if (maxTranslate > 0) {
                    const currentTranslate = maxTranslate * scrollPercentage;
                    certContent.style.transform = `translateX(-${currentTranslate}px)`;
                }
            } else if (scrollY < certTop) {
                certContent.style.transform = `translateX(0px)`;
            } else if (scrollY > certTop + certHeight - windowHeight) {
                const contentWidth = certContent.scrollWidth;
                const maxTranslate = Math.max(0, contentWidth - window.innerWidth);
                certContent.style.transform = `translateX(-${maxTranslate}px)`;
            }
        }

        // --- Sticky Parallax Stack Logic ---
        const stackedCards = document.querySelectorAll('.stacked-card');
        const stuckTop = window.innerHeight * 0.15; // matches top: 15vh
        
        stackedCards.forEach((card, index) => {
            if (index === stackedCards.length - 1) {
                card.style.transform = `scale(1)`;
                card.style.opacity = 1;
                return;
            }
            
            const nextCard = stackedCards[index + 1];
            if (nextCard) {
                const nextRect = nextCard.getBoundingClientRect();
                const distance = nextRect.top - stuckTop;
                
                if (distance < window.innerHeight && distance > 0) {
                    const progress = 1 - (distance / window.innerHeight);
                    const scale = 1 - (progress * 0.05); 
                    const opacity = 1 - (progress * 0.4); 
                    card.style.transform = `scale(${scale})`;
                    card.style.opacity = opacity;
                } else if (distance <= 0) {
                    card.style.transform = `scale(0.95)`;
                    card.style.opacity = 0.6;
                } else {
                    card.style.transform = `scale(1)`;
                    card.style.opacity = 1;
                }
            }
        });

    });

    // --- Project Explore Modal Logic ---
    const projectData = {
        clastrix: {
            title: "Classtrix",
            shortDesc: "The Smart Core of Classroom Intelligence. An AI-powered platform that automates attendance via facial recognition and uses machine learning to predict student attendance risks, featuring comprehensive dashboards for administrators, teachers, and students.",
            icon: "ph-scan",
            tech: {
                "Languages": ["TypeScript", "Python"],
                "Frontend": ["React", "Tailwind CSS", "Framer Motion", "Recharts", "Zustand", "TanStack Query"],
                "Backend": ["Node.js", "Express.js", "SQLite", "JWT", "Multer"],
                "AI / Machine Learning": ["Python", "FastAPI", "DeepFace", "FaceNet512", "OpenCV", "XGBoost", "Scikit-Learn"]
            },
            github: "https://github.com/PraneethGowdaK/Classtrix-The-Smart-Core-Of-Classroom-Intelligence",
            demo: "#",
            problemTitle: "The Problem",
            problem: "Traditional attendance systems are time-consuming, vulnerable to proxy attendance, and provide little visibility into student engagement, attentiveness, or future attendance risks, making early intervention difficult for institutions.",
            solutionTitle: "The Solution",
            solution: "Classtrix automates attendance through facial recognition, eliminating the need for manual roll calls and reducing proxy attendance. The platform also analyzes attendance patterns, attentiveness, and student behavior using machine learning, helping institutions identify attendance risks and support students at the right time.",
            contributionsTitle: "Challenges Faced",
            contributions: [
                "<span class=\"point-title\">Multi-Face Recognition Accuracy</span><span class=\"point-desc\">Accurately identifying multiple students from a single classroom image.</span>",
                "<span class=\"point-title\">Recognition Performance Optimization</span><span class=\"point-desc\">Reducing attendance processing and prediction time for faster results.</span>",
                "<span class=\"point-title\">Cross-Service Integration</span><span class=\"point-desc\">Ensuring seamless communication between React, Express, and FastAPI services.</span>",
                "<span class=\"point-title\">Attendance Analytics Design</span><span class=\"point-desc\">Building reliable attendance risk prediction and behavioral analytics models.</span>"
            ],
            featuresTitle: "Technical Highlights",
            features: [
                "<span class=\"point-title\">Face Recognition Pipeline</span><span class=\"point-desc\">Automated attendance using DeepFace, FaceNet512, and OpenCV to identify students from classroom images.</span>",
                "<span class=\"point-title\">Attendance Risk Prediction</span><span class=\"point-desc\">XGBoost-based model that predicts students likely to fall below attendance requirements, enabling early intervention.</span>",
                "<span class=\"point-title\">Attendance Intelligence Analytics</span><span class=\"point-desc\">Analyzes attendance trends, consistency patterns, and attentiveness levels to generate meaningful insights into student engagement and behavior.</span>",
                "<span class=\"point-title\">Timetable-Aware Attendance Validation</span><span class=\"point-desc\">Ensures attendance can only be recorded during scheduled class sessions, preventing invalid or duplicate attendance entries.</span>",
                "<span class=\"point-title\">Image Enhancement & Processing</span><span class=\"point-desc\">Implemented brightness adjustment and multiple image enhancement modes to improve recognition quality under varying classroom conditions.</span>",
                "<span class=\"point-title\">Role-Based Access Control</span><span class=\"point-desc\">Dedicated Admin, Teacher, and Student dashboards secured through JWT-based authentication.</span>"
            ],
            results: [
                "Attendance marking reduced from 10–15 minutes to under 60 seconds through AI-powered recognition and automation.",
                "Enabled early detection of students likely to fall below attendance requirements before eligibility becomes a concern.",
                "Generated behavioral insights through attendance trends, consistency tracking, attentiveness analysis, and risk prediction.",
                "Verified student presence through facial recognition, significantly reducing opportunities for proxy attendance.",
                "Delivered a centralized educational platform with role-based dashboards, combining attendance management, academic administration, and AI-driven insights in a single system."
            ],
            horizontalScreenshots: true,
            screenshots: [
                { title: "1. Portal Login System", desc: "Role-based authentication portal providing secure access for Administrators, Teachers, and Students.", url: "screenshots/Classtrix/1.png" },
                { title: "2. Administrator Dashboard", desc: "Centralized control panel for managing academic resources, users, schedules, and system operations.", url: "screenshots/Classtrix/2.png" },
                { title: "3. Add Course Module", desc: "Create and register courses by defining subject details, department, semester, section, and credits.", url: "screenshots/Classtrix/3.png" },
                { title: "4. Teacher Registration Module", desc: "Register faculty members and create teacher accounts for academic and attendance management.", url: "screenshots/Classtrix/4.png" },
                { title: "5. Student Registration Module", desc: "Enroll students and capture facial data required for automated attendance recognition.", url: "screenshots/Classtrix/5.png" },
                { title: "6. Timetable Creation Module", desc: "Generate conflict-free class schedules for departments, semesters, and sections.", url: "screenshots/Classtrix/6.png" },
                { title: "7. Student Login Portal", desc: "Dedicated student authentication interface for accessing attendance records and academic insights.", url: "screenshots/Classtrix/7.png" },
                { title: "8. Student Dashboard", desc: "Personalized student workspace providing quick access to timetable, attendance, and analytics.", url: "screenshots/Classtrix/8.png" },
                { title: "9. Student Attendance Viewer", desc: "View daily attendance records and subject-wise attendance status for selected dates.", url: "screenshots/Classtrix/9.png" },
                { title: "10. Student Attendance Analytics", desc: "AI-powered analysis of attendance performance, risk level, consistency, and attentiveness.", url: "screenshots/Classtrix/10.png" },
                { title: "11. Attendance Trend & ML Insights", desc: "Visual dashboards presenting attendance trends, risk prediction, consistency analysis, and attentiveness metrics.", url: "screenshots/Classtrix/11.png" },
                { title: "12. Teacher Dashboard", desc: "Faculty dashboard providing access to attendance capture, attendance management, timetable, and analytics.", url: "screenshots/Classtrix/12.png" },
                { title: "13. Attendance Session Selection", desc: "Select department, semester, section, and active course before initiating attendance capture.", url: "screenshots/Classtrix/13.png" },
                { title: "14. Attendance Validation System", desc: "Automatically verifies timetable schedules and attendance eligibility based on active class timings.", url: "screenshots/Classtrix/14.png" },
                { title: "15. Face Recognition Attendance Capture", desc: "Capture classroom images and process attendance using AI-based facial recognition technology.", url: "screenshots/Classtrix/15.png" },
                { title: "16. Attendance Review & Verification", desc: "Review detected students, attendance statistics, confidence scores, and attendance results before submission.", url: "screenshots/Classtrix/16.png" },
                { title: "17. Attendance Record Management", desc: "View and modify attendance records with manual verification and correction capabilities.", url: "screenshots/Classtrix/17.png" },
                { title: "18. Faculty Attendance Analytics Dashboard", desc: "Analyze attendance statistics across courses and identify academic performance trends.", url: "screenshots/Classtrix/18.png" },
                { title: "19. Attendance Risk Distribution Analysis", desc: "Visualize student attendance distribution and identify students at risk of attendance shortages.", url: "screenshots/Classtrix/19.png" },
                { title: "20. Machine Learning Academic Intelligence", desc: "Comprehensive analytics combining attendance trends, risk prediction, consistency analysis, and classroom engagement insights.", url: "screenshots/Classtrix/20.png" },
                { title: "21. Student Attendance Analytics Report", desc: "Comprehensive student-wise attendance analysis displaying attendance percentage, ML-based risk prediction, trend analysis, consistency evaluation, and attentiveness insights across the selected course.", url: "screenshots/Classtrix/21.png" }
            ]
        },
        diabetes: {
            title: "Diabetes Risk Prediction System",
            shortDesc: "AI-powered healthcare application trained on 100,000 patient records to predict diabetes risk with 96.8% accuracy.",
            icon: "ph-heartbeat",
            tech: ["Python", "XGBoost", "PyQt5", "Scikit-Learn"],
            github: "https://github.com/PraneethGowdaK/Diabetes-Risk-Prediction-System",
            demo: "#",
            problemTitle: "Project Overview",
            problem: "This desktop application takes patient health indicators as input and predicts diabetes risk in real time. It also shows a confidence score and a feature importance chart so the result is easier to understand.",
            solution: "",
            contributions: [],
            featuresTitle: "Technical Highlights",
            features: [
                "Trained XGBoost classifier",
                "SMOTE used for class balancing",
                "PyQt5 desktop interface",
                "Confidence score output",
                "Feature importance visualization",
                "Fast model loading using pickle"
            ],
            results: [
                "96.8% prediction accuracy",
                "Trained on 100,000 patient records",
                "Under 1 second prediction time"
            ],
            screenshots: [
                {
                    title: "Prediction Dashboard",
                    desc: "Enter patient health indicators and generate a diabetes risk prediction.",
                    url: "screenshots/diabates/1.png"
                },
                {
                    title: "High-Risk Diabetes Detection",
                    desc: "Prediction result indicating elevated diabetes risk with confidence score.",
                    url: "screenshots/diabates/2.png"
                },
                {
                    title: "Low-Risk Assessment",
                    desc: "Prediction result indicating low diabetes risk based on patient health indicators.",
                    url: "screenshots/diabates/3.png"
                },
                {
                    title: "Feature Importance Analysis",
                    desc: "Visualization showing the relative impact of each health factor on model predictions.",
                    url: "screenshots/diabates/4.png"
                }
            ]
        },
        shopnest: {
            title: "ShopNest",
            shortDesc: "A secure e-commerce platform built with Java Servlets, JSP, and MySQL, featuring user authentication, dynamic product management, and session-based shopping cart functionality.",
            icon: "ph-shopping-bag",
            tech: ["Java", "JSP", "Servlets", "MySQL", "JDBC", "Apache Tomcat"],
            github: "https://github.com/PraneethGowdaK/ShopNest",
            demo: "#",
            problemTitle: "The Problem",
            problem: "Small businesses often need a simple and reliable way to manage products and sell online without the complexity and overhead of large-scale e-commerce solutions.",
            solutionTitle: "The Solution",
            solution: "ShopNest provides a lightweight e-commerce platform where users can securely browse products, manage shopping carts, and place orders, while administrators can efficiently manage the product catalog through dedicated management interfaces.",
            featuresTitle: "Technical Highlights",
            features: [
                "<span class=\"point-title\">Secure Authentication</span><span class=\"point-desc\">Implemented user registration and login with SHA-256 password hashing.</span>",
                "<span class=\"point-title\">Session-Based Shopping Cart</span><span class=\"point-desc\">Built a persistent shopping cart using Java HttpSession for seamless user experience.</span>",
                "<span class=\"point-title\">Dynamic Product Catalog</span><span class=\"point-desc\">Fetched and rendered products dynamically from a MySQL database using JDBC.</span>",
                "<span class=\"point-title\">Admin Product Management</span><span class=\"point-desc\">Created administrative interfaces for adding, updating, and removing products.</span>",
                "<span class=\"point-title\">DAO-Based Architecture</span><span class=\"point-desc\">Implemented centralized data access layers to separate business logic from database operations.</span>"
            ],
            results: [
                "Developed a fully functional e-commerce platform supporting complete user workflows from registration to checkout.",
                "Delivered secure authentication, product management, and session-based cart functionality within a modular Java EE architecture.",
                "Built a maintainable backend structure with clean separation between presentation, business logic, and data access layers.",
                "Demonstrated practical experience in full-stack Java development, database design, and server-side state management."
            ],
            horizontalScreenshots: true,
            screenshots: [
                {
                    title: "1. Secure User Registration",
                    desc: "New users can create accounts with secure credential storage and profile information management.",
                    url: "screenshots/shopnest/1.png"
                },
                {
                    title: "2. User Authentication",
                    desc: "Secure login system with session-based authentication and password protection.",
                    url: "screenshots/shopnest/2.png"
                },
                {
                    title: "3. Dynamic Product Catalog",
                    desc: "Products are dynamically fetched from MySQL and displayed through server-rendered JSP pages.",
                    url: "screenshots/shopnest/3.png"
                },
                {
                    title: "4. Session-Based Shopping Cart",
                    desc: "Users can add, manage, and review products with cart data maintained through server-side sessions.",
                    url: "screenshots/shopnest/4.png"
                }
            ]
        }
    };

    const exploreBtns = document.querySelectorAll('.explore-btn');
    const projectModal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    
    if (projectModal && exploreBtns.length > 0) {
        const modalIcon = document.getElementById('modal-icon');
        const modalTitle = document.getElementById('modal-title');
        const modalShortDesc = document.getElementById('modal-short-desc');
        const modalTech = document.getElementById('modal-tech');
        const modalGithub = document.getElementById('modal-link-github');
        const modalDemo = document.getElementById('modal-link-demo');
        const modalProblemSection = document.getElementById('modal-problem-section');
        const modalProblemTitle = document.getElementById('modal-problem-title');
        const modalProblem = document.getElementById('modal-problem');
        const modalSolutionSection = document.getElementById('modal-solution-section');
        const modalSolutionTitle = document.getElementById('modal-solution-title');
        const modalSolution = document.getElementById('modal-solution');
        const modalContributionsSection = document.getElementById('modal-contributions-section');
        const modalContributions = document.getElementById('modal-contributions');
        const modalFeaturesSection = document.getElementById('modal-features-section');
        const modalFeaturesTitle = document.getElementById('modal-features-title');
        const modalFeatures = document.getElementById('modal-features');
        const modalResultsSection = document.getElementById('modal-results-section');
        const modalResults = document.getElementById('modal-results');
        const modalScreenshotsSection = document.getElementById('modal-screenshots-section');
        const modalScreenshots = document.getElementById('modal-screenshots');

        // Setup Modal Scroll Observer
        const modalScrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.15, root: projectModal });

        // Modal scroll progress
        projectModal.addEventListener('scroll', () => {
            if (!scrollProgress) return;
            const totalHeight = projectModal.scrollHeight - projectModal.clientHeight;
            const progressHeight = (projectModal.scrollTop / totalHeight) * 100;
            scrollProgress.style.width = `${progressHeight}%`;
        });

        function openModal(projectId) {
            const data = projectData[projectId];
            if (!data) return;

            // Populate Data
            modalIcon.className = `ph ${data.icon} size-large text-gradient`;
            modalTitle.textContent = data.title;
            if (modalShortDesc) {
                modalShortDesc.textContent = data.shortDesc || "";
                modalShortDesc.style.display = data.shortDesc ? 'block' : 'none';
            }
            
            modalTech.innerHTML = '';
            if (Array.isArray(data.tech)) {
                data.tech.forEach(t => {
                    const span = document.createElement('span');
                    span.textContent = t;
                    modalTech.appendChild(span);
                });
            } else {
                for (const [category, items] of Object.entries(data.tech)) {
                    const group = document.createElement('div');
                    group.className = 'tech-category-group';
                    const title = document.createElement('h5');
                    title.textContent = category;
                    const pills = document.createElement('div');
                    pills.className = 'tech-pills';
                    items.forEach(t => {
                        const span = document.createElement('span');
                        span.textContent = t;
                        pills.appendChild(span);
                    });
                    group.appendChild(title);
                    group.appendChild(pills);
                    modalTech.appendChild(group);
                }
            }

            if (data.problem) {
                if (modalProblemSection) modalProblemSection.style.display = 'block';
                if (modalProblemTitle) modalProblemTitle.textContent = data.problemTitle || "The Challenge";
                modalProblem.textContent = data.problem;
            } else {
                if (modalProblemSection) modalProblemSection.style.display = 'none';
            }

            if (data.solution) {
                if (modalSolutionSection) modalSolutionSection.style.display = 'block';
                if (modalSolutionTitle) modalSolutionTitle.textContent = data.solutionTitle || "The Solution";
                modalSolution.textContent = data.solution;
            } else {
                if (modalSolutionSection) modalSolutionSection.style.display = 'none';
            }
            
            if (modalGithub) {
                if (data.github && data.github !== "#") {
                    modalGithub.href = data.github;
                    modalGithub.style.display = 'inline-flex';
                    modalGithub.target = "_blank";
                } else {
                    modalGithub.style.display = 'none';
                }
            }

            if (modalDemo) {
                if (data.demo && data.demo !== "#") {
                    modalDemo.href = data.demo;
                    modalDemo.style.display = 'inline-flex';
                    modalDemo.classList.remove('disabled-link');
                    modalDemo.target = "_blank";
                    modalDemo.innerHTML = '<i class="ph ph-globe"></i> Live Demo';
                    modalDemo.title = "View Live Demo";
                } else {
                    modalDemo.href = "#";
                    modalDemo.style.display = 'inline-flex';
                    modalDemo.classList.add('disabled-link');
                    modalDemo.removeAttribute('target');
                    modalDemo.innerHTML = '<i class="ph ph-globe"></i> Live Demo (Not Deployed)';
                    modalDemo.title = "Not Yet Deployed";
                }
            }

            // Update quick nav buttons visibility and sync names with section headings
            const quickNavBtns = document.querySelectorAll('.quick-nav-btn');
            let firstVisibleBtn = null;
            quickNavBtns.forEach(btn => {
                btn.classList.remove('active'); // Reset active state
                const targetId = btn.getAttribute('data-target');
                let isVisible = false;
                
                if (targetId === 'modal-problem-section') {
                    isVisible = !!data.problem;
                    if (isVisible) btn.textContent = data.problemTitle || 'The Challenge';
                }
                if (targetId === 'modal-solution-section') {
                    isVisible = !!data.solution;
                    if (isVisible) btn.textContent = data.solutionTitle || 'The Solution';
                }
                if (targetId === 'modal-screenshots-section') {
                    isVisible = !!(data.screenshots && data.screenshots.length > 0);
                    if (isVisible) btn.textContent = 'Walkthrough';
                }
                if (targetId === 'modal-features-section') {
                    isVisible = !!(data.features && data.features.length > 0);
                    if (isVisible) btn.textContent = data.featuresTitle || 'Key Features';
                }
                if (targetId === 'modal-results-section') {
                    isVisible = !!(data.results && data.results.length > 0);
                    if (isVisible) btn.textContent = data.resultsTitle || 'Results';
                }
                if (targetId === 'modal-contributions-section') {
                    isVisible = !!(data.contributions && data.contributions.length > 0);
                    if (isVisible) btn.textContent = data.contributionsTitle || 'My Contributions';
                }
                
                btn.style.display = isVisible ? 'flex' : 'none';
                if (isVisible && !firstVisibleBtn) firstVisibleBtn = btn;
            });
            if (firstVisibleBtn) firstVisibleBtn.classList.add('active');
            
            if (modalContributionsSection && modalContributions) {
                if (data.contributions && data.contributions.length > 0) {
                    modalContributionsSection.style.display = 'block';
                    const titleEl = modalContributionsSection.querySelector('h3');
                    if (titleEl) {
                        const iconHtml = '<i class="ph ph-user text-gradient"></i> ';
                        titleEl.innerHTML = iconHtml + (data.contributionsTitle || 'My Contributions');
                    }
                    modalContributions.innerHTML = '';
                    data.contributions.forEach(c => {
                        const li = document.createElement('li');
                        li.innerHTML = c;
                        modalContributions.appendChild(li);
                    });
                } else {
                    modalContributionsSection.style.display = 'none';
                }
            }

            if (modalFeaturesSection && modalFeatures) {
                if (data.features && data.features.length > 0) {
                    modalFeaturesSection.style.display = 'block';
                    if (modalFeaturesTitle) modalFeaturesTitle.textContent = data.featuresTitle || "Key Features";
                    modalFeatures.innerHTML = '';
                    data.features.forEach(f => {
                        const li = document.createElement('li');
                        li.innerHTML = f;
                        modalFeatures.appendChild(li);
                    });
                } else {
                    modalFeaturesSection.style.display = 'none';
                }
            }
            
            if (modalResultsSection && modalResults) {
                if (data.results && data.results.length > 0) {
                    modalResultsSection.style.display = 'block';
                    modalResults.innerHTML = '';
                    data.results.forEach(r => {
                        const li = document.createElement('li');
                        li.innerHTML = r;
                        modalResults.appendChild(li);
                    });
                } else {
                    modalResultsSection.style.display = 'none';
                }
            }

            if (modalScreenshotsSection && modalScreenshots) {
                if (data.screenshots && data.screenshots.length > 0) {
                    modalScreenshotsSection.style.display = 'block';
                    modalScreenshots.innerHTML = '';
                    
                    const skipBtn = document.getElementById('skip-to-highlights-btn');
                    if (skipBtn) {
                        if (data.screenshots.length > 3) {
                            skipBtn.style.display = 'flex';
                            skipBtn.onclick = () => {
                                const featuresSection = document.getElementById('modal-features-section');
                                if (featuresSection) {
                                    const headerOffset = 90;
                                    const elementPosition = featuresSection.getBoundingClientRect().top;
                                    const containerRect = projectModal.getBoundingClientRect();
                                    const offsetPosition = elementPosition - containerRect.top + projectModal.scrollTop - headerOffset;
                                    
                                    projectModal.scrollTo({
                                        top: offsetPosition,
                                        behavior: "smooth"
                                    });
                                }
                            };
                        } else {
                            skipBtn.style.display = 'none';
                        }
                    }
                    
                    data.screenshots.forEach(s => {
                        const card = document.createElement('div');
                        card.className = data.horizontalScreenshots ? 'screenshot-card premium-browser-layout' : 'screenshot-card';
                        card.innerHTML = `
                            <div class="screenshot-info">
                                <h4>${s.title}</h4>
                                <p>${s.desc}</p>
                            </div>
                            <div class="screenshot-img-wrapper" style="aspect-ratio: ${data.horizontalScreenshots ? '16/9' : 'auto'}; background: rgba(0,0,0,0.1);">
                                <img src="${s.url}" alt="${s.title}" loading="lazy" class="magnify-img" style="width: 100%; height: 100%; object-fit: cover;">
                            </div>
                        `;
                        
                        const img = card.querySelector('img.magnify-img');
                        // Use a small delay or check complete to ensure width/height are available for magnifier math
                        if(img.complete) {
                            setupMagnifier(img);
                        } else {
                            img.addEventListener('load', () => setupMagnifier(img));
                        }
                        
                        modalScreenshots.appendChild(card);
                    });
                } else {
                    modalScreenshotsSection.style.display = 'none';
                }
            }

            // Show Modal and instantly force scroll to top
            projectModal.scrollTo({ top: 0, behavior: 'instant' });
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Double ensure scroll position resets after a tiny delay
            setTimeout(() => {
                projectModal.scrollTo({ top: 0, behavior: 'instant' });
            }, 10);

            // Observe scroll reveal sections
            const scrollSections = projectModal.querySelectorAll('.modal-scroll-reveal, .screenshot-card');
            scrollSections.forEach(sec => {
                sec.classList.remove('is-visible');
                modalScrollObserver.observe(sec);
            });
        }

        function closeModal() {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Instantly reset scroll after fade out to prevent smooth scrolling bugs on next open
            setTimeout(() => {
                projectModal.scrollTo({ top: 0, behavior: 'instant' });
            }, 400);
            
            // Reset scroll progress to main window
            if (scrollProgress) {
                const totalHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
                const progressHeight = (window.scrollY / totalHeight) * 100;
                scrollProgress.style.width = `${progressHeight}%`;
                scrollProgress.style.zIndex = '999999';
            }
        }

        exploreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = btn.getAttribute('data-project-id');
                openModal(projectId);
            });
        });

        if(modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        // Close on overlay click (clicking outside the content)
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
        
        // Quick Nav Smooth Scrolling & Active State
        const quickNavBtns = document.querySelectorAll('.quick-nav-btn');
        
        // Setup observer for active states
        const observerOptions = {
            root: projectModal,
            rootMargin: '-20% 0px -70% 0px', // Triggers when section is near the top
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    quickNavBtns.forEach(btn => {
                        if (btn.getAttribute('data-target') === entry.target.id) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        quickNavBtns.forEach(btn => {
            const targetId = btn.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);
            
            if (targetEl) {
                // Short delay to let modal content layout
                setTimeout(() => sectionObserver.observe(targetEl), 500);
            }

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (targetEl && targetEl.style.display !== 'none') {
                    // Update active state immediately on click
                    quickNavBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const headerOffset = 90; // Height of sticky header
                    const elementPosition = targetEl.getBoundingClientRect().top;
                    // Calculate position relative to the scroll container
                    const containerRect = projectModal.getBoundingClientRect();
                    const offsetPosition = elementPosition - containerRect.top + projectModal.scrollTop - headerOffset;
                    
                    projectModal.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });
    }

    // --- Contact Modal Logic ---
    const contactModal = document.getElementById('contact-modal');
    const openContactBtn = document.getElementById('open-contact-modal');
    const closeContactBtn = document.getElementById('contact-modal-close');

    if (contactModal && openContactBtn && closeContactBtn) {
        function openContact() {
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeContact() {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        openContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openContact();
        });

        closeContactBtn.addEventListener('click', closeContact);

        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContact();
            }
        });

        // --- Image Magnifier Logic ---
        function setupMagnifier(img) {
            const glass = document.getElementById("magnifier-glass");
            if (!glass) return;

            let zoom = 2; // Zoom multiplier
            let isMagnifying = false;
            
            img.style.cursor = 'zoom-in';

            const toggleMagnifier = (e) => {
                e.preventDefault();
                isMagnifying = !isMagnifying;
                if (isMagnifying) {
                    glass.style.display = "block";
                    img.style.cursor = 'zoom-out';
                    updateMagnifierPos(e);
                } else {
                    glass.style.display = "none";
                    img.style.cursor = 'zoom-in';
                }
            };

            img.addEventListener("click", toggleMagnifier);
            img.addEventListener("contextmenu", toggleMagnifier);

            img.addEventListener("mouseleave", () => {
                isMagnifying = false;
                glass.style.display = "none";
                img.style.cursor = 'zoom-in';
            });

            img.addEventListener("mousemove", (e) => {
                if (!isMagnifying) return;
                updateMagnifierPos(e);
            });
            
            function updateMagnifierPos(e) {
                e.preventDefault();
                glass.style.backgroundImage = "url('" + img.src + "')";
                glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
                
                let pos = getCursorPos(e);
                let x = pos.x;
                let y = pos.y;
                let w = glass.offsetWidth / 2;
                let h = glass.offsetHeight / 2;
                
                // Prevent the magnifier glass from being positioned outside the image math
                if (x > img.width - (w / zoom)) { x = img.width - (w / zoom); }
                if (x < w / zoom) { x = w / zoom; }
                if (y > img.height - (h / zoom)) { y = img.height - (h / zoom); }
                if (y < h / zoom) { y = h / zoom; }
                
                const rect = img.getBoundingClientRect();
                glass.style.left = (rect.left + window.scrollX + x - w) + "px";
                glass.style.top = (rect.top + window.scrollY + y - h) + "px";
                
                let bw = 3; // border width
                glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
            }

            function getCursorPos(e) {
                let a = img.getBoundingClientRect();
                let x = e.pageX - a.left - window.scrollX;
                let y = e.pageY - a.top - window.scrollY;
                return { x: x, y: y };
            }
        }

        // --- Contact Form Anti-Spam (Rate Limiting) ---
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                let sentHistory = JSON.parse(localStorage.getItem('messageSentHistory') || '[]');
                
                // Filter out timestamps older than 24 hours
                const oneDayMs = 24 * 60 * 60 * 1000;
                const now = Date.now();
                sentHistory = sentHistory.filter(timestamp => (now - timestamp) < oneDayMs);
                
                if (sentHistory.length >= 5) {
                    e.preventDefault();
                    alert('You have reached the maximum limit of 5 messages per day. Please try again tomorrow.');
                    return;
                }
                
                // Save the current timestamp on submission
                sentHistory.push(now);
                localStorage.setItem('messageSentHistory', JSON.stringify(sentHistory));
            });
        }
    }
});

// Fix for page freeze when hitting the "Back" button after form submission
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        document.body.style.overflow = '';
        const modals = document.querySelectorAll('.full-modal-overlay');
        modals.forEach(m => m.classList.remove('active'));
    }
});
