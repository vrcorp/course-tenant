import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Assignment, AssignmentStatus } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  editingId: string | null;
  formData: Omit<Assignment, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Assignment, 'id'>>>;
}

export default function AssignmentEditModal({ isOpen, onClose, isSubmitting, onSubmit, editingId, formData, setFormData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'status' ? (value as AssignmentStatus) : value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg rounded-xl">
        <DialogHeader>
          <DialogTitle>{editingId ? 'Edit Assignment' : 'Add Assignment'}</DialogTitle>
          <DialogDescription>Fill the form below</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate.split('T')[0]} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <DialogFooter>
            <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
