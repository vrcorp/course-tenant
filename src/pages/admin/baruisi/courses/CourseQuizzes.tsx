import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  Target,
  FileQuestion
} from 'lucide-react';
import { toast } from 'sonner';
import quizzesData from '@/data/quizzes.json';
import coursesData from '@/data/courses.json';

interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  questions: any[];
}

const CourseQuizzes: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [course, setCourse] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 10,
    passingScore: 70,
    status: 'draft' as Quiz['status']
  });

  useEffect(() => {
    // Find course
    const foundCourse = (coursesData as any).courses?.find((c: any) => c.id === courseId);
    setCourse(foundCourse);

    // Load quizzes for this course
    const courseQuizzes = (quizzesData as any).quizzes?.filter((q: any) => q.courseId === courseId) || [];
    setQuizzes(courseQuizzes);
    setFilteredQuizzes(courseQuizzes);
  }, [courseId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuizzes(filtered);
    } else {
      setFilteredQuizzes(quizzes);
    }
  }, [searchTerm, quizzes]);

  const handleViewQuestions = (quizId: string) => {
    navigate(`/admin/courses/${courseId}/quizzes/${quizId}/questions`);
  };

  const handleAddQuiz = () => {
    setEditingQuiz(null);
    setFormData({
      title: '',
      description: '',
      duration: 10,
      passingScore: 70,
      status: 'draft'
    });
    setIsAddDialogOpen(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      passingScore: quiz.passingScore,
      status: quiz.status
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingQuiz) {
      // Update existing quiz
      const updatedQuizzes = quizzes.map(q => 
        q.id === editingQuiz.id 
          ? { ...q, ...formData }
          : q
      );
      setQuizzes(updatedQuizzes);
      toast.success('Quiz updated successfully');
    } else {
      // Add new quiz
      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`,
        courseId: courseId!,
        ...formData,
        createdAt: new Date().toISOString(),
        questions: []
      };
      setQuizzes(prev => [...prev, newQuiz]);
      toast.success('Quiz added successfully');
    }
    
    setIsAddDialogOpen(false);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    toast.success('Quiz deleted successfully');
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.draft}>
        {status === 'draft' ? 'Draft' : status === 'published' ? 'Published' : 'Archived'}
      </Badge>
    );
  };

  if (!course) {
    return <div className="p-6">Course not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/admin/courses')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{course.title} - Quizzes</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quizzes.filter(q => q.status === 'published').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quizzes.length > 0 
                ? Math.round(quizzes.reduce((sum, quiz) => sum + quiz.duration, 0) / quizzes.length)
                : 0
              } min
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddQuiz} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Quiz
        </Button>
      </div>

      {/* Quizzes Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Passing Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{quiz.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {quiz.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{quiz.questions.length}</TableCell>
                <TableCell>{quiz.duration} min</TableCell>
                <TableCell>{quiz.passingScore}%</TableCell>
                <TableCell>{getStatusBadge(quiz.status)}</TableCell>
                <TableCell>{new Date(quiz.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewQuestions(quiz.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Questions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditQuiz(quiz)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Quiz
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteQuiz(quiz.id)}
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

      {/* Add/Edit Quiz Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingQuiz ? 'Edit Quiz' : 'Add New Quiz'}
            </DialogTitle>
            <DialogDescription>
              {editingQuiz ? 'Update quiz information' : 'Create a new quiz for this course'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitQuiz} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Quiz description"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.passingScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: Quiz['status']) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingQuiz ? 'Update Quiz' : 'Add Quiz'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseQuizzes;
