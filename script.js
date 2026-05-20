// STRAND BUTTON ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
// TOGGLE BUTTONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
            if (row.classList.contains(subject))    { row.style.display = 'table-row';  }
            else                                    { row.style.display = 'none';       }
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
// GRADE INPUT VALIDATION /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initGradeValidation() {
    const gradeInputs = document.querySelectorAll('.grade-input');
    
    gradeInputs.forEach(input => {
        // Prevent letters and special characters
        input.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[0-9.]/.test(char) && e.which !== 8 && e.which !== 46) {
                e.preventDefault();
            }
        });
        
        // Validate on input
        input.addEventListener('input', function() {
            let value = this.value;
            value = value.replace(/[^0-9.]/g, '');
            const parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }
            if (parts.length === 2 && parts[1].length > 2) {
                value = parseFloat(value).toFixed(2);
            }
            this.value = value;
        });
        
        // Validate on blur
        input.addEventListener('blur', function() {
            let value = parseFloat(this.value);
            
            if (isNaN(value)) {
                this.value = '';
                this.style.border = '1px solid #B81A1A';
                showInlineError(this, 'Please enter a grade');
            } else if (value < 75) {
                this.value = 75;
                this.style.border = '1px solid #B81A1A';
                showInlineError(this, 'Minimum grade is 75');
            } else if (value > 100) {
                this.value = 100;
                this.style.border = '1px solid #B81A1A';
                showInlineError(this, 'Maximum grade is 100');
            } else {
                clearInlineError(this);
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.border = '';
            clearInlineError(this);
        });
    });
    
    function showInlineError(input, message) {
        clearInlineError(input);
        const error = document.createElement('div');
        error.className = 'grade-error';
        error.style.color = '#B81A1A';
        error.style.fontSize = '11px';
        error.style.letterSpacing = '1px';
        error.style.fontStyle = 'italic';
        error.style.marginTop = '4px';
        error.textContent = message;
        input.parentNode.appendChild(error);
    }
    
    function clearInlineError(input) {
        const parent = input.parentNode;
        const existingError = parent.querySelector('.grade-error');
        if (existingError) existingError.remove();
    }
}
// SAVE GRADES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function saveAllGrades() {
    const grades = {};
    let missingGrades = [];
    let invalidGrades = [];
    
    document.querySelectorAll('.grade-input').forEach(input => {
        const row = input.closest('tr');
        const subjectCell = row.querySelector('td:first-child');
        if (subjectCell) {
            let subjectName = subjectCell.textContent.trim();
            subjectName = subjectName.replace(/\s+/g, ' ').trim();
            const grade = parseFloat(input.value);
            
            if (isNaN(grade)) {
                missingGrades.push(subjectName);
                input.style.border = '1px solid #943B3B';
            }
            else if (grade < 75 || grade > 100) {
                invalidGrades.push(`${subjectName} (${grade})`);
                input.style.border = '1px solid #943B3B';
            }
            else {
                grades[subjectName] = grade;
            }
        }
    });
    
    // Show error message if there are issues
    if (missingGrades.length > 0 || invalidGrades.length > 0) {
        let errorMsg = '';
        if (missingGrades.length > 0) {
            errorMsg += `Missing grades for:\n${missingGrades.slice(0, 5).join('\n')}`;
            if (missingGrades.length > 5) errorMsg += `\n... and ${missingGrades.length - 5} more`;
        }
        if (invalidGrades.length > 0) {
            if (errorMsg) errorMsg += '\n\n';
            errorMsg += `Invalid grades (must be 75-100):\n${invalidGrades.join('\n')}`;
        }
        alert(errorMsg);
        return;
    }
    
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
    
    window.location.href = '../results.html';
}
// NEXT BUTTON //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initNextButton() {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            saveAllGrades();
        });
    }
}
// RULE BASED FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    if (grade >= 85) return 22;
    if (grade >= 80) return 17;
    if (grade >= 75) return 12;
    return 8;
}
function predictSASEAptitude(grade) {
    if (grade >= 90) return 25;
    if (grade >= 85) return 20;
    if (grade >= 80) return 15;
    if (grade >= 75) return 12;
    return 10;
}
// FALLBACK FUNCTION ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function predictFallback(subjectType, grades) {
    const mathGrade = grades['General Mathematics'] || 85;
    const englishGrade = grades['Oral Communication in Context'] || 
                        grades['Reading and Writing Skills'] || 85;
    const scienceGrade = grades['Earth and Life Science'] || 
                        grades['General Biology 1'] || 85;
    const aptitudeGrade = grades['General Mathematics'] || 85;
    
    if (subjectType === 'math') return predictSASEMath(mathGrade);
    if (subjectType === 'language') return predictSASELanguage(englishGrade);
    if (subjectType === 'science') return predictSASEScience(scienceGrade);
    if (subjectType === 'aptitude') return predictSASEAptitude(aptitudeGrade);
    return 12;
}
// AI MODEL /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let saseAI = null;
let aiLoaded = false;

async function loadAIModel() {
    try {
        console.log(`🔄 Loading AI model...`);
        const response = await fetch(`sase_model.json?v=${Date.now()}`);
        
        if (!response.ok) throw new Error('File not found');
        
        saseAI = await response.json();
        aiLoaded = true;
        console.log(`✅ AI Model loaded! Trained on ${saseAI.trained_on} students`);
        console.log(`   Math R²: ${saseAI.r2_scores.math}`);
        console.log(`   Language R²: ${saseAI.r2_scores.language}`);
        console.log(`   Science R²: ${saseAI.r2_scores.science}`);
        console.log(`   Aptitude R²: ${saseAI.r2_scores.aptitude}`);
        
        return true;
    } catch (error) {
        console.log('⚠️ AI model not found, using rule-based');
        aiLoaded = false;
        return false;
    }
}
function predictWithAI(subjectType, grades) {
    if (!saseAI) return predictFallback(subjectType, grades);
    
    const model = saseAI[subjectType];
    if (!model) return predictFallback(subjectType, grades);
    
    let prediction = model.baseline;
    
    for (let i = 0; i < model.features.length; i++) {
        const subject = model.features[i];
        const grade = grades[subject] || 85;
        const adjustment = model.adjustments ? model.adjustments[i] : model.importance[i] * 0.5;
        prediction += (grade - 85) * adjustment;
    }
    
    let maxScore = 40;
    if (subjectType === 'language') maxScore = 80;
    if (subjectType === 'science') maxScore = 30;
    if (subjectType === 'aptitude') maxScore = 30;
    
    return Math.min(maxScore, Math.max(0, Math.round(prediction)));
}
// RESULTS PAGE /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function initResultsPage() {
    if (!document.getElementById('score-display')) return;
    
    console.log('📊 Initializing results page...');
    await loadAIModel();
    
    const savedGrades = JSON.parse(localStorage.getItem('studentGrades') || '{}');
    console.log('📚 Loaded grades:', savedGrades);
    
    const scores = {
        math: predictWithAI('math', savedGrades),
        language: predictWithAI('language', savedGrades),
        science: predictWithAI('science', savedGrades),
        aptitude: predictWithAI('aptitude', savedGrades)
    };
    
    const totalScore = scores.math + scores.language + scores.science + scores.aptitude;
    console.log('Final AI Scores:', scores);
    
    const aiStatusElem = document.getElementById('aiStatus');
    if (aiStatusElem) {
        if (aiLoaded && saseAI) {
            aiStatusElem.innerHTML = `AI Active | Trained on ${saseAI.trained_on} students<br>
            Math R²: ${saseAI.r2_scores?.math || 'N/A'} | Lang: ${saseAI.r2_scores?.language || 'N/A'}`;
            aiStatusElem.style.cssText = 'background:#d4edda; padding:8px; border-radius:5px;';
        }
        else {
            aiStatusElem.innerHTML = `Using rule-based predictions (AI model not loaded)`;
            aiStatusElem.style.cssText = 'color:#943B3B; background:#fff3cd; padding:8px; border-radius:5px;';
        }
    }
    
    const mathScore = document.getElementById('math-score');
    const englishScore = document.getElementById('english-score');
    const scienceScore = document.getElementById('science-score');
    const aptitudeScore = document.getElementById('aptitude-score');
    const scoreDisplay = document.getElementById('score-display');
    
    const duration = 2500;
    const startTime = performance.now();
    
    function easeOutQuart(x) { return 1 - Math.pow(1 - x, 4); }
    
    function animateScores(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutQuart(progress);
        
        mathScore.textContent = `${Math.round(scores.math * easedProgress)} / 40`;
        englishScore.textContent = `${Math.round(scores.language * easedProgress)} / 80`;
        scienceScore.textContent = `${Math.round(scores.science * easedProgress)} / 30`;
        aptitudeScore.textContent = `${Math.round(scores.aptitude * easedProgress)} / 30`;
        scoreDisplay.textContent = `${Math.round(totalScore * easedProgress)} / 180`;
        
        if (progress < 1) requestAnimationFrame(animateScores);
    }

    // Generate and display advice
    const adviceList = generateAdvice(scores, savedGrades);
    const adviceContainer = document.getElementById('advice-content');
    if (adviceContainer) {
        adviceContainer.innerHTML = adviceList;  // No need for .map() since it's already HTML
    }
    requestAnimationFrame(animateScores);
    
    const predictAgainBtn = document.getElementById('predict-again');
    if (predictAgainBtn) {
        // Remove any existing event listeners to prevent conflicts
        const newBtn = predictAgainBtn.cloneNode(true);
        predictAgainBtn.parentNode.replaceChild(newBtn, predictAgainBtn);
        newBtn.addEventListener('click', () => window.location.href = '/SASE/index.html');
    }
}
// INITIALIZE ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.toggle-btn')) {
        initToggleButtons();
        initNextButton();
        initGradeValidation();  // ← Added this
    }
    
    if (document.getElementById('score-display')) {
        initResultsPage();
    }
});
// PERSONALIZED ADVICE //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function generateAdvice(scores, subjectGrades) {
    // Create array of SASE sections with their scores
    const saseSections = [
        { name: 'Math', score: scores.math, maxScore: 40, icon: '',
          highThreshold: 30, lowThreshold: 10,
          highMessage: 'Strong quantitative reasoning.',
          lowMessage: 'Focus on mastering basic concepts and formulas.' },
        { name: 'Language', score: scores.language, maxScore: 80, icon: '',
          highThreshold: 65, lowThreshold: 30,
          highMessage: 'Excellent reading comprehension and vocabulary.',
          lowMessage: 'Practice reading comprehension and vocabulary.' },
        { name: 'Science', score: scores.science, maxScore: 30, icon: '',
          highThreshold: 25, lowThreshold: 12,
          highMessage: 'Great analytical and scientific thinking.',
          lowMessage: 'Review basic scientific concepts and principles.' },
        { name: 'Aptitude', score: scores.aptitude, maxScore: 30, icon: '',
          highThreshold: 25, lowThreshold: 12,
          highMessage: 'Strong problem-solving and logical reasoning.',
          lowMessage: 'Practice logical reasoning puzzles and pattern recognition.' }
    ];
    
    // Find strongest and weakest
    let strongest = saseSections.reduce((max, section) => 
        (section.score > max.score) ? section : max, saseSections[0]);
    let weakest = saseSections.reduce((min, section) => 
        (section.score < min.score) ? section : min, saseSections[0]);
    
    let html = '';
    // STRONGEST & WEAKEST //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    html += `<div class="feedback-row">`;
    
    // Strongest card
    html += `<div class="feedback-card strongest">
        <div class="feedback-card-title">YOUR STRONGEST AREA</div>
        <div class="feedback-card-score">${strongest.name}: ${strongest.score}/${strongest.maxScore}</div>
        <div class="feedback-card-message">${strongest.highMessage}</div>
    </div>`;
    
    // Weakest card
    if (weakest.score < weakest.lowThreshold) {
        html += `<div class="feedback-card weakest">
            <div class="feedback-card-title">AREA TO IMPROVE</div>
            <div class="feedback-card-score">${weakest.name}: ${weakest.score}/${weakest.maxScore}</div>
            <div class="feedback-card-message">${weakest.lowMessage}</div>
        </div>`;
    }
    else {
        // Show second strongest if no weak area
        let secondStrongest = saseSections.filter(s => s.name !== strongest.name)
            .reduce((max, s) => (s.score > max.score) ? s : max, saseSections[1]);
        html += `<div class="feedback-card">
            <div class="feedback-card-title">YOUR SECOND STRONGEST</div>
            <div class="feedback-card-score">${secondStrongest.name}: ${secondStrongest.score}/${secondStrongest.maxScore}</div>
            <div class="feedback-card-message">Keep building on this momentum!</div>
        </div>`;
    }
    
    html += `</div>`;
    
    // COMPARISON AND TIPS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    html += `<div class="feedback-two-col">`;
    
    // LEFT COLUMN: comparison to average
    html += `<div class="feedback-col">
        <div class="feedback-col-title">COMPARED TO AVERAGE</div>`;
    
    const avgScores = { math: 14, language: 52, science: 13, aptitude: 14 };
    
    for (const section of saseSections) {
        const sectionKey = section.name.toLowerCase();
        const avg = avgScores[sectionKey];
        const diff = section.score - avg;
        let statusClass = 'average';
        let statusText = 'At average level';
        let arrow = '';
        
        if (diff > 5) {
            statusClass = 'above';
            statusText = `+${diff} above average`;
            arrow = '';
        }
        else if (diff < -5) {
            statusClass = 'below';
            statusText = `${diff} below average`;
            arrow = '';
        }
        else {
            statusText = 'At average level';
            arrow = '';
        }
        
        html += `<div class="comparison-item ${statusClass}">
            <span>${section.name}</span>
            <span>${statusText}</span>
        </div>`;
    }
    
    html += `</div>`;
    
    // RIGHT COLUMN: study tips
    html += `<div class="feedback-col">
        <div class="feedback-col-title">RECOMMENDED FOCUS</div>`;
    
    // tips based on weakest area
    let tips = [];
    if (weakest.name === 'Math') {
        tips = [
            'Review algebra, fractions, and basic operations daily',
            'Practice word problems and mental math exercises',
            'Use Khan Academy for targeted practice'
        ];
    } 
    else if (weakest.name === 'Language') {
        tips = [
            'Read at least 30 minutes daily to build vocabulary',
            'Practice summarizing paragraphs in your own words',
            'Take practice reading comprehension tests'
        ];
    }
    else if (weakest.name === 'Science') {
        tips = [
            'Create flashcards for scientific terms and concepts',
            'Watch educational videos on basic science topics',
            'Practice interpreting graphs and data tables'
        ];
    }
    else {
        tips = [
            'Solve logic puzzles (Sudoku, grid puzzles) weekly',
            'Practice pattern recognition and sequence completion',
            'Take online abstract reasoning practice tests'
        ];
    }
    
    for (let i = 0; i < tips.length; i++) {
        let bullet = '';
        if (i === 0) bullet = '→';
        else if (i === 1) bullet = '→';
        else bullet = '→';
        
        html += `<div class="tip-item">
            <span class="tip-bullet">${bullet}</span>
            <span>${tips[i]}</span>
        </div>`;
    }
    
    html += `</div>`; // Close right column
    html += `</div>`; // Close feedback-two-col
    return html;
}
