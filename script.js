// ============================================
// STRAND BUTTON (Home Page)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const strandBtns = document.querySelectorAll('.strand-btn');
    
    strandBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const strand = this.dataset.strand || this.textContent.trim().toLowerCase();
            
            switch(strand) {
                case 'stem':
                    window.location.href = 'strand/stem.html';
                    break;
                case 'tvl':
                    window.location.href = 'strand/tvl.html';
                    break;
                case 'abm':
                    window.location.href = 'strand/abm.html';
                    break;
                case 'humms':
                    window.location.href = 'strand/humms.html';
                    break;
            }
        });
    });
});

// ============================================
// TOGGLE BUTTONS (Filter subjects by type)
// ============================================
function initToggleButtons() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    if (toggleBtns.length === 0) return;
    
    const gradesTable = document.getElementById('grades-table');
    if (!gradesTable) {
        console.error('grades-table not found!');
        return;
    }
    
    console.log('Toggle buttons found:', toggleBtns.length);
    console.log('Grades table found:', gradesTable);
    
    function updateSubjectDisplay(subject) {
        const allRows = gradesTable.querySelectorAll('tbody tr');
        console.log('Total rows:', allRows.length);
        console.log('Showing subject:', subject);
        
        allRows.forEach(row => {
            if (row.classList.contains(subject)) {
                row.style.display = 'table-row';
                console.log('Showing row:', row.querySelector('td:first-child')?.textContent);
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    // Add click handlers to toggle buttons
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Button clicked:', this.getAttribute('data-sub'));
            
            // Update active state
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show the selected subject category
            const subject = this.getAttribute('data-sub');
            updateSubjectDisplay(subject);
        });
    });
    
    // Initialize - show core subjects
    updateSubjectDisplay('core');
}

// ============================================
// NEXT BUTTON (Save grades and go to results)
// ============================================
function initNextButton() {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            saveAllGrades();
        });
    }
}

// ============================================
// SAVE GRADES TO localStorage
// ============================================
function saveAllGrades() {
    const grades = {};
    
    document.querySelectorAll('.grade-input').forEach(input => {
        const row = input.closest('tr');
        const subjectCell = row.querySelector('td:first-child');
        if (subjectCell) {
            let subjectName = subjectCell.textContent.trim();
            subjectName = subjectName.replace(/\s+/g, ' ').trim();
            const grade = parseFloat(input.value);
            
            if (!isNaN(grade) && grade >= 75 && grade <= 100) {
                grades[subjectName] = grade;
            }
        }
    });
    
    // Get strand from page
    let strand = 'STEM';
    const titleElem = document.querySelector('.title');
    if (titleElem) {
        const titleText = titleElem.textContent;
        if (titleText.includes('STEM')) strand = 'STEM';
        else if (titleText.includes('TVL')) strand = 'TVL';
        else if (titleText.includes('ABM')) strand = 'ABM';
        else if (titleText.includes('HUMMS')) strand = 'HUMMS';
    }
    
    localStorage.setItem('studentGrades', JSON.stringify(grades));
    localStorage.setItem('studentStrand', strand);
    
    console.log('Saved grades:', grades);
    console.log('Strand:', strand);
    
    // Navigate to results
    window.location.href = '../results.html';
}

// ============================================
// RULE-BASED PREDICTION FUNCTIONS (Fallback)
// ============================================
function predictSASEMath(grade) {
    if (grade >= 90) return 38;
    if (grade >= 85) return 32;
    if (grade >= 80) return 26;
    if (grade >= 75) return 20;
    return 15;
}

function predictSASELanguage(grade) {
    if (grade >= 90) return 72;
    if (grade >= 85) return 62;
    if (grade >= 80) return 52;
    if (grade >= 75) return 42;
    return 30;
}

function predictSASEScience(grade) {
    if (grade >= 90) return 27;
    if (grade >= 85) return 22;
    if (grade >= 80) return 17;
    if (grade >= 75) return 12;
    return 8;
}

function predictSASEAptitude(grade) {
    if (grade >= 90) return 22;
    if (grade >= 85) return 18;
    if (grade >= 80) return 15;
    return 12;
}

// ============================================
// FULL AI MODEL (Math, Language, Science)
// ============================================

let saseAI = null;
let useAIForAll = true;  // Set to true to use AI for all sections

async function loadAIModel() {
    try {
        // Try to load the full model first
        let response = await fetch('sase_model_full.json');
        
        if (!response.ok) {
            // Fall back to math-only model
            response = await fetch('sase_model.json');
        }
        
        saseAI = await response.json();
        console.log('✅ AI Model loaded!');
        console.log(`📊 Trained on ${saseAI.trained_on} students`);
        
        if (saseAI.r2_scores) {
            console.log(`📈 Math R²: ${saseAI.r2_scores.math}`);
            console.log(`📈 Language R²: ${saseAI.r2_scores.language}`);
            console.log(`📈 Science R²: ${saseAI.r2_scores.science}`);
        }
        
        if (saseAI.warning) {
            console.warn(saseAI.warning);
        }
        
        return true;
    } catch (error) {
        console.log('⚠️ AI model not found, using fallback rules');
        return false;
    }
}

function predictWithAI(subjectType, grades) {
    if (!saseAI || !useAIForAll) {
        // Fallback to rule-based
        return predictFallback(subjectType, grades);
    }
    
    const model = saseAI[subjectType];
    if (!model) return predictFallback(subjectType, grades);
    
    let prediction = model.baseline;
    
    for (let i = 0; i < model.features.length; i++) {
        const subject = model.features[i];
        const grade = grades[subject] || 85;
        
        let adjustment = model.adjustments ? model.adjustments[i] : model.importance[i] * 0.5;
        prediction += (grade - 85) * adjustment;
    }
    
    // Get max score for this subject
    let maxScore = 40;
    if (subjectType === 'language') maxScore = 80;
    if (subjectType === 'science') maxScore = 30;
    
    // Clamp to valid range
    return Math.min(maxScore, Math.max(0, Math.round(prediction)));
}

function predictFallback(subjectType, grades) {
    const mathGrade = grades['General Mathematics'] || 85;
    const englishGrade = grades['Oral Communication in Context'] || 
                        grades['Reading and Writing Skills'] || 85;
    const scienceGrade = grades['Earth and Life Science'] || 
                        grades['General Biology 1'] || 85;
    
    if (subjectType === 'math') return predictSASEMath(mathGrade);
    if (subjectType === 'language') return predictSASELanguage(englishGrade);
    if (subjectType === 'science') return predictSASEScience(scienceGrade);
    return 15;
}

// Updated results page
async function initResultsPage() {
    if (!document.getElementById('score-display')) return;
    
    await loadAIModel();
    
    const savedGrades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    
    // Use AI for ALL sections
    const scores = {
        math: predictWithAI('math', savedGrades),
        language: predictWithAI('language', savedGrades),
        science: predictWithAI('science', savedGrades),
        aptitude: 12  // Default from your data
    };
    
    const totalScore = scores.math + scores.language + scores.science + scores.aptitude;
    
    // Update AI status
    const aiStatusElem = document.getElementById('aiStatus');
    if (aiStatusElem) {
        if (saseAI && useAIForAll) {
            aiStatusElem.innerHTML = `✅ AI Active (Math/Lang/Science) | Trained on ${saseAI.trained_on} students<br>
            <span style="font-size: 11px;">⚠️ Language & Science AI may be less accurate (need more data)</span>`;
            aiStatusElem.style.color = '#856404';
            aiStatusElem.style.background = '#fff3cd';
        } else {
            aiStatusElem.innerHTML = `⚠️ Using rule-based predictions`;
            aiStatusElem.style.color = 'orange';
        }
    }
    
    // Animate scores (your existing animation code)
    animateScores(scores, totalScore);
}

// Keep your existing rule-based functions as fallbacks
function predictSASEMath(grade) {
    if (grade >= 90) return 35;
    if (grade >= 85) return 25;
    if (grade >= 80) return 15;
    if (grade >= 75) return 10;
    return 8;
}

function predictSASELanguage(grade) {
    if (grade >= 90) return 65;
    if (grade >= 85) return 45;
    if (grade >= 80) return 30;
    if (grade >= 75) return 20;
    return 15;
}

function predictSASEScience(grade) {
    if (grade >= 90) return 27;
    if (grade >= 85) return 20;
    if (grade >= 80) return 14;
    if (grade >= 75) return 10;
    return 8;
}
// ============================================
// RESULTS PAGE - Display animated scores (UPDATED)
// ============================================
async function initResultsPage() {
    if (!document.getElementById('score-display')) return;
    
    // Load AI model first
    await loadAIModel();
    
    const savedGrades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    const strand = localStorage.getItem('studentStrand') || 'STEM';
    
    console.log('Loaded grades:', savedGrades);
    console.log('Strand:', strand);
    
    const mathGrade = savedGrades['General Mathematics'] || 85;
    const englishGrade = savedGrades['Oral Communication in Context'] || 
                        savedGrades['Reading and Writing Skills'] || 85;
    const scienceGrade = savedGrades['Earth and Life Science'] || 
                        savedGrades['General Biology 1'] || 85;
    
    // UPDATED: Use AI for Math, rules for Language and Science
    const scores = {
        math: predictMathWithAI(savedGrades),           // AI-powered (R² = 0.57)
        english: predictSASELanguage(englishGrade),     // Rule-based
        science: predictSASEScience(scienceGrade),      // Rule-based
        aptitude: predictSASEAptitude(mathGrade)        // Rule-based
    };
    
    const totalScore = scores.math + scores.english + scores.science + scores.aptitude;
    
    // Update AI status display if element exists
    const aiStatusElem = document.getElementById('aiStatus');
    if (aiStatusElem) {
        if (saseAI) {
            aiStatusElem.innerHTML = `✅ Math: AI Model (R² = 0.57) | Lang/Sci: Rule-based`;
            aiStatusElem.style.color = 'green';
        } else {
            aiStatusElem.innerHTML = `⚠️ Using rule-based predictions (AI model not loaded)`;
            aiStatusElem.style.color = 'orange';
        }
    }
    
    const mathScore = document.getElementById('math-score');
    const englishScore = document.getElementById('english-score');
    const scienceScore = document.getElementById('science-score');
    const aptitudeScore = document.getElementById('aptitude-score');
    const scoreDisplay = document.getElementById('score-display');
    
    const duration = 2500;
    const startTime = performance.now();
    
    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }
    
    function animateScores(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutQuart(progress);
        
        mathScore.textContent = `${Math.round(scores.math * easedProgress)} / 40`;
        englishScore.textContent = `${Math.round(scores.english * easedProgress)} / 80`;
        scienceScore.textContent = `${Math.round(scores.science * easedProgress)} / 30`;
        aptitudeScore.textContent = `${Math.round(scores.aptitude * easedProgress)} / 30`;
        
        const currentTotal = Math.round(totalScore * easedProgress);
        scoreDisplay.textContent = `${currentTotal} / 180`;
        
        if (progress < 1) {
            requestAnimationFrame(animateScores);
        }
    }
    
    requestAnimationFrame(animateScores);
    
    const predictAgainBtn = document.getElementById('predict-again');
    if (predictAgainBtn) {
        predictAgainBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
}

// ============================================
// INITIALIZE BASED ON PAGE TYPE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Check if this is a strand page (has toggle buttons)
    if (document.querySelector('.toggle-btn')) {
        initToggleButtons();
        initNextButton();
    }
    
    // Check if this is the results page
    if (document.getElementById('score-display')) {
        initResultsPage();
    }
});
