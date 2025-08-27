import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TenantLayout from '@/components/tenant/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Gift,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Copy,
  Calendar,
  Percent,
  DollarSign,
  Users,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import tenants from '@/data/tenants.json';

export default function AdminVouchers() {
  const { tenantSlug } = useParams();
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any>(null);

  const tenant = (tenants as any[]).find((t) => t.slug === tenantSlug);

  useEffect(() => {
    // Generate dummy vouchers data
    const generateVouchers = () => {
      const voucherCodes = [
        'WELCOME20', 'STUDENT50', 'NEWBIE15', 'PREMIUM30', 'FLASH25',
        'EARLY10', 'SPECIAL40', 'HOLIDAY35', 'WEEKEND20', 'MEGA60'
      ];

      const types = ['percentage', 'fixed'];
      const statuses = ['active', 'inactive', 'expired', 'used_up'];

      return voucherCodes.map((code, index) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const isPercentage = type === 'percentage';
        
        return {
          id: (index + 1).toString(),
          code,
          name: `Voucher ${code}`,
          description: `Diskon khusus untuk ${code.toLowerCase()}`,
          type,
          value: isPercentage ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 100) + 20,
          minPurchase: Math.floor(Math.random() * 100) + 50,
          maxDiscount: isPercentage ? Math.floor(Math.random() * 50) + 25 : null,
          usageLimit: Math.floor(Math.random() * 100) + 10,
          usedCount: Math.floor(Math.random() * 50),
          startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          applicableProducts: Math.random() > 0.5 ? 'all' : 'specific',
        };
      });
    };

    setVouchers(generateVouchers());
  }, []);

  useEffect(() => {
    let filtered = vouchers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(voucher =>
        voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(voucher => voucher.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(voucher => voucher.type === typeFilter);
    }

    setFilteredVouchers(filtered);
  }, [vouchers, searchTerm, statusFilter, typeFilter]);

  const handleAddVoucher = (voucherData: any) => {
    const newVoucher = {
      id: Date.now().toString(),
      ...voucherData,
      usedCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setVouchers(prev => [newVoucher, ...prev]);
    setIsAddDialogOpen(false);
    toast.success('Voucher berhasil ditambahkan');
  };

  const handleEditVoucher = (voucherData: any) => {
    setVouchers(prev => prev.map(voucher => 
      voucher.id === editingVoucher.id 
        ? { ...voucher, ...voucherData }
        : voucher
    ));
    setEditingVoucher(null);
    toast.success('Voucher berhasil diperbarui');
  };

  const handleDeleteVoucher = (voucherId: string) => {
    setVouchers(prev => prev.filter(voucher => voucher.id !== voucherId));
    toast.success('Voucher berhasil dihapus');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Kode voucher berhasil disalin');
  };

  const handleStatusChange = (voucherId: string, newStatus: string) => {
    setVouchers(prev => prev.map(voucher => 
      voucher.id === voucherId 
        ? { ...voucher, status: newStatus }
        : voucher
    ));
    toast.success(`Status voucher berhasil diubah menjadi ${newStatus}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Aktif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Tidak Aktif</Badge>;
      case 'expired':
        return <Badge variant="destructive">Kedaluwarsa</Badge>;
      case 'used_up':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Habis</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />;
  };

  const formatValue = (voucher: any) => {
    return voucher.type === 'percentage' ? `${voucher.value}%` : `$${voucher.value}`;
  };

  return (
    <TenantLayout showSidebar sidebarType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Gift className="h-8 w-8" />
              Manajemen Voucher
            </h1>
            <p className="text-muted-foreground">
              Kelola voucher diskon untuk {tenant?.name}
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Buat Voucher
              </Button>
            </DialogTrigger>
            <VoucherDialog onSubmit={handleAddVoucher} />
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Voucher</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vouchers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voucher Aktif</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vouchers.filter(v => v.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penggunaan</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vouchers.reduce((sum, voucher) => sum + voucher.usedCount, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tingkat Penggunaan</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vouchers.length > 0 
                  ? Math.round((vouchers.reduce((sum, voucher) => sum + voucher.usedCount, 0) / 
                      vouchers.reduce((sum, voucher) => sum + voucher.usageLimit, 0)) * 100)
                  : 0
                }%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari voucher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  <SelectItem value="expired">Kedaluwarsa</SelectItem>
                  <SelectItem value="used_up">Habis</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="percentage">Persentase</SelectItem>
                  <SelectItem value="fixed">Nominal Tetap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vouchers Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode & Nama</TableHead>
                  <TableHead>Tipe & Nilai</TableHead>
                  <TableHead>Penggunaan</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary">
                            {voucher.code}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyCode(voucher.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {voucher.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(voucher.type)}
                        <div>
                          <div className="font-medium">
                            {formatValue(voucher)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Min: ${voucher.minPurchase}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {voucher.usedCount} / {voucher.usageLimit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((voucher.usedCount / voucher.usageLimit) * 100)}% terpakai
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {voucher.startDate}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {voucher.endDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(voucher.status)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingVoucher(voucher)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyCode(voucher.code)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Salin Kode
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(voucher.id, voucher.status === 'active' ? 'inactive' : 'active')}>
                            {voucher.status === 'active' ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Nonaktifkan
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Aktifkan
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteVoucher(voucher.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredVouchers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada voucher ditemukan</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Coba ubah filter pencarian Anda'
                  : 'Mulai dengan membuat voucher pertama Anda'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Voucher Pertama
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        {editingVoucher && (
          <Dialog open={!!editingVoucher} onOpenChange={() => setEditingVoucher(null)}>
            <VoucherDialog
              voucher={editingVoucher}
              onSubmit={handleEditVoucher}
            />
          </Dialog>
        )}
      </div>
    </TenantLayout>
  );
}

function VoucherDialog({ voucher, onSubmit }: any) {
  const [formData, setFormData] = useState({
    code: voucher?.code || '',
    name: voucher?.name || '',
    description: voucher?.description || '',
    type: voucher?.type || 'percentage',
    value: voucher?.value || '',
    minPurchase: voucher?.minPurchase || '',
    maxDiscount: voucher?.maxDiscount || '',
    usageLimit: voucher?.usageLimit || '',
    startDate: voucher?.startDate || new Date().toISOString().split('T')[0],
    endDate: voucher?.endDate || '',
    applicableProducts: voucher?.applicableProducts || 'all',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: '',
      minPurchase: '',
      maxDiscount: '',
      usageLimit: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      applicableProducts: 'all',
    });
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          {voucher ? 'Edit Voucher' : 'Buat Voucher Baru'}
        </DialogTitle>
        <DialogDescription>
          {voucher ? 'Perbarui informasi voucher' : 'Buat voucher diskon untuk menarik lebih banyak pelanggan'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Kode Voucher</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="DISKON20"
              className="font-mono"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nama Voucher</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Diskon Spesial"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Deskripsi voucher"
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipe Diskon</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Persentase (%)</SelectItem>
                <SelectItem value="fixed">Nominal Tetap ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value">
              Nilai Diskon {formData.type === 'percentage' ? '(%)' : '($)'}
            </Label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              placeholder={formData.type === 'percentage' ? '20' : '50'}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minPurchase">Minimal Pembelian ($)</Label>
            <Input
              id="minPurchase"
              type="number"
              value={formData.minPurchase}
              onChange={(e) => setFormData(prev => ({ ...prev, minPurchase: e.target.value }))}
              placeholder="100"
              required
            />
          </div>
          
          {formData.type === 'percentage' && (
            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Maksimal Diskon ($)</Label>
              <Input
                id="maxDiscount"
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                placeholder="50"
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="usageLimit">Batas Penggunaan</Label>
          <Input
            id="usageLimit"
            type="number"
            value={formData.usageLimit}
            onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
            placeholder="100"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Tanggal Mulai</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">Tanggal Berakhir</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="applicableProducts">Berlaku Untuk</Label>
          <Select 
            value={formData.applicableProducts} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, applicableProducts: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Produk</SelectItem>
              <SelectItem value="specific">Produk Tertentu</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit">
            {voucher ? 'Perbarui' : 'Buat'} Voucher
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
