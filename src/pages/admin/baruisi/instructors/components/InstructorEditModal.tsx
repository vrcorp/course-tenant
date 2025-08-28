import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Instructor, InstructorStatus } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  editingId: string | null;
  formData: Omit<Instructor, 'id' | 'joinDate'>;
  setFormData: React.Dispatch<
    React.SetStateAction<Omit<Instructor, 'id' | 'joinDate'>>
  >;
}

export const InstructorEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isSubmitting,
  onSubmit,
  editingId,
  formData,
  setFormData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (['courses', 'students', 'totalEarnings', 'rating'].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] rounded-xl overflow-y-auto max-h-[95vh]">
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Instructor' : 'Add Instructor'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update instructor information'
                : 'Fill in details to add a new instructor'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={(formData as any).phone || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courses">Courses</Label>
              <Input
                id="courses"
                name="courses"
                type="number"
                min={0}
                value={formData.courses}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="students">Students</Label>
              <Input
                id="students"
                name="students"
                type="number"
                min={0}
                value={formData.students}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalEarnings">Total Earnings</Label>
              <Input
                id="totalEarnings"
                name="totalEarnings"
                type="number"
                min={0}
                value={formData.totalEarnings}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, status: val as InstructorStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
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
};
