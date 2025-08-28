import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

import { affiliatorsData } from './data';
import { User, AffiliatorStatus, SocialMedia } from './types';
import {
  AffiliatorTable,
  AffiliatorCard,
  AffiliatorEditModal,
  AffiliatorDetailModal,
  SearchAndFilters,
} from './components';

// Constants
const ITEMS_PER_PAGE = 10;

// Helper localStorage utils (kept identical with original implementation)
const loadArray = <T,>(key: string, defaultValue: T[]): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    console.error('Error loading from localStorage', err);
    return defaultValue;
  }
};

const saveArray = <T,>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving to localStorage', err);
  }
};

const generateId = (): string => `aff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function AdminAffiliators() {
  const { toast } = useToast();

  /* ---------------------------------- state --------------------------------- */
  const [isLoading, setIsLoading] = useState(true);
  const [affiliators, setAffiliators] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AffiliatorStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Edit/Add modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<User, 'id' | 'createdAt' | 'lastLogin'>>({
    name: '',
    email: '',
    phone: '',
    socialMedia: { website: '', instagram: '', youtube: '', tiktok: '' },
    channel: '',
    audience: '',
    role: 'affiliator',
    affiliatorStatus: 'pending',
    commissionRate: 20,
    totalEarnings: 0,
    totalPayouts: 0,
    totalReferrals: 0,
    notes: '',
  });

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // Detail modal state
  const [selectedAffiliator, setSelectedAffiliator] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  /* ---------------------------- initial data load --------------------------- */
  useEffect(() => {
    const init = () => {
      setIsLoading(true);
      const stored = loadArray<User>('affiliators', affiliatorsData);
      setAffiliators(stored);
      setIsLoading(false);
    };
    init();
  }, []);

  /* -------------------------- derived / memo values ------------------------- */
  const filtered = useMemo(() => {
    return affiliators.filter((u) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        term === '' ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.phone ?? '').toLowerCase().includes(term) ||
        (u.socialMedia.website ?? '').toLowerCase().includes(term) ||
        (u.socialMedia.instagram ?? '').toLowerCase().includes(term) ||
        (u.socialMedia.youtube ?? '').toLowerCase().includes(term) ||
        (u.socialMedia.tiktok ?? '').toLowerCase().includes(term) ||
        u.channel.toLowerCase().includes(term);

      const matchStatus = statusFilter === 'all' || u.affiliatorStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [affiliators, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  /* ------------------------------ CRUD actions ------------------------------ */
  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      socialMedia: { website: '', instagram: '', youtube: '', tiktok: '' },
      channel: '',
      audience: '',
      role: 'affiliator',
      affiliatorStatus: 'pending',
      commissionRate: 20,
      totalEarnings: 0,
      totalPayouts: 0,
      totalReferrals: 0,
      notes: '',
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = (u: User) => {
    setEditingId(u.id);
    const { id, createdAt, lastLogin, ...data } = u;
    setFormData(data);
    setIsEditModalOpen(true);
  };

  const handleViewDetail = (u: User) => {
    setSelectedAffiliator(u);
    setIsDetailModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    const updated = affiliators.filter((u) => u.id !== deleteId);
    setAffiliators(updated);
    saveArray('affiliators', updated);
    toast({ title: 'Deleted', description: 'Affiliator removed' });
    setDeleteId(null);
    setIsDeleteDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const updated = affiliators.map((u) => (u.id === editingId ? { ...u, ...formData, id: editingId } : u));
        setAffiliators(updated);
        saveArray('affiliators', updated);
        toast({ title: 'Success', description: 'Affiliator updated' });
      } else {
        const newAff: User = {
          ...formData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        } as User;
        const updated = [...affiliators, newAff];
        setAffiliators(updated);
        saveArray('affiliators', updated);
        toast({ title: 'Success', description: 'New affiliator added' });
      }
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to save affiliator', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (id: string, status: AffiliatorStatus) => {
    const updated = affiliators.map((u) => (u.id === id ? { ...u, affiliatorStatus: status } : u));
    setAffiliators(updated);
    saveArray('affiliators', updated);
    toast({ title: 'Status updated', description: `Affiliator marked ${status}` });
  };

  /* ---------------------------- CSV export logic ---------------------------- */
  const handleExport = () => {
    const rows = filtered.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone ?? '',
      website: u.socialMedia.website ?? '',
      instagram: u.socialMedia.instagram ?? '',
      youtube: u.socialMedia.youtube ?? '',
      tiktok: u.socialMedia.tiktok ?? '',
      channel: u.channel,
      audience: u.audience,
      status: u.affiliatorStatus,
      commissionRate: u.commissionRate,
      totalEarnings: u.totalEarnings,
      totalPayouts: u.totalPayouts,
      totalReferrals: u.totalReferrals,
      createdAt: u.createdAt,
    }));

    const headers = Object.keys(rows[0] ?? {});
    const csv = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => `"${String((r as any)[h] ?? '').replaceAll('"', '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'affiliators.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ---------------------------------- JSX ---------------------------------- */
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Affiliator Management</h1>
          <p className="text-muted-foreground mt-2">Manage your affiliate partners and their performance</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="mr-2 h-4 w-4" /> Add Affiliator
        </Button>
      </div>

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
            <AffiliatorTable
              affiliators={currentItems}
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
            {currentItems.map((u) => (
              <AffiliatorCard
                key={u.id}
                onViewDetail={handleViewDetail}
                affiliator={u}
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
          Showing{' '}
          <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
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
              variant={currentPage === p ? 'default' : 'outline'}
              onClick={() => setCurrentPage(p)}
              className="h-8 w-8 p-0"
            >
              {p}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage >= totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AffiliatorEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Detail Modal */}
      <AffiliatorDetailModal
        affiliator={selectedAffiliator}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAffiliator(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Delete Affiliator</DialogTitle>
            <DialogDescription>Are you sure you want to delete this affiliator? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
