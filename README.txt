===========================================
SASE SCORE PREDICTION SYSTEM
===========================================

1. PROJECT OVERVIEW
===========================================
This is a web-based system designed to estimate a student's potential performance on the MSU System Admission and Scholarship Examination (MSU-SASE). It uses a machine learning model to analyze your Grade 11 and Grade 12 academic records and generate predicted scores.

2. HOW THE SYSTEM WORKS
===========================================
The system uses a Linear Regression model that was trained on historical academic records and SASE results. When you input your grades, the system applies the learned patterns to provide an estimate of your likely performance.

3. GETTING STARTED
===========================================
1.  Visit the system URL: https://vanilubean.github.io/SASE/
2.  You will be presented with the main dashboard.

4. USING THE SYSTEM
===========================================

Step 1: Select Your Strand
--------------------------
On the main page, you must first select your Senior High School strand.
Available strands:
  * STEM (Science, Technology, Engineering, and Mathematics)
  * ABM (Accountancy, Business, and Management)
  * HUMSS (Humanities and Social Sciences)
  * TVL (Technical-Vocational-Livelihood)

Step 2: Enter Your Academic Records
-----------------------------------
After selecting your strand, you will be directed to the data input interface.
*   **Core Subjects Tab:** Enter your grades for common subjects (e.g., General Mathematics, Oral Communication).
*   **Contextualized Subjects Tab:** Enter your grades for subjects like Practical Research and English for Academic Purposes.
*   **Specialized Subjects Tab:** (Not available for TVL) Enter your grades for strand-specific subjects (e.g., Basic Calculus for STEM, Business Finance for ABM).

Make sure to fill in all required fields accurately.

Step 3: Generate Your Prediction
--------------------------------
Once all grades are entered, the system will process your data. It will then display your results on the "Prediction Result Interface".

Step 4: Understanding Your Results
---------------------------------
The Prediction Result Interface provides:
*   **Overall Predicted SASE Score:** Your estimated total score out of 180.
*   **Predicted Subject Scores:** Your estimated scores for each SASE component:
    *   Mathematics (40 points)
    *   Language (80 points)
    *   Science (30 points)
    *   Aptitude (30 points)
*   **Performance Analysis:** Highlights your strongest academic areas and your weakest area.
*   **Compared to Median:** Shows how your predicted scores compare to the median scores of previous examinees.
*   **Recommended Focus:** Provides a personalized study recommendation for your weakest subject.

5. INTENDED PURPOSE AND LIMITATIONS
===========================================
**Purpose:**
This system is designed as an early assessment tool for students, particularly those without access to formal review programs. It provides data-driven insights to help you identify your strengths and weaknesses and focus your preparation efforts.

**Limitations:**
*   **Indicative Estimate:** The results are predictions, not guarantees of your actual SASE performance.
*   **Data Dependency:** The accuracy of the prediction is limited by the size and scope of the dataset used to train the model.
*   **External Factors:** The system does not account for factors like socioeconomic background, study habits, learning environment, or psychological conditions.

6. FEEDBACK AND SUPPORT
===========================================
This system was developed as an academic project at Mindanao State University - Maigo College of Education, Science and Technology. For any queries, please contact the researchers.

Humaida Ampaso: humaidaampaso@gmail.com
Jerica Grace S. Estose: estose.jericagrace@gmail.com
