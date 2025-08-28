import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import { assignmentsData } from './data';
import { Assignment, AssignmentStatus } from './types';
import { AssignmentTable, AssignmentEditModal } from './components';

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

const generateId = () => `as_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export default function AdminAssignments() {
  const { toast } = useToast();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Assignment, 'id'>>({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'open',
  });

  useEffect(() => {
    const initial = loadArray<Assignment>('assignments', assignmentsData);
    setAssignments(initial);
  }, []);

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const term = searchTerm.toLowerCase();
      const matchSearch = term === '' || a.title.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [assignments, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ title: '', dueDate: new Date().toISOString().split('T')[0], status: 'open' });
    setIsEditModalOpen(true);
  };

  const handleEdit = (a: Assignment) => {
    setEditingId(a.id);
    const { id, ...rest } = a;
    setFormData({ ...rest, dueDate: rest.dueDate.split('T')[0] });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = assignments.filter((a) => a.id !== id);
    setAssignments(updated);
    saveArray('assignments', updated);
    toast({ title: 'Deleted', description: 'Assignment removed' });
  };

  const handleStatusChange = (id: string, status: AssignmentStatus) => {
    const updated = assignments.map((a) => (a.id === id ? { ...a, status } : a));
    setAssignments(updated);
    saveArray('assignments', updated);
    toast({ title: 'Status Updated' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const normalizedData: Assignment = { ...formData, dueDate: new Date(formData.dueDate).toISOString() } as Assignment;
      if (editingId) {
        const updated = assignments.map((a) => (a.id === editingId ? { ...normalizedData, id: editingId } : a));
        setAssignments(updated);
        saveArray('assignments', updated);
        toast({ title: 'Updated', description: 'Assignment updated successfully' });
      } else {
        const newAs: Assignment = { ...normalizedData, id: generateId() };
        const updated = [...assignments, newAs];
        setAssignments(updated);
        saveArray('assignments', updated);
        toast({ title: 'Added', description: 'New assignment added' });
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
        <h1 className="text-2xl font-semibold">Assignments</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AssignmentStatus | 'all')}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="overdue">Overdue</option>
          </select>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add Assignment
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <AssignmentTable
          assignments={currentItems}
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
      <AssignmentEditModal
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
