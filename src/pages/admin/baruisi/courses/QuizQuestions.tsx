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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  ArrowLeft, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  FileQuestion,
  Image,
  Video,
  Music,
  Paperclip,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import quizzesData from '@/data/quizzes.json';
import coursesData from '@/data/courses.json';

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  answer: string | number | boolean;
  explanation?: string;
  media?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    name: string;
  }[];
}

interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number;
  passingScore: number;
  status: string;
  createdAt: string;
  questions: Question[];
}

export default function QuizQuestions() {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [formData, setFormData] = useState({
    type: 'multiple_choice' as Question['type'],
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    media: [] as Question['media']
  });

  useEffect(() => {
    // Find course and quiz
    const foundCourse = (coursesData as any).courses?.find((c: any) => c.id === courseId);
    const foundQuiz = (quizzesData as any).quizzes?.find((q: any) => q.id === quizId);
    
    setCourse(foundCourse);
    setQuiz(foundQuiz);
    
    if (foundQuiz) {
      setQuestions(foundQuiz.questions || []);
      setFilteredQuestions(foundQuiz.questions || []);
    }
  }, [courseId, quizId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = questions.filter(q =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuestions(filtered);
    } else {
      setFilteredQuestions(questions);
    }
  }, [searchTerm, questions]);

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      answer: '',
      explanation: '',
      media: []
    });
    setIsAddDialogOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      type: question.type,
      question: question.question,
      options: question.options || ['', '', '', ''],
      answer: question.answer.toString(),
      explanation: question.explanation || '',
      media: question.media || []
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newQuestion: Question = {
      id: editingQuestion?.id || `q_${Date.now()}`,
      type: formData.type,
      question: formData.question,
      options: formData.type === 'multiple_choice' ? formData.options.filter(opt => opt.trim()) : undefined,
      answer: formData.type === 'multiple_choice' ? parseInt(formData.answer) : 
              formData.type === 'true_false' ? formData.answer === 'true' : 
              formData.answer,
      explanation: formData.explanation,
      media: formData.media
    };

    if (editingQuestion) {
      setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? newQuestion : q));
      toast.success('Question updated successfully');
    } else {
      setQuestions(prev => [...prev, newQuestion]);
      toast.success('Question added successfully');
    }

    setIsAddDialogOpen(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    toast.success('Question deleted successfully');
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels = {
      multiple_choice: 'Multiple Choice',
      true_false: 'True/False',
      short_answer: 'Short Answer',
      essay: 'Essay'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getQuestionTypeBadge = (type: string) => {
    const variants = {
      multiple_choice: 'bg-blue-100 text-blue-800',
      true_false: 'bg-green-100 text-green-800',
      short_answer: 'bg-yellow-100 text-yellow-800',
      essay: 'bg-purple-100 text-purple-800'
    };
    return (
      <Badge className={variants[type as keyof typeof variants] || variants.multiple_choice}>
        {getQuestionTypeLabel(type)}
      </Badge>
    );
  };

  const addMediaFile = (type: 'image' | 'video' | 'audio' | 'file') => {
    // Simulate file upload - in real app, this would handle actual file upload
    const newMedia = {
      type,
      url: `https://example.com/${type}-${Date.now()}`,
      name: `${type}-file-${Date.now()}.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : type === 'audio' ? 'mp3' : 'pdf'}`
    };
    setFormData(prev => ({
      ...prev,
      media: [...(prev.media || []), newMedia]
    }));
  };

  const removeMediaFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media?.filter((_, i) => i !== index) || []
    }));
  };

  if (!course || !quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with breadcrumb */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`/admin/courses/${courseId}/quizzes`)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{quiz.title} - Questions</h1>
          <p className="text-muted-foreground">{course.title} • {quiz.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Multiple Choice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questions.filter(q => q.type === 'multiple_choice').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Essay Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questions.filter(q => q.type === 'essay').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questions.filter(q => q.media && q.media.length > 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddQuestion} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {/* Questions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.map((question, index) => (
              <TableRow key={question.id}>
                <TableCell>
                  <div className="max-w-md">
                    <div className="font-medium line-clamp-2">{question.question}</div>
                    {question.explanation && (
                      <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {question.explanation}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getQuestionTypeBadge(question.type)}</TableCell>
                <TableCell>
                  {question.media && question.media.length > 0 ? (
                    <div className="flex gap-1">
                      {question.media.map((media, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {media.type}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  {question.type === 'multiple_choice' && question.options ? (
                    <span className="text-sm">
                      Option {(question.answer as number) + 1}
                    </span>
                  ) : question.type === 'true_false' ? (
                    <span className="text-sm">
                      {question.answer ? 'True' : 'False'}
                    </span>
                  ) : (
                    <span className="text-sm line-clamp-1">
                      {question.answer.toString()}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditQuestion(question)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Question
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteQuestion(question.id)}
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

      {/* Add/Edit Question Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </DialogTitle>
            <DialogDescription>
              Create or modify a question for this quiz
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <div className="space-y-2">
              <Label>Question Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: Question['type']) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="true_false">True/False</SelectItem>
                  <SelectItem value="short_answer">Short Answer</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Question</Label>
              <Textarea
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter your question here..."
                rows={3}
                required
              />
            </div>

            {/* Multiple Choice Options */}
            {formData.type === 'multiple_choice' && (
              <div className="space-y-2">
                <Label>Options</Label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-sm font-medium w-8">{index + 1}.</span>
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index] = e.target.value;
                        setFormData(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  <Select 
                    value={formData.answer} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, answer: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct option" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.options.map((option, index) => (
                        option.trim() && (
                          <SelectItem key={index} value={index.toString()}>
                            Option {index + 1}: {option}
                          </SelectItem>
                        )
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* True/False Answer */}
            {formData.type === 'true_false' && (
              <div className="space-y-2">
                <Label>Correct Answer</Label>
                <Select 
                  value={formData.answer} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, answer: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Short Answer/Essay Answer */}
            {(formData.type === 'short_answer' || formData.type === 'essay') && (
              <div className="space-y-2">
                <Label>Sample Answer</Label>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Enter sample or expected answer..."
                  rows={formData.type === 'essay' ? 4 : 2}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Explanation (Optional)</Label>
              <Textarea
                value={formData.explanation}
                onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                placeholder="Explain the correct answer..."
                rows={2}
              />
            </div>

            {/* Media Attachments */}
            <div className="space-y-2">
              <Label>Media Attachments</Label>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addMediaFile('image')}
                  className="gap-2"
                >
                  <Image className="h-4 w-4" />
                  Image
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addMediaFile('video')}
                  className="gap-2"
                >
                  <Video className="h-4 w-4" />
                  Video
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addMediaFile('audio')}
                  className="gap-2"
                >
                  <Music className="h-4 w-4" />
                  Audio
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addMediaFile('file')}
                  className="gap-2"
                >
                  <Paperclip className="h-4 w-4" />
                  File
                </Button>
              </div>
              
              {formData.media && formData.media.length > 0 && (
                <div className="space-y-2">
                  {formData.media.map((media, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <Badge variant="outline">{media.type}</Badge>
                      <span className="text-sm flex-1">{media.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMediaFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
