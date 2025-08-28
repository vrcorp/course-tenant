import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

import { instructorsData } from './data';
import { Instructor, InstructorStatus } from './types';
import {
  InstructorTable,
  InstructorCard,
  InstructorEditModal,
  InstructorDetailModal,
  StatsCards,
  SearchAndFilters,
} from './components';

const ITEMS_PER_PAGE = 10;

const loadArray = <T,>(key: string, defaultValue: T[]): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveArray = <T,>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
};

const generateId = () => `instr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export default function AdminInstructors() {
  const { toast } = useToast();

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InstructorStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Instructor, 'id' | 'joinDate'>>({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    specialization: '',
    courses: 0,
    students: 0,
    rating: 0,
    status: 'active',
    totalEarnings: 0,
  });

  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const initial = loadArray<Instructor>('instructors', instructorsData);
    setInstructors(initial);
  }, []);

  const filtered = useMemo(() => {
    return instructors.filter((i) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        term === '' ||
        i.name.toLowerCase().includes(term) ||
        i.email.toLowerCase().includes(term) ||
        i.specialization.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'all' || i.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [instructors, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      avatar: '',
      specialization: '',
      courses: 0,
      students: 0,
      rating: 0,
      status: 'active',
      totalEarnings: 0,
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = (i: Instructor) => {
    setEditingId(i.id);
    const { id, joinDate, ...rest } = i;
    setFormData(rest);
    setIsEditModalOpen(true);
  };

  const handleViewDetail = (i: Instructor) => {
    setSelectedInstructor(i);
    setIsDetailModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    const updated = instructors.filter((i) => i.id !== deleteId);
    setInstructors(updated);
    saveArray('instructors', updated);
    toast({ title: 'Deleted', description: 'Instructor removed' });
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const updated = instructors.map((i) => (i.id === editingId ? { ...i, ...formData, id: editingId } : i));
        setInstructors(updated);
        saveArray('instructors', updated);
        toast({ title: 'Updated', description: 'Instructor updated successfully' });
      } else {
        const newInstr: Instructor = {
          ...formData,
          id: generateId(),
          joinDate: new Date().toISOString(),
        } as Instructor;
        const updated = [...instructors, newInstr];
        setInstructors(updated);
        saveArray('instructors', updated);
        toast({ title: 'Added', description: 'New instructor added' });
      }
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save instructor' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (id: string, status: InstructorStatus) => {
    const updated = instructors.map((i) => (i.id === id ? { ...i, status } : i));
    setInstructors(updated);
    saveArray('instructors', updated);
    toast({ title: 'Status updated', description: `Instructor marked ${status}` });
  };

  const handleExport = () => {
    if (filtered.length === 0) return;
    const rows = filtered.map((i) => ({
      ...i,
      totalEarnings: formatCurrency(i.totalEarnings),
    }));
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => `"${String((r as any)[h] ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'instructors.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructor Management</h1>
          <p className="text-muted-foreground mt-1">Manage your instructors and monitor their performance</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="mr-2 h-4 w-4" /> Add Instructor
        </Button>
      </div>

      {/* Stats */}
      <StatsCards instructors={instructors} />

      {/* Search & Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onExport={handleExport}
      />

      {/* List */}
      <Card className="shadow-lg border-0 rounded-xl">
        <CardContent className="p-0">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <InstructorTable
              instructors={currentItems}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={(id) => {
                setDeleteId(id);
                setIsDeleteDialogOpen(true);
              }}
              onStatusChange={handleStatusChange}
            />
          </div>
          {/* Mobile */}
          <div className="md:hidden p-4 space-y-4">
            {currentItems.map((i) => (
              <InstructorCard
                key={i.id}
                instructor={i}
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
                onDelete={(id) => {
                  setDeleteId(id);
                  setIsDeleteDialogOpen(true);
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-gray-500">
          Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of{' '}
          <span className="font-medium">{filtered.length}</span> results
        </span>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={p === currentPage ? 'default' : 'outline'}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <InstructorEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Detail Modal */}
      <InstructorDetailModal
        instructor={selectedInstructor}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>This action cannot be undone. Delete instructor?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
