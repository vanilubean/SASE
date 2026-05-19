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
