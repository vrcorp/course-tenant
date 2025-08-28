// Re-export the modular Users component
export { default } from './users/Users';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'user' | 'admin' | 'affiliator' | 'instructor';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastLogin: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  totalSpent: string;
  location: string;
  verified: boolean;
}

// Dummy data for users/students
const usersData: User[] = [
  {
    id: 1,
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@example.com',
    phone: '+62 812-3456-7890',
    avatar: '/avatars/user1.jpg',
    role: 'user',
    status: 'active',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-20',
    coursesEnrolled: 5,
    coursesCompleted: 3,
    totalSpent: 'Rp 2,500,000',
    location: 'Jakarta, Indonesia',
    verified: true
  },
  {
    id: 2,
    name: 'Sari Dewi',
    email: 'sari.dewi@example.com',
    phone: '+62 813-4567-8901',
    avatar: '/avatars/user2.jpg',
    role: 'user',
    status: 'active',
    joinDate: '2023-02-20',
    lastLogin: '2024-01-19',
    coursesEnrolled: 8,
    coursesCompleted: 6,
    totalSpent: 'Rp 4,200,000',
    location: 'Bandung, Indonesia',
    verified: true
  },
  {
    id: 3,
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    phone: '+62 814-5678-9012',
    avatar: '/avatars/user3.jpg',
    role: 'user',
    status: 'inactive',
    joinDate: '2023-03-10',
    lastLogin: '2023-12-15',
    coursesEnrolled: 2,
    coursesCompleted: 1,
    totalSpent: 'Rp 800,000',
    location: 'Surabaya, Indonesia',
    verified: false
  },
  {
    id: 4,
    name: 'Lisa Permata',
    email: 'lisa.permata@example.com',
    phone: '+62 815-6789-0123',
    avatar: '/avatars/user4.jpg',
    role: 'user',
    status: 'active',
    joinDate: '2023-04-05',
    lastLogin: '2024-01-21',
    coursesEnrolled: 12,
    coursesCompleted: 9,
    totalSpent: 'Rp 6,800,000',
    location: 'Yogyakarta, Indonesia',
    verified: true
  },
  {
    id: 5,
    name: 'Andi Wijaya',
    email: 'andi.wijaya@example.com',
    phone: '+62 816-7890-1234',
    avatar: '/avatars/user5.jpg',
    role: 'user',
    status: 'suspended',
    joinDate: '2023-05-12',
    lastLogin: '2023-11-30',
    coursesEnrolled: 3,
    coursesCompleted: 0,
    totalSpent: 'Rp 1,200,000',
    location: 'Medan, Indonesia',
    verified: false
  },
  {
    id: 6,
    name: 'Maya Sari',
    email: 'maya.sari@example.com',
    phone: '+62 817-8901-2345',
    avatar: '/avatars/user6.jpg',
    role: 'user',
    status: 'active',
    joinDate: '2023-06-18',
    lastLogin: '2024-01-18',
    coursesEnrolled: 7,
    coursesCompleted: 5,
    totalSpent: 'Rp 3,500,000',
    location: 'Makassar, Indonesia',
    verified: true
  }
];

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [users, setUsers] = useState<User[]>(usersData);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalRevenue = users.reduce((sum, u) => {
    const amount = parseInt(u.totalSpent.replace(/[^0-9]/g, ''));
    return sum + amount;
  }, 0);
  const avgCoursesPerUser = users.reduce((sum, u) => sum + u.coursesEnrolled, 0) / users.length;

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('User berhasil dihapus');
  };

  const handleSaveEdit = () => {
    if (editForm) {
      if (selectedUser) {
        // EDIT USER
        setUsers(users.map(u => 
          u.id === selectedUser.id ? { ...u, ...editForm } : u
        ));
        toast.success('Data user berhasil diperbarui');
      } else {
        // TAMBAH USER BARU
        const newUser: User = {
          id: Date.now(),
          name: editForm.name || "",
          email: editForm.email || "",
          phone: editForm.phone || "",
          status: editForm.status || "active",
          role: editForm.role || "user",
          location: editForm.location || "",
          coursesEnrolled: 0,
          coursesCompleted: 0,
          totalSpent: "0",
          joinDate: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          avatar: "",           // default kosong
          verified: false,      // default belum terverifikasi
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
  

  const UserCard = ({ user }: { user: User }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-lg">{user.name}</div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {user.email}
              </div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Phone className="h-3 w-3 mr-1" />
                {user.phone}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setSelectedUser(user);
                setIsDetailModalOpen(true);
              }}>
                <UserCheck className="mr-2 h-4 w-4" />
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteUser(user.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Status</div>
            <Badge 
              variant={user.status === 'active' ? 'default' : 
                      user.status === 'inactive' ? 'secondary' : 'destructive'}
            >
              {user.status === 'active' ? 'Aktif' : 
               user.status === 'inactive' ? 'Tidak Aktif' : 'Suspended'}
            </Badge>
          </div>
          <div>
            <div className="text-muted-foreground">Role</div>
            <Badge variant="outline">
              {user.role === 'user' ? 'Siswa' : user.role}
            </Badge>
          </div>
          <div>
            <div className="text-muted-foreground">Kursus</div>
            <div className="font-medium">{user.coursesEnrolled} terdaftar</div>
          </div>
          <div>
            <div className="text-muted-foreground">Total Belanja</div>
            <div className="font-medium">{user.totalSpent}</div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {user.location}
            <Calendar className="h-3 w-3 ml-4 mr-1" />
            Bergabung {new Date(user.joinDate).toLocaleDateString('id-ID')}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Siswa/Users</h1>
          <p className="text-muted-foreground">
            Kelola semua siswa dan pengguna platform
          </p>
        </div>
        <Button
  onClick={() => {
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
  }}
>
  <Plus className="mr-2 h-4 w-4" />
  Tambah User
</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers} aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Dari semua pembelian
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Kursus</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCoursesPerUser.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Per user
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((users.reduce((sum, u) => sum + u.coursesCompleted, 0) / 
                 users.reduce((sum, u) => sum + u.coursesEnrolled, 0)) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Tingkat penyelesaian
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Users</CardTitle>
          <CardDescription>
            Kelola dan monitor semua pengguna platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari user berdasarkan nama, email, atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Card View */}
          {isMobile ? (
            <div className="space-y-4">
              {filteredUsers.length > 10 ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Lihat Semua Users ({filteredUsers.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="h-[95vh] max-w-md overflow-hidden flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Daftar Users</DialogTitle>
                      <DialogDescription>
                        {filteredUsers.length} users ditemukan
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2">
                      {filteredUsers.map((user) => (
                        <UserCard key={user.id} user={user} />
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))
              )}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kursus</TableHead>
                    <TableHead>Total Belanja</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 15 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              Lihat Semua Users ({filteredUsers.length}) - Terlalu Banyak untuk Ditampilkan
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="h-[95vh] max-w-6xl overflow-hidden flex flex-col">
                            <DialogHeader>
                              <DialogTitle>Daftar Lengkap Users</DialogTitle>
                              <DialogDescription>
                                {filteredUsers.length} users ditemukan
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Kontak</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Kursus</TableHead>
                                    <TableHead>Total Belanja</TableHead>
                                    <TableHead>Lokasi</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                      <TableCell>
                                        <div className="flex items-center space-x-3">
                                          <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>
                                              {user.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                              Bergabung {new Date(user.joinDate).toLocaleDateString('id-ID')}
                                            </div>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="text-sm">
                                          <div>{user.email}</div>
                                          <div className="text-muted-foreground">{user.phone}</div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge 
                                          variant={user.status === 'active' ? 'default' : 
                                                  user.status === 'inactive' ? 'secondary' : 'destructive'}
                                        >
                                          {user.status === 'active' ? 'Aktif' : 
                                           user.status === 'inactive' ? 'Tidak Aktif' : 'Suspended'}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <div className="text-sm">
                                          <div>{user.coursesEnrolled} terdaftar</div>
                                          <div className="text-muted-foreground">{user.coursesCompleted} selesai</div>
                                        </div>
                                      </TableCell>
                                      <TableCell className="font-medium">{user.totalSpent}</TableCell>
                                      <TableCell>{user.location}</TableCell>
                                      <TableCell className="text-right">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => {
                                              setSelectedUser(user);
                                              setIsDetailModalOpen(true);
                                            }}>
                                              <UserCheck className="mr-2 h-4 w-4" />
                                              Detail
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                              <Edit className="mr-2 h-4 w-4" />
                                              Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              className="text-red-600"
                                              onClick={() => handleDeleteUser(user.id)}
                                            >
                                              <Trash2 className="mr-2 h-4 w-4" />
                                              Hapus
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Bergabung {new Date(user.joinDate).toLocaleDateString('id-ID')}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{user.email}</div>
                            <div className="text-muted-foreground">{user.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 
                                    user.status === 'inactive' ? 'secondary' : 'destructive'}
                          >
                            {user.status === 'active' ? 'Aktif' : 
                             user.status === 'inactive' ? 'Tidak Aktif' : 'Suspended'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{user.coursesEnrolled} terdaftar</div>
                            <div className="text-muted-foreground">{user.coursesCompleted} selesai</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{user.totalSpent}</TableCell>
                        <TableCell>{user.location}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setIsDetailModalOpen(true);
                              }}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Modal - always mounted at root, no DialogTrigger */}
      <Dialog open={isDetailModalOpen} onOpenChange={(open) => {
        setIsDetailModalOpen(open);
        if (!open) setSelectedUser(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail User</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant={selectedUser.status === 'active' ? 'default' : 
                              selectedUser.status === 'inactive' ? 'secondary' : 'destructive'}
                    >
                      {selectedUser.status === 'active' ? 'Aktif' : 
                       selectedUser.status === 'inactive' ? 'Tidak Aktif' : 'Suspended'}
                    </Badge>
                    <Badge variant="outline">
                      {selectedUser.role === 'user' ? 'Siswa' : selectedUser.role}
                    </Badge>
                    {selectedUser.verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Informasi Kontak</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedUser.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedUser.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Statistik Pembelajaran</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Kursus Terdaftar:</span>
                      <span className="text-sm font-medium">{selectedUser.coursesEnrolled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Kursus Selesai:</span>
                      <span className="text-sm font-medium">{selectedUser.coursesCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Belanja:</span>
                      <span className="text-sm font-medium">{selectedUser.totalSpent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tingkat Penyelesaian:</span>
                      <span className="text-sm font-medium">
                        {selectedUser.coursesEnrolled > 0 
                          ? Math.round((selectedUser.coursesCompleted / selectedUser.coursesEnrolled) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Informasi Akun</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tanggal Bergabung:</span>
                    <span className="text-sm font-medium">
                      {new Date(selectedUser.joinDate).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Login Terakhir:</span>
                    <span className="text-sm font-medium">
                      {new Date(selectedUser.lastLogin).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Edit Modal - always mounted at root, no DialogTrigger */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        setIsEditModalOpen(open);
        if (!open) {
          setSelectedUser(null);
          setEditForm({});
        }
      }}>
        <DialogContent className="max-w-md max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Edit User" : "Tambah User"}</DialogTitle>
            <DialogDescription>
              {selectedUser ? "Ubah informasi user" : "Masukkan informasi user baru"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama</label>
                <Input
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Masukkan nama"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="Masukkan email"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Telepon</label>
                <Input
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="Masukkan nomor telepon"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={editForm.status || 'active'} 
                  onValueChange={(value: 'active' | 'inactive' | 'suspended') => 
                    setEditForm({ ...editForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select 
                  value={editForm.role || 'user'} 
                  onValueChange={(value: 'user' | 'admin' | 'affiliator' | 'instructor') => 
                    setEditForm({ ...editForm, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Siswa</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="affiliator">Affiliator</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Lokasi</label>
                <Input
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="Masukkan lokasi"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedUser(null);
                    setEditForm({});
                  }}
                >
                  Batal
                </Button>
                <Button onClick={handleSaveEdit}>
                  Simpan
                </Button>
              </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
