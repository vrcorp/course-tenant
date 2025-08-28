import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Mail,
  Phone,
  Link as LinkIcon,
  Users as UsersIcon,
  DollarSign,
  Award,
} from 'lucide-react';
import { AffiliatorStatusBadge } from './AffiliatorStatusBadge';
import { User } from '../types';
import { formatCurrency } from '@/lib/utils';

interface Props {
  affiliator: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AffiliatorDetailModal: React.FC<Props> = ({ affiliator, isOpen, onClose }) => {
  if (!affiliator) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Affiliator Details</DialogTitle>
          <DialogDescription>Comprehensive information about the affiliator</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              {/* Replace with avatar if available in future */}
              <AvatarImage src="" alt={affiliator.name} />
              <AvatarFallback>{affiliator.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{affiliator.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <AffiliatorStatusBadge status={affiliator.affiliatorStatus} />
                <Badge variant="default" className="bg-orange-500">Affiliator</Badge>
              </div>
            </div>
          </div>

          {/* Contact & Channel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Contact Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {affiliator.email}</div>
                {affiliator.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {affiliator.phone}</div>}
              </div>
            </div>
            {/* Channel */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Channel Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><LinkIcon className="h-4 w-4" /> {affiliator.channel || '-'}</div>
                <div className="flex items-center gap-2"><UsersIcon className="h-4 w-4" /> {affiliator.audience || '-'}</div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          {(affiliator.socialMedia.instagram || affiliator.socialMedia.youtube || affiliator.socialMedia.tiktok || affiliator.socialMedia.website) && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Social Media</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                {affiliator.socialMedia.website && <li>Website: {affiliator.socialMedia.website}</li>}
                {affiliator.socialMedia.instagram && <li>Instagram: {affiliator.socialMedia.instagram}</li>}
                {affiliator.socialMedia.youtube && <li>YouTube: {affiliator.socialMedia.youtube}</li>}
                {affiliator.socialMedia.tiktok && <li>TikTok: {affiliator.socialMedia.tiktok}</li>}
              </ul>
            </div>
          )}

          {/* Stats */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-bold text-blue-600">{affiliator.commissionRate}%</div>
                  <div className="text-xs text-blue-600">Commission Rate</div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-bold text-green-600">{formatCurrency(affiliator.totalEarnings || 0)}</div>
                  <div className="text-xs text-green-600">Total Earnings</div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-bold text-orange-600">{affiliator.totalReferrals}</div>
                  <div className="text-xs text-orange-600">Total Referrals</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {affiliator.notes && (
            <div>
              <h3 className="font-semibold text-lg mb-1">Notes</h3>
              <p className="text-sm whitespace-pre-line border rounded-md p-3 bg-gray-50">{affiliator.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
