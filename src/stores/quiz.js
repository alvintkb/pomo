import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchtaskList, fetchSubjects, fetchQuestions, createtaskList, fetchLessons } from '../api/quizApi';
/**
 * Standalone recordAnswer function
 */
export async function recordAnswer(question_id, is_correct, time_taken, lesson_id, student_id) {
    try {
        const input = {
            is_correct,
            time_taken,
            lesson: lesson_id,
            question: question_id,
            student: student_id,
        };
        const createdProgress = await createtaskList(input);
        return createdProgress;
    }
    catch (error) {
        console.error('Error recording answer:', error);
        throw error;
    }
}
export const useQuizStore = defineStore('quiz', () => {
    // State
    const studentId = ref(null);
    const progress = ref([]);
    const questions = ref([]);
    const currentQuestionIndex = ref(0);
    const lessons = ref([]); // Add lessons state
    const subjects = ref([]);
    const currentSubjectId = ref(null); // Add this ref
    /**
     * Initializes the student ID.
     */
    const initializeStudentId = async () => {
        let storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            try {
                storedUserId = '1'; // Default user ID for testing
                console.warn('No studentId found, using default ID:', storedUserId);
            }
            catch (error) {
                console.error('Error fetching user ID:', error);
                storedUserId = '1';
            }
        }
        if (storedUserId) {
            studentId.value = storedUserId;
            localStorage.setItem('userId', storedUserId);
        }
        else {
            throw new Error('Failed to initialize studentId');
        }
    };
    /**
     * Fetches the student's progress from the backend.
     */
    const loadProgress = async () => {
        try {
            if (!studentId.value) {
                await initializeStudentId();
                if (!studentId.value) {
                    throw new Error('No studentId available for fetching progress');
                }
            }
            console.log('Fetching progress for studentId:', studentId.value);
            progress.value = await fetchtaskList(studentId.value);
        }
        catch (error) {
            console.error('Store loadProgress error:', error);
            throw error;
        }
    };
    /**
     * Fetches the list of questions from the backend.
     */
    const loadQuestions = async (lessonId = null) => {
        try {
            questions.value = await fetchQuestions(lessonId);
        }
        catch (error) {
            console.error('Store loadQuestions error:', error);
            throw error;
        }
    };
    /**
     * Fetches the list of subjects.
     */
    const loadSubjects = async () => {
        try {
            subjects.value = await fetchSubjects();
        }
        catch (error) {
            console.error('Store loadSubjects error:', error);
            throw error;
        }
    };
    /**
     * Fetches the list of lessons from the backend.  // Added loadLessons
     */
    const loadLessons = async (subjectId) => {
        try {
            if (!subjectId) {
                throw new Error('subjectId is required to fetch lessons');
            }
            lessons.value = await fetchLessons(subjectId);
            currentSubjectId.value = subjectId; //store the subject
        }
        catch (error) {
            console.error('Store loadLessons error:', error);
            throw error;
        }
    };
    /**
     * Retrieves the next unanswered question.
     */
    const getNextQuestion = () => {
        if (!questions.value.length) {
            console.warn('No questions available');
            return null;
        }
        const answeredQuestionIds = progress.value.map((p) => p.question_id);
        const unansweredQuestions = questions.value.filter((q) => !answeredQuestionIds.includes(q.id));
        if (unansweredQuestions.length) {
            currentQuestionIndex.value = questions.value.findIndex((q) => q.id === unansweredQuestions[0].id);
            return unansweredQuestions[0];
        }
        console.warn('All questions answered');
        currentQuestionIndex.value = 0;
        return questions.value[0] || null;
    };
    /**
     * Records the student's answer for the current question.
     */
    const recordAnswerInStore = async (question_id, is_correct, time_taken, lesson_id, student_id) => {
        try {
            if (!studentId.value) {
                throw new Error('Cannot record answer: studentId is not set');
            }
            const currentQuestion = questions.value.find((q) => q.id === question_id);
            if (!currentQuestion || !currentQuestion.lesson_id) {
                throw new Error('Lesson ID not found for the current question');
            }
            const actualLessonId = currentQuestion.lesson_id;
            const createdProgress = await recordAnswer(question_id, is_correct, time_taken, actualLessonId, student_id);
            progress.value.push(createdProgress);
        }
        catch (error) {
            console.error('Error recording answer:', error);
            throw error;
        }
    };
    const saveQuestion = async (newQuestion) => {
        try {
            //  Call the API to create the question
            // const createdQuestion = await createQuestion(newQuestion); //Removed: createQuestion not defined
            // questions.value.push(createdQuestion);  // Add to the local store
            console.log("Question Saved:", newQuestion);
        }
        catch (error) {
            console.error('Error creating question:', error);
            throw error; // Re-throw to be caught by the component
        }
    };
    const getProgressStats = computed(() => {
        if (!progress.value || progress.value.length === 0) {
            return [];
        }
        const lessonStats = new Map();
        progress.value.forEach(p => {
            const lesson = lessons.value.find(l => l.id === p.lesson_id);
            const lesson_title = lesson ? lesson.title : 'Unknown Lesson';
            if (lessonStats.has(p.lesson_id)) {
                const stat = lessonStats.get(p.lesson_id);
                stat.total++;
                stat.correct += p.is_correct ? 1 : 0;
                stat.total_time += p.time_taken || 0;
                lessonStats.set(p.lesson_id, stat);
            }
            else {
                lessonStats.set(p.lesson_id, {
                    lesson_id: p.lesson_id,
                    lesson_title,
                    total: 1,
                    correct: p.is_correct ? 1 : 0,
                    total_time: p.time_taken || 0,
                });
            }
        });
        return Array.from(lessonStats.values()).map(stat => ({
            ...stat,
            avg_time: stat.total > 0 ? stat.total_time / stat.total : 0,
        }));
    });
    const loadFailedQuestions = () => {
        const failedQuestions = progress.value
            .filter(p => !p.is_correct)
            .map(p => questions.value.find(q => q.id === p.question_id))
            .filter((q) => q !== undefined); //remove undefined
        if (failedQuestions.length > 0) {
            questions.value = failedQuestions;
            currentQuestionIndex.value = 0;
        }
        else {
            alert("You have no failed questions");
        }
    };
    return {
        studentId,
        progress,
        questions,
        currentQuestionIndex,
        lessons,
        subjects, // Include subjects in the return
        currentSubjectId,
        initializeStudentId,
        loadProgress,
        loadQuestions,
        loadLessons,
        loadSubjects, // Include loadSubjects in the return
        getNextQuestion,
        recordAnswer: recordAnswerInStore,
        saveQuestion,
        getProgressStats,
        loadFailedQuestions,
    };
});
//# sourceMappingURL=quiz.js.map