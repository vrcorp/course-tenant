import { useState, useEffect, useMemo } from 'react';
import { 
  Search, ChevronLeft, 
  ChevronRight, ChevronsLeft, ChevronsRight, 
  UserPlus, Filter, MoreVertical, Download,
  Globe, Instagram, Youtube, Music2, Users, MessageCircle,
  Mail, Phone, User, Award, DollarSign
} from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Card, CardContent, CardFooter, CardHeader 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

type AffiliatorStatus = 'active' | 'pending' | 'suspended';

interface SocialMedia {
  website?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  socialMedia: SocialMedia;
  channel: string;
  audience: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  affiliatorStatus: AffiliatorStatus;
  commissionRate: number;
  totalEarnings: number;
  totalPayouts: number;
  totalReferrals: number;
  notes?: string;
}

const ITEMS_PER_PAGE = 10;

// Helper functions for localStorage
const loadArray = <T,>(key: string, defaultValue: T[]): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

const saveArray = <T,>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Generate a unique ID
const generateId = (): string => {
  return `aff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const AffiliatorStatusBadge = ({ status }: { status: AffiliatorStatus }) => {
  const statusMap = {
    active: { label: 'Active', className: 'bg-green-100 text-green-800 border-green-200' },
    pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 border-amber-200' },
    suspended: { label: 'Suspended', className: 'bg-red-100 text-red-800 border-red-200' },
  };

  const { label, className } = statusMap[status] || { label: 'Unknown', className: 'bg-gray-100 text-gray-800 border-gray-200' };
  
  return <Badge variant="outline" className={className}>{label}</Badge>;
};

export default function AdminAffiliators() {
  const { toast } = useToast();
  const [, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AffiliatorStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [sortConfig, setSortConfig] = useState<{key: keyof User; direction: 'asc' | 'desc'} | null>({
    key: 'createdAt',
    direction: 'desc',
  });
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load users from localStorage or use default data
        const storedUsers = loadArray<User>('affiliators', []);
        setUsers(storedUsers);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load affiliator data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.socialMedia.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.socialMedia.instagram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.socialMedia.youtube?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.socialMedia.tiktok?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.channel.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || user.affiliatorStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      if (!sortConfig) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [users, searchTerm, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Handle sort
  const handleSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Form handling
  const [formData, setFormData] = useState<Omit<User, 'id' | 'createdAt' | 'lastLogin'>>({
    name: '',
    email: '',
    phone: '',
    socialMedia: {
      website: '',
      instagram: '',
      youtube: '',
      tiktok: ''
    },
    channel: '',
    audience: '',
    role: 'affiliator',
    affiliatorStatus: 'pending',
    commissionRate: 20,
    totalEarnings: 0,
    totalPayouts: 0,
    totalReferrals: 0,
    notes: ''
  });

  // CRUD Operations
  const handleAddAffiliator = () => {
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      socialMedia: {
        website: '',
        instagram: '',
        youtube: '',
        tiktok: ''
      },
      channel: '',
      audience: '',
      role: 'affiliator',
      affiliatorStatus: 'pending',
      commissionRate: 20,
      totalEarnings: 0,
      totalPayouts: 0,
      totalReferrals: 0,
      notes: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditAffiliator = (user: User) => {
    setEditingUserId(user.id);
    const { id, createdAt, lastLogin, ...userData } = user;
    setFormData(userData);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    
    const updatedUsers = users.filter(user => user.id !== userToDelete);
    setUsers(updatedUsers);
    saveArray('affiliators', updatedUsers);
    
    toast({
      title: 'Success',
      description: 'Affiliator deleted successfully',
    });
    
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleStatusChange = (userId: string, status: AffiliatorStatus) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, affiliatorStatus: status } : user
    );
    
    setUsers(updatedUsers);
    saveArray('affiliators', updatedUsers);
    
    toast({
      title: 'Status Updated',
      description: `Affiliator status changed to ${status}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingUserId) {
        // Update existing user
        const updatedUsers = users.map(user => 
          user.id === editingUserId 
            ? { ...user, ...formData, id: editingUserId }
            : user
        );
        setUsers(updatedUsers);
        saveArray('affiliators', updatedUsers);
        
        toast({
          title: 'Success',
          description: 'Affiliator updated successfully',
        });
      } else {
        // Add new user
        const newUser: User = {
          ...formData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        saveArray('affiliators', updatedUsers);
        
        toast({
          title: 'Success',
          description: 'New affiliator added successfully',
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving affiliator:', error);
      toast({
        title: 'Error',
        description: 'Failed to save affiliator',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialMedia.')) {
      const socialMediaField = name.split('.')[1] as keyof SocialMedia;
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialMediaField]: value
        }
      }));
    } else if (name === 'commissionRate') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Export CSV for current filtered results
  const handleExport = () => {
    const rows = filteredUsers.map(u => ({
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

    const headers = Object.keys(rows[0] ?? {
      id: '', name: '', email: '', phone: '', website: '', instagram: '', youtube: '', tiktok: '', 
      channel: '', audience: '', status: '', commissionRate: '', totalEarnings: '', totalPayouts: '', 
      totalReferrals: '', createdAt: ''
    });

    const csv = [
      headers.join(','),
      ...rows.map(r => headers.map(h => {
        const cell = String((r as any)[h] ?? '');
        // escape quotes and wrap in quotes if needed
        const escaped = '"' + cell.replaceAll('"', '""') + '"';
        return escaped;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'affiliators.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortConfig]);

  // Render the main content
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Affiliator Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your affiliate partners and their performance
            </p>
          </div>
          <Button onClick={handleAddAffiliator} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Affiliator
          </Button>
        </div>

        <Card className="shadow-lg border-0 rounded-xl">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, email, or social media..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value: AffiliatorStatus | 'all') => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={handleExport} aria-label="Export CSV">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center p-10">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No affiliators found</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or add a new affiliator
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">Social Media</TableHead>
                        <TableHead className="font-semibold">Channel</TableHead>
                        <TableHead className="font-semibold">Audience</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-right">Commission</TableHead>
                        <TableHead className="font-semibold text-right">Earnings</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((u) => (
                        <TableRow key={u.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">{u.email}</div>
                              {u.phone && <div className="text-xs text-muted-foreground">{u.phone}</div>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {u.socialMedia.website && (
                                <Badge variant="outline" className="text-xs">
                                  <Globe className="h-3 w-3 mr-1" /> Web
                                </Badge>
                              )}
                              {u.socialMedia.instagram && (
                                <Badge variant="outline" className="text-xs">
                                  <Instagram className="h-3 w-3 mr-1" /> IG
                                </Badge>
                              )}
                              {u.socialMedia.youtube && (
                                <Badge variant="outline" className="text-xs">
                                  <Youtube className="h-3 w-3 mr-1" /> YT
                                </Badge>
                              )}
                              {u.socialMedia.tiktok && (
                                <Badge variant="outline" className="text-xs">
                                  <Music2 className="h-3 w-3 mr-1" /> TT
                                </Badge>
                              )}
                              {!u.socialMedia.website && !u.socialMedia.instagram && 
                              !u.socialMedia.youtube && !u.socialMedia.tiktok && (
                                <span className="text-xs text-muted-foreground">None</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{u.channel || '-'}</TableCell>
                          <TableCell>{u.audience || '-'}</TableCell>
                          <TableCell>
                            <AffiliatorStatusBadge status={u.affiliatorStatus} />
                          </TableCell>
                          <TableCell className="text-right">{u.commissionRate}%</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(u.totalEarnings || 0)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditAffiliator(u)}>Edit</Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleEditAffiliator(u)}>Edit Details</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel>Change status</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleStatusChange(u.id, 'active')}>Active</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(u.id, 'pending')}>Pending</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(u.id, 'suspended')}>Suspended</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(u.id)}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {currentItems.map((u) => (
                    <Card key={u.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{u.name}</h3>
                            <div className="flex items-center mt-1">
                              <AffiliatorStatusBadge status={u.affiliatorStatus} />
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditAffiliator(u)}>Edit</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusChange(u.id, 'active')}>Mark Active</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(u.id, 'pending')}>Mark Pending</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(u.id, 'suspended')}>Mark Suspended</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(u.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 mr-1" />
                                Email
                              </div>
                              <div className="text-sm font-medium">{u.email}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Award className="h-4 w-4 mr-1" />
                                Commission
                              </div>
                              <div className="text-sm font-medium">{u.commissionRate}%</div>
                            </div>
                          </div>

                          {u.phone && (
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 mr-1" />
                                Phone
                              </div>
                              <div className="text-sm font-medium">{u.phone}</div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <User className="h-4 w-4 mr-1" />
                                Channel
                              </div>
                              <div className="text-sm font-medium">{u.channel || '-'}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Users className="h-4 w-4 mr-1" />
                                Audience
                              </div>
                              <div className="text-sm font-medium">{u.audience || '-'}</div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Earnings
                            </div>
                            <div className="text-sm font-medium">{formatCurrency(u.totalEarnings || 0)}</div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Social Media</div>
                            <div className="flex flex-wrap gap-1">
                              {u.socialMedia.website && (
                                <Badge variant="outline" className="text-xs">
                                  <Globe className="h-3 w-3 mr-1" /> Web
                                </Badge>
                              )}
                              {u.socialMedia.instagram && (
                                <Badge variant="outline" className="text-xs">
                                  <Instagram className="h-3 w-3 mr-1" /> IG
                                </Badge>
                              )}
                              {u.socialMedia.youtube && (
                                <Badge variant="outline" className="text-xs">
                                  <Youtube className="h-3 w-3 mr-1" /> YT
                                </Badge>
                              )}
                              {u.socialMedia.tiktok && (
                                <Badge variant="outline" className="text-xs">
                                  <Music2 className="h-3 w-3 mr-1" /> TT
                                </Badge>
                              )}
                              {!u.socialMedia.website && !u.socialMedia.instagram && 
                              !u.socialMedia.youtube && !u.socialMedia.tiktok && (
                                <span className="text-xs text-muted-foreground">None</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t bg-gray-50 gap-4">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to {" "}
              <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of {" "}
              <span className="font-medium">{filteredUsers.length}</span> results
            </span>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                disabled={currentPage <= 1} 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    size="sm"
                    variant={currentPage === p ? "default" : "outline"}
                    onClick={() => setCurrentPage(p)}
                    className="h-8 w-8 p-0"
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                disabled={currentPage >= totalPages || totalPages === 0} 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] rounded-xl overflow-y-auto max-h-[95vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {editingUserId ? 'Edit Affiliator' : 'Add New Affiliator'}
              </DialogTitle>
              <DialogDescription>
                {editingUserId ? 'Update the affiliator details' : 'Fill in the details to add a new affiliator'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                
                {/* Social Media Fields */}
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
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="affiliatorStatus">Status</Label>
                  <Select
                    value={formData.affiliatorStatus}
                    onValueChange={(value: AffiliatorStatus) => 
                      setFormData(prev => ({ ...prev, affiliatorStatus: value }))
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
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    name="notes" 
                    value={formData.notes || ''} 
                    onChange={handleInputChange} 
                    placeholder="Additional notes about this affiliator"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? 'Saving...' : (editingUserId ? 'Save Changes' : 'Create Affiliator')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Delete Affiliator</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this affiliator? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}