import { QuizQuestion } from '@/types/chat';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'category',
    question: 'What type of product are you most interested in?',
    options: [
      'Fitness and health tracking',
      'Music and audio experience',
      'Communication and productivity',
      'Gaming and entertainment'
    ],
    category: 'preference'
  },
  {
    id: 'budget',
    question: 'What\'s your budget range?',
    options: [
      'Under ₹20,000',
      '₹20,000 - ₹50,000',
      '₹50,000 - ₹1,00,000',
      'Above ₹1,00,000'
    ],
    category: 'budget'
  },
  {
    id: 'priority',
    question: 'What matters most to you?',
    options: [
      'Latest features and technology',
      'Value for money',
      'Brand reputation and reliability',
      'Design and aesthetics'
    ],
    category: 'priority'
  }
];