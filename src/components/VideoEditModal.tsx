import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  views: number;
  duration: number;
  category: string;
  uploadDate: string;
  status: string;
  tags: string[];
  resolution: string;
  fileSize: string;
}

interface VideoEditModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (video: Video) => void;
}

export default function VideoEditModal({ video, isOpen, onClose, onSave }: VideoEditModalProps) {
  const [formData, setFormData] = useState<Video>({
    id: '',
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    views: 0,
    duration: 0,
    category: '',
    uploadDate: '',
    status: 'draft',
    tags: [],
    resolution: '1080p',
    fileSize: '0 MB'
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (video) {
      setFormData(video);
    } else {
      // Reset form for new video
      setFormData({
        id: `v${Date.now()}`,
        title: '',
        description: '',
        thumbnail: '',
        videoUrl: '',
        views: 0,
        duration: 0,
        category: '',
        uploadDate: new Date().toISOString(),
        status: 'draft',
        tags: [],
        resolution: '1080p',
        fileSize: '0 MB'
      });
    }
  }, [video]);

  const handleInputChange = (field: keyof Video, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (!formData.category) {
      toast.error('Category is required');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(formData);
    setIsLoading(false);
    onClose();
    
    toast.success(video ? 'Video updated successfully!' : 'Video created successfully!');
  };

  const categories = [
    'Tutorial',
    'Advanced',
    'Security',
    'Infrastructure',
    'Analytics',
    'Mobile',
    'Live Streaming',
    'Technical'
  ];

  const resolutions = ['720p', '1080p', '4K', '8K'];
  const statuses = ['draft', 'published', 'private', 'unlisted'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {video ? 'Edit Video' : 'Add New Video'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter video title"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter video description"
              rows={4}
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resolution and File Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resolution">Resolution</Label>
              <Select value={formData.resolution} onValueChange={(value) => handleInputChange('resolution', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resolutions.map(resolution => (
                    <SelectItem key={resolution} value={resolution}>
                      {resolution}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fileSize">File Size</Label>
              <Input
                id="fileSize"
                value={formData.fileSize}
                onChange={(e) => handleInputChange('fileSize', e.target.value)}
                placeholder="e.g., 45.2 MB"
              />
            </div>
          </div>

          {/* Video URL and Thumbnail */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                placeholder="Enter video URL"
              />
            </div>

            <div>
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                placeholder="Enter thumbnail URL"
              />
            </div>
          </div>

          {/* Duration (in seconds) */}
          <div>
            <Label htmlFor="duration">Duration (seconds)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
              placeholder="Enter duration in seconds"
            />
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : (video ? 'Update Video' : 'Create Video')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
