// STRAND BUTTON ////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    const strandBtns = document.querySelectorAll('.strand-btn');
    
    strandBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get the strand from data attribute or text content
            const strand = this.dataset.strand || this.textContent.trim().toLowerCase();
            
            // Navigate to the corresponding HTML page
            switch(strand) {
                case 'stem':
                    window.location.href = '/../strand/stem.html';
                    break;
                case 'tvl':
                    window.location.href = '/strand/tvl.html';
                    break;
                case 'humms':
                    window.location.href = '/strand/humms.html';
                    break;
                default:
                    console.log('Unknown strand:', strand);
            }
        });
    });
});

// TOGGLE BUTTON AND NEXT BUTTON ////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const gradeLevel = document.querySelector('.subtitle');
    const grade11Table = document.getElementById('grade11-table');
    const grade12Table = document.getElementById('grade12-table');
    const nextBtn = document.getElementById('next-btn');
    
    // State to track which grade is currently showing
    let isGrade11 = true;

    // Function to update semester rows visibility for current table
    function updateSemesterDisplay(semester) {
        // Get the currently visible table's rows
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
            // Remove active class from all buttons
            toggleBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const semester = this.getAttribute('data-sem');
            updateSemesterDisplay(semester);
        });
    });

    // Function to validate if all grade inputs in CURRENT table are filled
    function validateCurrentTableGrades() {
        // Only validate the currently visible table
        const currentTable = isGrade11 ? grade11Table : grade12Table;
        
        // Only get inputs from visible rows in the current table
        const visibleRows = currentTable.querySelectorAll('tbody tr[style="display: none;"]');
        const visibleInputs = [];
        
        // Get all inputs in the current table
        const allInputsInCurrentTable = currentTable.querySelectorAll('.grade-input');
        
        // Filter to only include inputs in visible rows
        allInputsInCurrentTable.forEach(input => {
            const row = input.closest('tr');
            // Check if the row is visible (not display: none)
            if (row.style.display !== 'none') {
                visibleInputs.push(input);
            }
        });
        
        let allFilled = true;
        let firstEmpty = null;
        
        visibleInputs.forEach(input => {
            // Reset border color
            input.style.borderColor = '#ccc';
            
            if (!input.value || input.value.trim() === '') {
                allFilled = false;
                input.style.borderColor = 'red';
                if (!firstEmpty) firstEmpty = input;
            }
        });
        
        // Scroll to first empty input if any
        if (firstEmpty) {
            firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return allFilled;
    }

    // Next/Proceed button click handler
    nextBtn.addEventListener('click', function() {
        if (isGrade11) {
            // Validate ONLY Grade 11 visible inputs before proceeding
            if (!validateCurrentTableGrades()) {
                alert('Please fill in all visible Grade 11 grade fields before proceeding.');
                return;
            }
            
            // Switch to Grade 12
            grade11Table.style.display = 'none';
            grade12Table.style.display = 'table';
            gradeLevel.textContent = 'GRADE 12';
            this.textContent = 'PROCEED TO RESULTS';
            
            // Reset to 1st semester view for Grade 12
            const firstSemBtn = document.querySelector('[data-sem="1st"]');
            firstSemBtn.click();
            
            isGrade11 = false;
        } else {
            // Validate ONLY Grade 12 visible inputs before proceeding to results
            if (!validateCurrentTableGrades()) {
                alert('Please fill in all visible Grade 12 grade fields before proceeding.');
                return;
            }
            
            // Navigate to results page
            window.location.href = '/../results.html';
        }
    });

    // Add real-time validation styling
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
});

// SHOW PREDCITED SCORES ////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
            // Generate random scores within reasonable ranges
            const scores = {
                math: Math.floor(Math.random() * (35 - 15 + 1)) + 15,        // 15-35 out of 40
                english: Math.floor(Math.random() * (70 - 40 + 1)) + 40,     // 40-70 out of 80
                science: Math.floor(Math.random() * (25 - 10 + 1)) + 10,     // 10-25 out of 30
                aptitude: Math.floor(Math.random() * (25 - 10 + 1)) + 10     // 10-25 out of 30
            };
            
            // Calculate total score
            const totalScore = scores.math + scores.english + scores.science + scores.aptitude;
            
            // Get all display elements
            const scoreDisplay = document.getElementById('score-display');
            const mathScore = document.getElementById('math-score');
            const englishScore = document.getElementById('english-score');
            const scienceScore = document.getElementById('science-score');
            const aptitudeScore = document.getElementById('aptitude-score');
            
            // Animation duration in milliseconds
            const duration = 2500;
            const startTime = performance.now();
            
            // Easing function for smooth animation
            function easeOutQuart(x) {
                return 1 - Math.pow(1 - x, 4);
            }
            
            function animateScores(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const easedProgress = easeOutQuart(progress);
                
                // Update each subject score
                mathScore.textContent = `${Math.round(scores.math * easedProgress)} / 40`;
                englishScore.textContent = `${Math.round(scores.english * easedProgress)} / 80`;
                scienceScore.textContent = `${Math.round(scores.science * easedProgress)} / 30`;
                aptitudeScore.textContent = `${Math.round(scores.aptitude * easedProgress)} / 30`;
                
                // Update total score
                const currentTotal = Math.round(totalScore * easedProgress);
                scoreDisplay.textContent = `${currentTotal} / 180`;
                
                if (progress < 1) {
                    requestAnimationFrame(animateScores);
                }
            }
            
            // Start animation
            requestAnimationFrame(animateScores);
            
            // Add click handler for "INPUT ANOTHER" button
            document.getElementById('predict-again').addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        });
