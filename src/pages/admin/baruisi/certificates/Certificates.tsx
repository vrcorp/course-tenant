import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import { certificatesData } from './data';
import { Certificate } from './types';
import { CertificateTable, CertificateEditModal } from './components';

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

const generateId = () => `cert_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

export default function AdminCertificates() {
  const { toast } = useToast();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Certificate, 'id'>>({
    template: '',
    issuer: '',
    published: false,
  });

  useEffect(() => {
    const initial = loadArray<Certificate>('certificates', certificatesData);
    setCertificates(initial);
  }, []);

  const filtered = useMemo(() => {
    return certificates.filter((c) => {
      const term = searchTerm.toLowerCase();
      const matchSearch = term === '' || c.template.toLowerCase().includes(term) || c.issuer.toLowerCase().includes(term);
      const matchStatus =
        statusFilter === 'all' || (statusFilter === 'published' ? c.published : !c.published);
      return matchSearch && matchStatus;
    });
  }, [certificates, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ template: '', issuer: '', published: false });
    setIsEditModalOpen(true);
  };

  const handleEdit = (c: Certificate) => {
    setEditingId(c.id);
    const { id, ...rest } = c;
    setFormData(rest);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = certificates.filter((c) => c.id !== id);
    setCertificates(updated);
    saveArray('certificates', updated);
    toast({ title: 'Deleted', description: 'Certificate removed' });
  };

  const handleTogglePublish = (id: string) => {
    const updated = certificates.map((c) => (c.id === id ? { ...c, published: !c.published } : c));
    setCertificates(updated);
    saveArray('certificates', updated);
    toast({ title: 'Status Updated' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const updated = certificates.map((c) => (c.id === editingId ? { ...formData, id: editingId } : c));
        setCertificates(updated);
        saveArray('certificates', updated);
        toast({ title: 'Updated', description: 'Certificate updated successfully' });
      } else {
        const newCert: Certificate = { ...formData, id: generateId() };
        const updated = [...certificates, newCert];
        setCertificates(updated);
        saveArray('certificates', updated);
        toast({ title: 'Added', description: 'New certificate added' });
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
        <h1 className="text-2xl font-semibold">Certificates</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Add Certificate
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CertificateTable
          certificates={currentItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
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
      <CertificateEditModal
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
