import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Quiz } from '../types';

interface Props {
  quiz: Quiz | null;
  onClose: () => void;
}

const QuestionListModal: React.FC<Props> = ({ quiz, onClose }) => {
  return (
    <Dialog open={!!quiz} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl rounded-xl">
        {quiz && (
          <>
            <DialogHeader>
              <DialogTitle>{quiz.title} – Questions</DialogTitle>
              <DialogDescription>
                Total {quiz.questions.length} questions • Passing Score {quiz.passingScore}%
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {quiz.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-md border bg-muted/50">
                  <p className="font-medium mb-2">
                    {idx + 1}. {q.question}
                  </p>
                  {q.type === 'multiple_choice' && q.options && (
                    <ul className="list-disc pl-5 space-y-1">
                      {q.options.map((opt, i) => (
                        <li
                          key={i}
                          className={
                            i === q.answer
                              ? 'font-semibold text-primary'
                              : ''
                          }
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                  {q.type === 'true_false' && (
                    <p className="italic">Answer: {q.answer ? 'True' : 'False'}</p>
                  )}
                  {q.type === 'short_answer' && (
                    <p className="italic">Answer: {q.answer}</p>
                  )}
                  {q.explanation && (
                    <p className="text-xs text-muted-foreground mt-2">{q.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuestionListModal;
