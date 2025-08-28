import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { User } from './types';
import { usersData } from './data';
import {
  UserCard,
  UserTable,
  UserDetailModal,
  UserEditModal,
  StatsCards,
  SearchAndFilters
} from './components';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>(usersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role,
      location: user.location,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User berhasil dihapus');
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setEditForm({
      name: '',
      email: '',
      phone: '',
      status: 'active',
      role: 'user',
      location: '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      if (selectedUser) {
        // EDIT USER
        setUsers(users.map(u => 
          u.id === selectedUser.id 
            ? {
                ...u,
                name: editForm.name || u.name,
                email: editForm.email || u.email,
                phone: editForm.phone || u.phone,
                status: editForm.status || u.status,
                location: editForm.location || u.location,
                avatar: editForm.avatar || u.avatar,
                verified: typeof editForm.verified === 'boolean' ? editForm.verified : u.verified
              }
            : u
        ));
        toast.success('Data user berhasil diperbarui');
      } else {
        // TAMBAH USER BARU
        const newUser: User = {
          id: Date.now().toString(),
          name: editForm.name || "",
          email: editForm.email || "",
          phone: editForm.phone || "",
          status: editForm.status || "active",
          role: 'user',
          location: editForm.location || "",
          joinDate: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          avatar: "",
          verified: true,
          hasLmsTenant: false,
          tenantSlug: null,
          coursesProgress: []
        };
        
        setUsers([...users, newUser]);
        toast.success('User baru berhasil ditambahkan');
      }
  
      // Reset modal
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setEditForm({});
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setEditForm({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Users</h1>
          <p className="text-muted-foreground">
            Kelola semua siswa dan pengguna platform
          </p>
        </div>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards users={users} />

      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          {isMobile ? (
            <div className="p-4">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetail={handleViewDetail}
            />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />

      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        editForm={editForm}
        setEditForm={setEditForm}
      />
    </div>
  );
};

export default AdminUsers;
