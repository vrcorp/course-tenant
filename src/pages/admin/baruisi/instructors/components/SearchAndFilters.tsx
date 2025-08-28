import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { InstructorStatus } from '../types';

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: InstructorStatus | 'all';
  setStatusFilter: (val: InstructorStatus | 'all') => void;
  onExport: () => void;
}

export const SearchAndFilters: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onExport,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter as any}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-1" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={onExport}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
