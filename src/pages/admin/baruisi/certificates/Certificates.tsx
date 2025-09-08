import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Award,
  FileImage,
  Settings,
  Copy,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { Certificate } from './types';
import { certificatesData } from './data';
import CertificateDesigner from './components/CertificateDesigner';

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [designingCertificate, setDesigningCertificate] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    issuer: ''
  });

  useEffect(() => {
    setCertificates(certificatesData);
    setFilteredCertificates(certificatesData);
  }, []);

  useEffect(() => {
    let filtered = certificates;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cert =>
        cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cert => 
        statusFilter === 'published' ? cert.published : !cert.published
      );
    }

    setFilteredCertificates(filtered);
  }, [certificates, searchTerm, statusFilter]);

  const handleAddCertificate = () => {
    setEditingCertificate(null);
    setFormData({ name: '', description: '', issuer: '' });
    setIsAddDialogOpen(true);
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setFormData({
      name: certificate.name,
      description: certificate.description,
      issuer: certificate.issuer
    });
    setIsAddDialogOpen(true);
  };

  const handleDesignCertificate = (certificate: Certificate) => {
    setDesigningCertificate(certificate);
  };

  const handleSubmitCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCertificate) {
      // Update existing certificate
      const updatedCertificates = certificates.map(cert => 
        cert.id === editingCertificate.id 
          ? { ...cert, ...formData, updatedAt: new Date().toISOString() }
          : cert
      );
      setCertificates(updatedCertificates);
      toast.success('Certificate updated successfully');
    } else {
      // Add new certificate
      const newCertificate: Certificate = {
        id: `cert-${Date.now()}`,
        ...formData,
        backgroundImage: 'https://placehold.co/800x600/f0f9ff/1e40af?text=New+Certificate',
        width: 800,
        height: 600,
        elements: [
          {
            id: 'title',
            type: 'text',
            content: 'Certificate of Completion',
            x: 400,
            y: 150,
            width: 600,
            height: 60,
            fontSize: 36,
            fontFamily: 'Arial',
            color: '#1e40af',
            fontWeight: 'bold',
            textAlign: 'center'
          },
          {
            id: 'student-name',
            type: 'text',
            content: '{{studentName}}',
            x: 400,
            y: 250,
            width: 500,
            height: 40,
            fontSize: 28,
            fontFamily: 'Arial',
            color: '#374151',
            fontWeight: 'normal',
            textAlign: 'center'
          }
        ],
        published: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCertificates(prev => [...prev, newCertificate]);
      toast.success('Certificate created successfully');
    }
    
    setIsAddDialogOpen(false);
  };

  const handleDeleteCertificate = (certificateId: string) => {
    setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
    toast.success('Certificate deleted successfully');
  };

  const handleTogglePublish = (certificateId: string) => {
    setCertificates(prev => prev.map(cert => 
      cert.id === certificateId 
        ? { ...cert, published: !cert.published, updatedAt: new Date().toISOString() }
        : cert
    ));
    const certificate = certificates.find(c => c.id === certificateId);
    toast.success(`Certificate ${certificate?.published ? 'unpublished' : 'published'} successfully`);
  };

  const handleDuplicateCertificate = (certificate: Certificate) => {
    const duplicatedCertificate: Certificate = {
      ...certificate,
      id: `cert-${Date.now()}`,
      name: `${certificate.name} (Copy)`,
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCertificates(prev => [...prev, duplicatedCertificate]);
    toast.success('Certificate duplicated successfully');
  };

  const handleSaveDesign = (updatedCertificate: Certificate) => {
    setCertificates(prev => prev.map(cert => 
      cert.id === updatedCertificate.id ? updatedCertificate : cert
    ));
    setDesigningCertificate(null);
    toast.success('Certificate design saved successfully');
  };

  const getStatusBadge = (published: boolean) => {
    return (
      <Badge className={published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
        {published ? 'Published' : 'Draft'}
      </Badge>
    );
  };

  if (designingCertificate) {
    return (
      <CertificateDesigner
        certificate={designingCertificate}
        onSave={handleSaveDesign}
        onClose={() => setDesigningCertificate(null)}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Certificate Templates</h1>
          <p className="text-muted-foreground">Create and manage certificate templates for your courses</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {certificates.filter(c => c.published).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {certificates.filter(c => !c.published).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Elements</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {certificates.reduce((sum, cert) => sum + cert.elements.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <Button onClick={handleAddCertificate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Certificates Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Elements</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCertificates.map((certificate) => (
              <TableRow key={certificate.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{certificate.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {certificate.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{certificate.issuer}</TableCell>
                <TableCell>{certificate.elements.length} elements</TableCell>
                <TableCell>{getStatusBadge(certificate.published)}</TableCell>
                <TableCell>{new Date(certificate.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDesignCertificate(certificate)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Design Template
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditCertificate(certificate)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateCertificate(certificate)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTogglePublish(certificate.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {certificate.published ? 'Unpublish' : 'Publish'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export Template
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteCertificate(certificate.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Certificate Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCertificate ? 'Edit Certificate Template' : 'Create New Certificate Template'}
            </DialogTitle>
            <DialogDescription>
              {editingCertificate ? 'Update certificate information' : 'Create a new certificate template for your courses'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitCertificate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter template name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this certificate template"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuer">Issuer</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                placeholder="Organization or institution name"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCertificate ? 'Update Template' : 'Create Template'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
