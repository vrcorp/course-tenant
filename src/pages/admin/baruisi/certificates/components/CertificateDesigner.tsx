import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Type, 
  Image as ImageIcon, 
  PenTool, 
  Upload,
  Move,
  Trash2,
  Eye,
  Download,
  Plus,
  Settings
} from 'lucide-react';
import { Certificate, CertificateElement } from '../types';

interface Props {
  certificate: Certificate;
  onSave: (certificate: Certificate) => void;
  onClose: () => void;
}

const CertificateDesigner: React.FC<Props> = ({ certificate, onSave, onClose }) => {
  const [editingCertificate, setEditingCertificate] = useState<Certificate>(certificate);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleElementUpdate = (elementId: string, updates: Partial<CertificateElement>) => {
    setEditingCertificate(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
  };

  const handleAddElement = (type: CertificateElement['type']) => {
    const newElement: CertificateElement = {
      id: `element-${Date.now()}`,
      type,
      content: type === 'text' ? 'New Text' : type === 'signature' ? 'Signature' : '',
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 150,
      height: type === 'text' ? 40 : 80,
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#000000',
      fontWeight: 'normal',
      textAlign: 'left'
    };

    setEditingCertificate(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
    setSelectedElement(newElement.id);
  };

  const handleDeleteElement = (elementId: string) => {
    setEditingCertificate(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    }));
    setSelectedElement(null);
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    setSelectedElement(elementId);
    setIsDragging(true);
    
    const element = editingCertificate.elements.find(el => el.id === elementId);
    if (element && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - element.x,
        y: e.clientY - rect.top - element.y
      });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && selectedElement && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      
      handleElementUpdate(selectedElement, { x: newX, y: newY });
    }
  }, [isDragging, selectedElement, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingCertificate(prev => ({
          ...prev,
          backgroundImage: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedElementData = selectedElement 
    ? editingCertificate.elements.find(el => el.id === selectedElement)
    : null;

  const handleSave = () => {
    onSave({
      ...editingCertificate,
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex">
      {/* Sidebar - Tools & Properties */}
      <div className="w-80 border-r bg-muted/30 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Certificate Designer</h2>
            <p className="text-sm text-muted-foreground">{editingCertificate.name}</p>
          </div>

          {/* Certificate Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Certificate Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Name</Label>
                <Input
                  value={editingCertificate.name}
                  onChange={(e) => setEditingCertificate(prev => ({ ...prev, name: e.target.value }))}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={editingCertificate.description}
                  onChange={(e) => setEditingCertificate(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={editingCertificate.width}
                    onChange={(e) => setEditingCertificate(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={editingCertificate.height}
                    onChange={(e) => setEditingCertificate(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                    className="h-8"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Background Image</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 text-xs"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Elements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Add Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddElement('text')}
                className="w-full justify-start h-8"
              >
                <Type className="h-3 w-3 mr-2" />
                Add Text
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddElement('image')}
                className="w-full justify-start h-8"
              >
                <ImageIcon className="h-3 w-3 mr-2" />
                Add Image
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddElement('signature')}
                className="w-full justify-start h-8"
              >
                <PenTool className="h-3 w-3 mr-2" />
                Add Signature
              </Button>
            </CardContent>
          </Card>

          {/* Element Properties */}
          {selectedElementData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Element Properties
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteElement(selectedElementData.id)}
                    className="h-6 w-6 p-0 text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Content</Label>
                  <Textarea
                    value={selectedElementData.content}
                    onChange={(e) => handleElementUpdate(selectedElementData.id, { content: e.target.value })}
                    rows={2}
                    className="text-xs"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">X Position</Label>
                    <Input
                      type="number"
                      value={selectedElementData.x}
                      onChange={(e) => handleElementUpdate(selectedElementData.id, { x: parseInt(e.target.value) })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Y Position</Label>
                    <Input
                      type="number"
                      value={selectedElementData.y}
                      onChange={(e) => handleElementUpdate(selectedElementData.id, { y: parseInt(e.target.value) })}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Width</Label>
                    <Input
                      type="number"
                      value={selectedElementData.width}
                      onChange={(e) => handleElementUpdate(selectedElementData.id, { width: parseInt(e.target.value) })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Height</Label>
                    <Input
                      type="number"
                      value={selectedElementData.height}
                      onChange={(e) => handleElementUpdate(selectedElementData.id, { height: parseInt(e.target.value) })}
                      className="h-8"
                    />
                  </div>
                </div>

                {selectedElementData.type === 'text' && (
                  <>
                    <div>
                      <Label className="text-xs">Font Size</Label>
                      <Input
                        type="number"
                        value={selectedElementData.fontSize}
                        onChange={(e) => handleElementUpdate(selectedElementData.id, { fontSize: parseInt(e.target.value) })}
                        className="h-8"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Font Family</Label>
                      <Select
                        value={selectedElementData.fontFamily}
                        onValueChange={(value) => handleElementUpdate(selectedElementData.id, { fontFamily: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Color</Label>
                      <Input
                        type="color"
                        value={selectedElementData.color}
                        onChange={(e) => handleElementUpdate(selectedElementData.id, { color: e.target.value })}
                        className="h-8 w-full"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Font Weight</Label>
                      <Select
                        value={selectedElementData.fontWeight}
                        onValueChange={(value: 'normal' | 'bold') => handleElementUpdate(selectedElementData.id, { fontWeight: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Text Align</Label>
                      <Select
                        value={selectedElementData.textAlign}
                        onValueChange={(value: 'left' | 'center' | 'right') => handleElementUpdate(selectedElementData.id, { textAlign: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              ← Back
            </Button>
            <div className="text-sm text-muted-foreground">
              {editingCertificate.width} × {editingCertificate.height}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-8 bg-gray-100 overflow-auto">
          <div className="flex justify-center">
            <div
              ref={canvasRef}
              className="relative bg-white shadow-lg"
              style={{
                width: editingCertificate.width,
                height: editingCertificate.height,
                backgroundImage: editingCertificate.backgroundImage ? `url(${editingCertificate.backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {editingCertificate.elements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-move border-2 ${
                    selectedElement === element.id ? 'border-blue-500' : 'border-transparent hover:border-blue-300'
                  }`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, element.id)}
                >
                  {element.type === 'text' && (
                    <div
                      className="w-full h-full flex items-center"
                      style={{
                        fontSize: element.fontSize,
                        fontFamily: element.fontFamily,
                        color: element.color,
                        fontWeight: element.fontWeight,
                        textAlign: element.textAlign,
                        justifyContent: element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {element.content}
                    </div>
                  )}
                  {element.type === 'signature' && (
                    <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
                      {element.content}
                    </div>
                  )}
                  {element.type === 'image' && (
                    <div className="w-full h-full border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
                      Image Placeholder
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
            <DialogDescription>
              Preview of how the certificate will look when generated
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            <div
              className="relative bg-white"
              style={{
                width: editingCertificate.width * 0.8,
                height: editingCertificate.height * 0.8,
                backgroundImage: editingCertificate.backgroundImage ? `url(${editingCertificate.backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {editingCertificate.elements.map((element) => (
                <div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: element.x * 0.8,
                    top: element.y * 0.8,
                    width: element.width * 0.8,
                    height: element.height * 0.8,
                  }}
                >
                  {element.type === 'text' && (
                    <div
                      className="w-full h-full flex items-center"
                      style={{
                        fontSize: (element.fontSize || 16) * 0.8,
                        fontFamily: element.fontFamily,
                        color: element.color,
                        fontWeight: element.fontWeight,
                        textAlign: element.textAlign,
                        justifyContent: element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {element.content.replace('{{studentName}}', 'John Doe')
                        .replace('{{courseName}}', 'Sample Course')
                        .replace('{{completionDate}}', new Date().toLocaleDateString())}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificateDesigner;
