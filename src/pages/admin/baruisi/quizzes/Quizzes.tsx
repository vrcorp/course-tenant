import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import { quizzesData } from './data';
import { Quiz, QuizStatus } from './types';
import { QuizTable, QuizEditModal } from './components';

const ITEMS_PER_PAGE = 10;

const loadArray = <T,>(key: string, defaultValue: T[]): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T[]) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveArray = <T,>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
};

const generateId = () => `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export default function AdminQuizzes() {
  const { toast } = useToast();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuizStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Quiz, 'id'>>({
    title: '',
    questions: 1,
    status: 'draft',
  });

  useEffect(() => {
    const initial = loadArray<Quiz>('quizzes', quizzesData);
    setQuizzes(initial);
  }, []);

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      const term = searchTerm.toLowerCase();
      const matchSearch = term === '' || q.title.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'all' || q.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [quizzes, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ title: '', questions: 1, status: 'draft' });
    setIsEditModalOpen(true);
  };

  const handleEdit = (q: Quiz) => {
    setEditingId(q.id);
    const { id, ...rest } = q;
    setFormData(rest);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = quizzes.filter((q) => q.id !== id);
    setQuizzes(updated);
    saveArray('quizzes', updated);
    toast({ title: 'Deleted', description: 'Quiz removed' });
  };

  const handleStatusChange = (id: string, status: QuizStatus) => {
    const updated = quizzes.map((q) => (q.id === id ? { ...q, status } : q));
    setQuizzes(updated);
    saveArray('quizzes', updated);
    toast({ title: 'Status Updated' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const updated = quizzes.map((q) => (q.id === editingId ? { ...q, ...formData, id: editingId } : q));
        setQuizzes(updated);
        saveArray('quizzes', updated);
        toast({ title: 'Updated', description: 'Quiz updated successfully' });
      } else {
        const newQuiz: Quiz = { ...formData, id: generateId() };
        const updated = [...quizzes, newQuiz];
        setQuizzes(updated);
        saveArray('quizzes', updated);
        toast({ title: 'Added', description: 'New quiz added' });
      }
    } finally {
      setIsSubmitting(false);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Quizzes</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as QuizStatus | 'all')}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add Quiz
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <QuizTable
          quizzes={currentItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <QuizEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        isSubmitting={isSubmitting}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
