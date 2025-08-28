import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Globe, Instagram, Youtube, Music2 } from 'lucide-react';
import { User, AffiliatorStatus, SocialMedia } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  editingId: string | null;
  formData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<User, 'id' | 'createdAt' | 'lastLogin'>>>;
}

export const AffiliatorEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isSubmitting,
  onSubmit,
  editingId,
  formData,
  setFormData,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('socialMedia.')) {
      const socialKey = name.split('.')[1] as keyof SocialMedia;
      setFormData((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialKey]: value,
        },
      }));
    } else if (name === 'commissionRate') {
      setFormData((prev) => ({
        ...prev,
        commissionRate: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] rounded-xl overflow-y-auto max-h-[95vh]">
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingId ? 'Edit Affiliator' : 'Add New Affiliator'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update the affiliator details'
                : 'Fill in the details to add a new affiliator'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Input
                id="channel"
                name="channel"
                value={formData.channel}
                onChange={handleInputChange}
                placeholder="Primary content channel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Audience</Label>
              <Input
                id="audience"
                name="audience"
                value={formData.audience}
                onChange={handleInputChange}
                placeholder="Target audience description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Commission Rate (%)</Label>
              <Input
                id="commissionRate"
                name="commissionRate"
                type="number"
                min={0}
                max={100}
                value={formData.commissionRate}
                onChange={handleInputChange}
              />
            </div>

            {/* Social media */}
            <div className="md:col-span-2">
              <Label className="text-sm font-medium mb-2 block">Social Media Links</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-1 text-sm">
                    <Globe className="h-4 w-4" /> Website
                  </Label>
                  <Input
                    id="website"
                    name="socialMedia.website"
                    value={formData.socialMedia.website || ''}
                    onChange={handleInputChange}
                    placeholder="https://website.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-1 text-sm">
                    <Instagram className="h-4 w-4" /> Instagram
                  </Label>
                  <Input
                    id="instagram"
                    name="socialMedia.instagram"
                    value={formData.socialMedia.instagram || ''}
                    onChange={handleInputChange}
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube" className="flex items-center gap-1 text-sm">
                    <Youtube className="h-4 w-4" /> YouTube
                  </Label>
                  <Input
                    id="youtube"
                    name="socialMedia.youtube"
                    value={formData.socialMedia.youtube || ''}
                    onChange={handleInputChange}
                    placeholder="Channel name or URL"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok" className="flex items-center gap-1 text-sm">
                    <Music2 className="h-4 w-4" /> TikTok
                  </Label>
                  <Input
                    id="tiktok"
                    name="socialMedia.tiktok"
                    value={formData.socialMedia.tiktok || ''}
                    onChange={handleInputChange}
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>

            {/* Status & Notes */}
            <div className="md:col-span-2 space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.affiliatorStatus}
                onValueChange={(val: AffiliatorStatus) =>
                  setFormData((prev) => ({ ...prev, affiliatorStatus: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Notes</Label>
              <Input
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                placeholder="Additional notes about this affiliator"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Affiliator'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
