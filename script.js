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
    
    function updateSubjectDisplay(subject) {
        const allRows = gradesTable.querySelectorAll('tbody tr');
        allRows.forEach(row => {
            if (row.classList.contains(subject)) {
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const subject = this.getAttribute('data-sub');
            updateSubjectDisplay(subject);
        });
    });
    
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
    
    window.location.href = '../results.html';
}

// ============================================
// RULE-BASED PREDICTION FUNCTIONS (ACCURATE VERSION)
// ============================================
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

function predictSASEAptitude(grade) {
    return 12;  // Fixed baseline from your data
}

// ============================================
// AI MODEL (Full: Math, Language, Science)
// ============================================
let saseAI = null;

async function loadAIModel() {
    try {
        const response = await fetch('sase_model_full.json');
        
        if (!response.ok) {
            console.log('⚠️ Full model not found, trying math-only model');
            const fallbackResponse = await fetch('sase_model.json');
            saseAI = await fallbackResponse.json();
            console.log('✅ Math-only AI Model loaded!');
        } else {
            saseAI = await response.json();
            console.log('✅ Full AI Model loaded (Math, Language, Science)!');
        }
        
        console.log(`📊 Trained on ${saseAI.trained_on} students`);
        
        if (saseAI.r2_scores) {
            console.log(`📈 Math R²: ${saseAI.r2_scores.math}`);
            console.log(`📈 Language R²: ${saseAI.r2_scores.language}`);
            console.log(`📈 Science R²: ${saseAI.r2_scores.science}`);
        }
        
        return true;
    } catch (error) {
        console.log('⚠️ AI model not found, using rule-based predictions');
        return false;
    }
}

function predictWithAI(subjectType, grades) {
    if (!saseAI) {
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
    
    return Math.min(maxScore, Math.max(0, Math.round(prediction)));
}

// ============================================
// RESULTS PAGE - Display animated scores
// ============================================
async function initResultsPage() {
    if (!document.getElementById('score-display')) return;
    
    // Load AI model first
    await loadAIModel();
    
    const savedGrades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    
    console.log('Loaded grades:', savedGrades);
    
    // Use AI for ALL sections
    const scores = {
        math: predictWithAI('math', savedGrades),
        language: predictWithAI('language', savedGrades),
        science: predictWithAI('science', savedGrades),
        aptitude: 12  // Fixed baseline from your data
    };
    
    const totalScore = scores.math + scores.language + scores.science + scores.aptitude;
    
    // Update AI status display
    const aiStatusElem = document.getElementById('aiStatus');
    if (aiStatusElem) {
        if (saseAI) {
            aiStatusElem.innerHTML = `✅ AI Active (Math/Lang/Science) | Trained on ${saseAI.trained_on} students<br>
            <span style="font-size: 11px;">⚠️ Language & Science AI may be less accurate (need more data)</span>`;
            aiStatusElem.style.color = '#856404';
            aiStatusElem.style.background = '#fff3cd';
            aiStatusElem.style.padding = '8px';
            aiStatusElem.style.borderRadius = '5px';
        } else {
            aiStatusElem.innerHTML = `⚠️ Using rule-based predictions (AI model not loaded)`;
            aiStatusElem.style.color = 'orange';
        }
    }
    
    // DOM elements
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
        englishScore.textContent = `${Math.round(scores.language * easedProgress)} / 80`;
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
