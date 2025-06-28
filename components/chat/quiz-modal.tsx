"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { quizQuestions } from '@/data/quiz';

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (answers: Array<{questionId: string, answer: string}>) => void;
}

export function QuizModal({ open, onClose, onComplete }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{questionId: string, answer: string}>>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');

  // Safety check: return null if quiz questions are not available
  if (!quizQuestions || quizQuestions.length === 0) {
    return null;
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  // Additional safety check for current question
  if (!currentQuestion) {
    return null;
  }

  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  const handleNext = () => {
    if (!currentAnswer) return;

    const newAnswers = [
      ...answers.filter(a => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, answer: currentAnswer }
    ];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      onComplete(newAnswers);
      handleClose();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      const previousAnswer = answers.find(a => a.questionId === quizQuestions[currentQuestionIndex - 1].id);
      setCurrentAnswer(previousAnswer?.answer || '');
    }
  };

  const handleClose = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-primary/30 max-w-lg">
        <DialogHeader>
          <DialogTitle className="gradient-text">Find Your Perfect Product</DialogTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-medium mb-4">
                {currentQuestion.question}
              </h3>
              
              <RadioGroup
                value={currentAnswer}
                onValueChange={setCurrentAnswer}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={option}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => setCurrentAnswer(option)}
                  >
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!currentAnswer}
                className="neon-glow"
              >
                {isLastQuestion ? 'Get Recommendations' : 'Next'}
                {!isLastQuestion && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}