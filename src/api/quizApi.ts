// class quizApi.ts
import { gql } from '@apollo/client/core';
import defaultClient from '../apollo-client';

export const SUBJECTS_QUERY = gql`
  query GetSubjects { 
    subjects {
      data {
        id
        attributes {
          title
          description
        }
      }
    }
  }
`;

// GraphQL Queries
export const LESSONS_QUERY = gql`
  query Lessons($subjectId: ID) {
    lessons(filters: { subject: { id: { eq: $subjectId } } }, pagination: { limit: 1000 }) {
      data {
        id
        attributes {
          title
          description
        }
      }
    }
  }
`;

export const QUESTIONS_QUERY = gql`
  query Questions($lessonId: ID) {
    questions(
      filters: { lesson: { id: { eq: $lessonId } } },
      pagination: { limit: 1000 }
    ) {
      data {
        id
        attributes {
          question_text
          correct_answer
          options
          time_limit
          lesson {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const STUDENT_PROGRESS_QUERY = gql`
  query taskList($studentId: ID!) {
    taskListes(
      filters: { student: { id: { eq: $studentId } } },
      pagination: { limit: 1000 }
    ) {
      data {
        id
        attributes {
          is_correct
          time_taken
          attempt_date
          lesson {
            data {
              id
            }
          }
          question {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

// GraphQL Mutations
export const CREATE_QUESTION_MUTATION = gql`
  mutation CreateQuestion($data: QuestionInput!) {
    createQuestion(data: $data) {
      data {
        id
        attributes {
          question_text
          correct_answer
          options
          time_limit
          lesson {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const CREATE_STUDENT_PROGRESS_MUTATION = gql`
  mutation CreatetaskList($data: taskListInput!) {
    createtaskList(data: $data) {
      data{
        id
        attributes {
          is_correct
          time_taken
          attempt_date
          lesson {
            data {
              id
            }
          }
          question {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

// Interfaces
export interface Lesson {
  id: string;
  title: string;
  description?: string;
}

export interface Subject {
  id: string;
  title: string;
  description?: string;
}

export interface Question {
  id: string;
  question_text: string;
  correct_answer: string;
  options: string[];
  time_limit: number;
  lesson_id: string;
}

export interface taskList {
  id: string;
  is_correct: boolean;
  time_taken?: number;
  attempt_date: string;
  lesson_id: string;
  question_id: string;
}

export interface Subject {
    id: string;
    attributes: {
        title: string;
        description: string;
    }
}

// Fetch Functions
export async function fetchLessons(subjectId: string, client = defaultClient): Promise<Lesson[]> { // Receive subjectId
    try {
        const { data, errors } = await client.query({
            query: LESSONS_QUERY,
            variables: { subjectId }, // Pass subjectId
            fetchPolicy: 'network-only',
        });

        if (errors) {
            throw new Error(`GraphQL errors: ${errors.map((e: any) => e.message).join(', ')}`);
        }

        if (!data?.lessons?.data) {
            throw new Error('No lessons data returned');
        }

        return data.lessons.data.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.attributes.title,
            description: lesson.attributes.description || '',
        }));
    } catch (error) {
        console.error('Error fetching lessons:', error);
        throw error;
    }
}

export async function fetchQuestions(
    lessonId: string | null = null,
    client = defaultClient
): Promise<Question[]> {
    try {
        const { data, errors } = await client.query({
            query: QUESTIONS_QUERY,
            variables: { lessonId },
            fetchPolicy: 'network-only',
        });

        if (errors) {
            throw new Error(`GraphQL errors: ${errors.map((e: any) => e.message).join(', ')}`);
        }

        if (!data?.questions?.data) {
            throw new Error('No questions data returned');
        }

        return data.questions.data.map((question: any) => ({
            id: question.id,
            question_text: question.attributes.question_text,
            correct_answer: question.attributes.correct_answer,
            options: question.attributes.options,
            time_limit: question.attributes.time_limit,
            lesson_id: question.attributes.lesson?.data?.id || '',
        }));
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
}

export async function fetchtaskList(
    studentId: string,
    client = defaultClient
): Promise<taskList[]> {
    try {
        if (!studentId) {
            throw new Error('studentId is required for fetching student progress');
        }

        const { data, errors } = await client.query({
            query: STUDENT_PROGRESS_QUERY,
            variables: { studentId },
            fetchPolicy: 'no-cache',
        });

        if (errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
        }

        if (!data?.taskListes?.data) {
            return [];
        }

        return data.taskListes.data.map((progress: any) => ({
            id: progress.id,
            is_correct: progress.attributes.is_correct,
            time_taken: progress.attributes.time_taken,
            attempt_date: progress.attributes.attempt_date,
            lesson_id: progress.attributes.lesson?.data?.id || '',
            question_id: progress.attributes.question?.data?.id || '',
        }));
    } catch (error) {
        console.error('Error fetching student progress:', error);
        throw error;
    }
}

// Mutation Functions
export async function createQuestion(
  data: {
    question_text: string;
    correct_answer: string;
    options: string[];
    time_limit: number;
    lesson: string;
  },
  client = defaultClient
): Promise<Question> {
  try {
    const { data: responseData, errors } = await client.mutate({ // Changed data to responseData
      mutation: CREATE_QUESTION_MUTATION,
      variables: { data }, // Changed input to data
    });

    if (errors) {
      throw new Error(`GraphQL errors: ${errors.map((e: any) => e.message).join(', ')}`);
    }

    if (!responseData?.createQuestion?.data) { // Changed data to responseData
      throw new Error('No question data returned');
    }

    const question = responseData.createQuestion.data.attributes; // Changed data to responseData and adjusted path
    return {
      id: responseData.createQuestion.data.id,
      question_text: question.question_text,
      correct_answer: question.correct_answer,
      options: question.options,
      time_limit: question.time_limit,
      lesson_id: responseData.createQuestion.data.lesson?.data?.id || data.lesson,
    };
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
}



export async function createtaskList(
  data: { // Changed from input to data
    is_correct: boolean;
    time_taken: number;
    lesson: string;
    question: string;
    student: string;
  },
  client = defaultClient
): Promise<taskList> {
  try {
    const { data: responseData, errors } = await client.mutate({ // Changed data to responseData
      mutation: CREATE_STUDENT_PROGRESS_MUTATION,
      variables: { data }, // Changed input to data
    });

    if (errors) {
      throw new Error(`GraphQL errors: ${errors.map((e: any) => e.message).join(', ')}`);
    }

    if (!responseData?.createtaskList?.data) { // Changed data to responseData
      throw new Error('No student progress data returned');
    }

    const progress = responseData.createtaskList.data.attributes; // Changed data to responseData and adjusted path.
    const progressId = responseData.createtaskList.data.id;
    return {
      id: progressId,
      is_correct: progress.is_correct,
      time_taken: progress.time_taken,
      attempt_date: progress.attempt_date,
      lesson_id: responseData.createtaskList.data.lesson?.data?.id || data.lesson, // Changed input to data
      question_id: responseData.createtaskList.data.question?.data?.id || data.question, // Changed input to data
    };
  } catch (error) {
    console.error('Error creating student progress:', error);
    throw error;
  }
}

export async function fetchSubjects(client = defaultClient): Promise<Subject[]> {
  try {
    const { data, errors } = await client.query({
      query: SUBJECTS_QUERY,
      fetchPolicy: 'network-only'
    });

    if (errors) {
      throw new Error(`GraphQL errors: ${errors.map((e: any) => e.message).join(', ')}`);
    }

    if (!data?.subjects?.data) {
      throw new Error('No subjects data returned');
    }

    return data.subjects.data.map((subject: any) => ({
      id: subject.id,
      attributes: {
        title: subject.attributes.title,
        description: subject.attributes.description
      }
    }));
  } catch (error) {
    console.error('Error fetching subjects', error);
    throw error;
  }
}