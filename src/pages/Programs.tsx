import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Users, 
  Clock, 
  Star, 
  DollarSign, 
  Play,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { programs } from "@/data/dummy";

export default function Programs() {
  const getPriceColor = (type: string) => {
    switch (type) {
      case 'subscription': return 'bg-primary';
      case 'ppv': return 'bg-success';
      case 'rental': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  const getPriceLabel = (type: string) => {
    switch (type) {
      case 'subscription': return 'Subscription';
      case 'ppv': return 'Pay Per View';
      case 'rental': return 'Rental';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Learning Programs</h1>
          <p className="text-muted-foreground">Manage your educational programs and courses</p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Program
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs.length}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>+2 this month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {programs.reduce((acc, program) => acc + program.students, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Across all programs
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(programs.reduce((acc, program) => acc + program.rating, 0) / programs.length).toFixed(1)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-current text-warning" />
              <span>Student ratings</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${programs.reduce((acc, program) => acc + (program.price * program.students), 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Estimated total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="group hover:shadow-medium transition-all duration-200">
            <div className="relative">
              <img
                src={program.thumbnail}
                alt={program.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-4 right-4">
                <Badge className={getPriceColor(program.type)}>
                  {getPriceLabel(program.type)}
                </Badge>
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-lg flex items-center justify-center">
                <Button size="sm" variant="secondary">
                  <Play className="h-4 w-4 mr-2" />
                  View Program
                </Button>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{program.title}</CardTitle>
                <div className="text-xl font-bold text-primary">
                  ${program.price}
                </div>
              </div>
              <CardDescription className="line-clamp-2">
                {program.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Instructor */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${program.instructor}`} />
                  <AvatarFallback>{program.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{program.instructor}</div>
                  <div className="text-muted-foreground">Instructor</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{program.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-warning fill-current" />
                  <span>{program.rating} rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{program.courses.length || 'TBD'} courses</span>
                </div>
              </div>

              {/* Progress Bar for enrollment */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Enrollment Progress</span>
                  <span>{Math.min(100, Math.round((program.students / 1000) * 100))}%</span>
                </div>
                <Progress 
                  value={Math.min(100, (program.students / 1000) * 100)} 
                  className="h-2" 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit Program
                </Button>
                <Button size="sm" className="flex-1">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Program Card */}
      <Card className="border-dashed border-2 hover:border-primary transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold">Create New Program</h3>
            <p className="text-sm text-muted-foreground">Start building your next learning program</p>
          </div>
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Program
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}