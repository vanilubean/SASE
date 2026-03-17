// SINGLE DOMContentLoaded event listener for all functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // STRAND BUTTON - Only runs on pages with strand buttons
    const strandBtns = document.querySelectorAll('.strand-btn');
    if (strandBtns.length > 0) {
        strandBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const strand = this.dataset.strand || this.textContent.trim().toLowerCase();
                
                switch(strand) {
                    case 'stem':
                        window.location.href = '/SASE/strand/stem.html';
                        break;
                    case 'tvl':
                        window.location.href = '/SASE/strand/tvl.html';
                        break;
                    case 'humms':
                        window.location.href = '/SASE/strand/humms.html';
                        break;
                    default:
                        console.log('Unknown strand:', strand);
                }
            });
        });
    }

    // TOGGLE BUTTON AND NEXT BUTTON - Only runs on strand pages
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const grade11Table = document.getElementById('grade11-table');
    const grade12Table = document.getElementById('grade12-table');
    const nextBtn = document.getElementById('next-btn');
    
    // Only run this code if we're on a strand page (has toggle buttons)
    if (toggleBtns.length > 0 && grade11Table && grade12Table && nextBtn) {
        const gradeLevel = document.querySelector('.subtitle');
        let isGrade11 = true;

        // Function to update semester rows visibility
        function updateSemesterDisplay(semester) {
            const currentTable = isGrade11 ? grade11Table : grade12Table;
            const sem1Rows = currentTable.querySelectorAll('.sem-1');
            const sem2Rows = currentTable.querySelectorAll('.sem-2');
            
            if (semester === '1st') {
                sem1Rows.forEach(row => row.style.display = '');
                sem2Rows.forEach(row => row.style.display = 'none');
            } else {
                sem1Rows.forEach(row => row.style.display = 'none');
                sem2Rows.forEach(row => row.style.display = '');
            }
        }

        // Semester toggle click handlers
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                toggleBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const semester = this.getAttribute('data-sem');
                updateSemesterDisplay(semester);
            });
        });

        // Function to validate grades
        function validateCurrentTableGrades() {
            const currentTable = isGrade11 ? grade11Table : grade12Table;
            const allInputsInCurrentTable = currentTable.querySelectorAll('.grade-input');
            const visibleInputs = [];
            
            allInputsInCurrentTable.forEach(input => {
                const row = input.closest('tr');
                if (row.style.display !== 'none') {
                    visibleInputs.push(input);
                }
            });
            
            let allFilled = true;
            let firstEmpty = null;
            
            visibleInputs.forEach(input => {
                input.style.borderColor = '#ccc';
                
                if (!input.value || input.value.trim() === '') {
                    allFilled = false;
                    input.style.borderColor = 'red';
                    if (!firstEmpty) firstEmpty = input;
                }
            });
            
            if (firstEmpty) {
                firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            return allFilled;
        }

        // Next/Proceed button click handler
        nextBtn.addEventListener('click', function() {
            if (isGrade11) {
                if (!validateCurrentTableGrades()) {
                    alert('Please fill in all visible Grade 11 grade fields before proceeding.');
                    return;
                }
                
                grade11Table.style.display = 'none';
                grade12Table.style.display = 'table';
                if (gradeLevel) gradeLevel.textContent = 'GRADE 12';
                this.textContent = 'PROCEED TO RESULTS';
                
                const firstSemBtn = document.querySelector('[data-sem="1st"]');
                if (firstSemBtn) firstSemBtn.click();
                
                isGrade11 = false;
            } else {
                if (!validateCurrentTableGrades()) {
                    alert('Please fill in all visible Grade 12 grade fields before proceeding.');
                    return;
                }
                
                window.location.href = '/SASE/results.html';
            }
        });

        // Real-time validation styling
        const allInputs = document.querySelectorAll('.grade-input');
        allInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value && this.value.trim() !== '') {
                    this.style.borderColor = '#ccc';
                }
            });
        });
        
        // Initialize first semester view
        updateSemesterDisplay('1st');
    }

    // RESULTS PAGE ANIMATION - Only runs on results page
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        // Generate random scores
        const scores = {
            math: Math.floor(Math.random() * (35 - 15 + 1)) + 15,
            english: Math.floor(Math.random() * (70 - 40 + 1)) + 40,
            science: Math.floor(Math.random() * (25 - 10 + 1)) + 10,
            aptitude: Math.floor(Math.random() * (25 - 10 + 1)) + 10
        };
        
        const totalScore = scores.math + scores.english + scores.science + scores.aptitude;
        
        const mathScore = document.getElementById('math-score');
        const englishScore = document.getElementById('english-score');
        const scienceScore = document.getElementById('science-score');
        const aptitudeScore = document.getElementById('aptitude-score');
        
        const duration = 2500;
        const startTime = performance.now();
        
        function easeOutQuart(x) {
            return 1 - Math.pow(1 - x, 4);
        }
        
        function animateScores(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeOutQuart(progress);
            
            if (mathScore) mathScore.textContent = `${Math.round(scores.math * easedProgress)} / 40`;
            if (englishScore) englishScore.textContent = `${Math.round(scores.english * easedProgress)} / 80`;
            if (scienceScore) scienceScore.textContent = `${Math.round(scores.science * easedProgress)} / 30`;
            if (aptitudeScore) aptitudeScore.textContent = `${Math.round(scores.aptitude * easedProgress)} / 30`;
            
            const currentTotal = Math.round(totalScore * easedProgress);
            scoreDisplay.textContent = `${currentTotal} / 180`;
            
            if (progress < 1) {
                requestAnimationFrame(animateScores);
            }
        }
        
        requestAnimationFrame(animateScores);
        
        // "INPUT ANOTHER" button handler
        const predictAgainBtn = document.getElementById('predict-again');
        if (predictAgainBtn) {
            predictAgainBtn.addEventListener('click', function() {
                window.location.href = '/SASE/index.html';
            });
        }
    }
});
