import { useEffect, useState } from "react";
import seed from "@/data/admin_site_settings.json";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { loadObject, saveObject, STORE_KEYS } from "@/lib/dataStore";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Save, X, Globe, Image, FileText, Upload, Link } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SiteSettings { 
  websiteName: string; 
  logoUrl: string; 
  about: string;
  tagline?: string;
  contactEmail?: string;
  supportPhone?: string;
}

export default function AdminSiteSettings() {
  const { toast } = useToast();
  const [form, setForm] = useState<SiteSettings>({ 
    websiteName: "", 
    logoUrl: "", 
    about: "",
    tagline: "",
    contactEmail: "",
    supportPhone: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<SiteSettings>>({});
  const [logoMode, setLogoMode] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const initial = loadObject<SiteSettings>(STORE_KEYS.siteSettings, seed as any);
        setForm({
          websiteName: initial.websiteName || "",
          logoUrl: initial.logoUrl || "",
          about: initial.about || "",
          tagline: initial.tagline || "",
          contactEmail: initial.contactEmail || "",
          supportPhone: initial.supportPhone || ""
        });
      } catch (error) {
        console.error('Error loading site settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load site settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SiteSettings> = {};

    if (!form.websiteName.trim()) {
      newErrors.websiteName = 'Website name is required';
    } else if (form.websiteName.length < 2) {
      newErrors.websiteName = 'Website name must be at least 2 characters';
    }

    if (form.logoUrl && !isValidUrl(form.logoUrl)) {
      newErrors.logoUrl = 'Please enter a valid URL';
    }

    if (form.contactEmail && !isValidEmail(form.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (!form.about.trim()) {
      newErrors.about = 'About section is required';
    } else if (form.about.length < 10) {
      newErrors.about = 'About section must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const simulateFileUpload = async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate uploaded file URL (in real app, this would be actual upload)
    const mockUploadedUrls = [
      'https://placehold.co/200x80/3b82f6/ffffff?text=Logo1',
      'https://placehold.co/200x80/10b981/ffffff?text=Logo2',
      'https://placehold.co/200x80/f59e0b/ffffff?text=Logo3',
      'https://placehold.co/200x80/ef4444/ffffff?text=Logo4',
      'https://placehold.co/200x80/8b5cf6/ffffff?text=Logo5'
    ];
    
    // Return random mock URL based on file name hash
    const hash = file.name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return mockUploadedUrls[Math.abs(hash) % mockUploadedUrls.length];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      toast({
        title: 'Uploading...',
        description: 'Please wait while we upload your logo',
      });

      const uploadedUrl = await simulateFileUpload(file);
      handleInputChange('logoUrl', uploadedUrl);
      
      toast({
        title: 'Upload Successful',
        description: 'Your logo has been uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload logo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const save = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before saving',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      saveObject<SiteSettings>(STORE_KEYS.siteSettings, form);
      
      toast({
        title: 'Success',
        description: 'Site settings saved successfully',
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error saving site settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save site settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Settings className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Loading site settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Site Settings</h1>
        <p className="text-muted-foreground mt-2">Manage website branding and configuration</p>
      </div>
      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Website Settings
            </CardTitle>
            <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErrors({}); }}>
            <DialogContent className="sm:max-w-[700px] rounded-xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Edit Website Settings</DialogTitle>
                <DialogDescription>
                  Update your website's branding and configuration settings
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="sitename" className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    Website Name *
                  </Label>
                  <Input 
                    id="sitename" 
                    placeholder="Enter website name"
                    value={form.websiteName} 
                    onChange={e => handleInputChange('websiteName', e.target.value)}
                    className={errors.websiteName ? 'border-red-500' : ''}
                  />
                  {errors.websiteName && (
                    <p className="text-sm text-red-500">{errors.websiteName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Tagline
                  </Label>
                  <Input 
                    id="tagline" 
                    placeholder="Enter website tagline"
                    value={form.tagline || ''} 
                    onChange={e => handleInputChange('tagline', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="flex items-center gap-1">
                    <Image className="h-4 w-4" />
                    Logo
                  </Label>
                  <Tabs value={logoMode} onValueChange={(v) => setLogoMode(v as 'url' | 'upload')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="url" className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        URL
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="url" className="space-y-2">
                      <Input 
                        placeholder="https://example.com/logo.png"
                        value={form.logoUrl} 
                        onChange={e => handleInputChange('logoUrl', e.target.value)}
                        className={errors.logoUrl ? 'border-red-500' : ''}
                      />
                      {errors.logoUrl && (
                        <p className="text-sm text-red-500">{errors.logoUrl}</p>
                      )}
                    </TabsContent>
                    <TabsContent value="upload" className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input 
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {isUploading && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Settings className="h-4 w-4 animate-spin" />
                            Uploading...
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Supported formats: JPG, PNG, GIF, SVG (max 5MB)
                      </p>
                    </TabsContent>
                  </Tabs>
                  {form.logoUrl && isValidUrl(form.logoUrl) && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <img 
                        src={form.logoUrl} 
                        alt="Logo preview" 
                        className="h-16 w-auto border rounded shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactemail">Contact Email</Label>
                  <Input 
                    id="contactemail" 
                    type="email"
                    placeholder="contact@example.com"
                    value={form.contactEmail || ''} 
                    onChange={e => handleInputChange('contactEmail', e.target.value)}
                    className={errors.contactEmail ? 'border-red-500' : ''}
                  />
                  {errors.contactEmail && (
                    <p className="text-sm text-red-500">{errors.contactEmail}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportphone">Support Phone</Label>
                  <Input 
                    id="supportphone" 
                    placeholder="+1 (555) 123-4567"
                    value={form.supportPhone || ''} 
                    onChange={e => handleInputChange('supportPhone', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="about">About *</Label>
                  <Textarea 
                    id="about" 
                    placeholder="Describe your website and company..."
                    value={form.about} 
                    onChange={e => handleInputChange('about', e.target.value)}
                    className={`min-h-[120px] ${errors.about ? 'border-red-500' : ''}`}
                  />
                  {errors.about && (
                    <p className="text-sm text-red-500">{errors.about}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {form.about.length} characters (minimum 10 required)
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => { setOpen(false); setErrors({}); }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={save} 
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Globe className="h-4 w-4" />
                Website Information
              </div>
              <div className="space-y-2 pl-6">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">Name</div>
                  <div className="font-medium">{form.websiteName || '-'}</div>
                </div>
                {form.tagline && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Tagline</div>
                    <div className="text-sm">{form.tagline}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Image className="h-4 w-4" />
                Branding
              </div>
              <div className="pl-6">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Logo</div>
                {form.logoUrl && isValidUrl(form.logoUrl) ? (
                  <img 
                    src={form.logoUrl} 
                    alt="Website logo" 
                    className="h-12 w-auto border rounded shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Badge variant="secondary">No logo set</Badge>
                )}
              </div>
            </div>

            <div className="space-y-3 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <FileText className="h-4 w-4" />
                Contact Information
              </div>
              <div className="space-y-2 pl-6">
                {form.contactEmail && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Email</div>
                    <div className="text-sm">{form.contactEmail}</div>
                  </div>
                )}
                {form.supportPhone && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Phone</div>
                    <div className="text-sm">{form.supportPhone}</div>
                  </div>
                )}
                {!form.contactEmail && !form.supportPhone && (
                  <Badge variant="outline">No contact info</Badge>
                )}
              </div>
            </div>

            <div className="space-y-3 md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <FileText className="h-4 w-4" />
                About Section
              </div>
              <div className="pl-6">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Description</div>
                {form.about ? (
                  <div className="text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
                    {form.about}
                  </div>
                ) : (
                  <Badge variant="secondary">No description set</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
