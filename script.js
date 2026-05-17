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
                default:
                    console.log('Unknown strand:', strand);
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
// PREDICTION FUNCTIONS
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
// RESULTS PAGE - Display animated scores
// ============================================
function initResultsPage() {
    if (!document.getElementById('score-display')) return;
    
    const savedGrades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    const strand = localStorage.getItem('studentStrand') || 'STEM';
    
    console.log('Loaded grades:', savedGrades);
    console.log('Strand:', strand);
    
    const mathGrade = savedGrades['General Mathematics'] || 85;
    const englishGrade = savedGrades['Oral Communication in Context'] || 
                        savedGrades['Reading and Writing Skills'] || 85;
    const scienceGrade = savedGrades['Earth and Life Science'] || 
                        savedGrades['General Biology 1'] || 85;
    
    const scores = {
        math: predictSASEMath(mathGrade),
        english: predictSASELanguage(englishGrade),
        science: predictSASEScience(scienceGrade),
        aptitude: predictSASEAptitude(mathGrade)
    };
    
    const totalScore = scores.math + scores.english + scores.science + scores.aptitude;
    
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