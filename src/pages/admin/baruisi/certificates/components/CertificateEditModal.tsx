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
import { Certificate } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  editingId: string | null;
  formData: Omit<Certificate, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Certificate, 'id'>>>;
}

export default function CertificateEditModal({ isOpen, onClose, isSubmitting, onSubmit, editingId, formData, setFormData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'published' ? (value === 'true') : value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg rounded-xl">
        <DialogHeader>
          <DialogTitle>{editingId ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
          <DialogDescription>Fill the form below</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template">Template Name</Label>
            <Input id="template" name="template" value={formData.template} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issuer">Issuer</Label>
            <Input id="issuer" name="issuer" value={formData.issuer} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              name="published"
              value={formData.published ? 'true' : 'false'}
              onChange={handleChange}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="true">Published</option>
              <option value="false">Draft</option>
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
