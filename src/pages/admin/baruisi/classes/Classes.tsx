import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import { classesData } from './data';
import { Class, ClassStatus } from './types';
import { ClassTable, ClassEditModal } from './components';

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

const generateId = () => `class_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export default function AdminClasses() {
  const { toast } = useToast();

  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClassStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Class, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    students: 0,
    status: 'scheduled',
  });

  useEffect(() => {
    const initial = loadArray<Class>('classes', classesData);
    setClasses(initial);
  }, []);

  const filtered = useMemo(() => {
    return classes.filter((c) => {
      const term = searchTerm.toLowerCase();
      const matchSearch = term === '' || c.title.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [classes, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ title: '', date: new Date().toISOString().split('T')[0], students: 0, status: 'scheduled' });
    setIsEditModalOpen(true);
  };

  const handleEdit = (c: Class) => {
    setEditingId(c.id);
    const { id, ...rest } = c;
    setFormData({ ...rest, date: rest.date.split('T')[0] });
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = classes.filter((c) => c.id !== id);
    setClasses(updated);
    saveArray('classes', updated);
    toast({ title: 'Deleted', description: 'Class removed' });
  };

  const handleStatusChange = (id: string, status: ClassStatus) => {
    const updated = classes.map((c) => (c.id === id ? { ...c, status } : c));
    setClasses(updated);
    saveArray('classes', updated);
    toast({ title: 'Status Updated' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const normalizedData: Class = { ...formData, date: new Date(formData.date).toISOString() } as Class;
      if (editingId) {
        const updated = classes.map((c) => (c.id === editingId ? { ...normalizedData, id: editingId } : c));
        setClasses(updated);
        saveArray('classes', updated);
        toast({ title: 'Updated', description: 'Class updated successfully' });
      } else {
        const newClass: Class = { ...normalizedData, id: generateId() };
        const updated = [...classes, newClass];
        setClasses(updated);
        saveArray('classes', updated);
        toast({ title: 'Added', description: 'New class added' });
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
        <h1 className="text-2xl font-semibold">Classes</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ClassStatus | 'all')}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add Class
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <ClassTable
          classes={currentItems}
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
      <ClassEditModal
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
