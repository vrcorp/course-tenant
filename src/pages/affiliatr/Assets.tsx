import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AssetType = 'banner' | 'social' | 'email' | 'text' | 'logo';
type AssetSize = 'small' | 'medium' | 'large';

interface MarketingAsset {
  id: string;
  title: string;
  type: AssetType;
  size: AssetSize;
  dimensions: string;
  format: string;
  url: string;
  previewUrl: string;
  description: string;
  tags: string[];
  codeSnippet?: string;
}

export default function AffiliatorAssets() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<AssetType | 'all'>('all');
  
  // Sample marketing assets with placeholder images
  const assets: MarketingAsset[] = [
    {
      id: 'banner-1',
      title: 'Leaderboard Banner',
      type: 'banner',
      size: 'large',
      dimensions: '728x90',
      format: 'PNG',
      url: 'https://placehold.co/728x90/2563eb/white?text=Video+Hosting+Promo',
      previewUrl: 'https://placehold.co/364x45/2563eb/white?text=Video+Hosting+Promo',
      description: 'Standard leaderboard banner for website headers',
      tags: ['banner', 'header', 'video']
    },
    {
      id: 'banner-2',
      title: 'Square Ad',
      type: 'banner',
      size: 'medium',
      dimensions: '300x250',
      format: 'JPG',
      url: 'https://placehold.co/300x250/2563eb/white?text=LMS+Promo',
      previewUrl: 'https://placehold.co/150x125/2563eb/white?text=LMS+Promo',
      description: 'Medium rectangle ad for sidebars',
      tags: ['banner', 'sidebar', 'lms']
    },
    {
      id: 'social-1',
      title: 'Facebook Post',
      type: 'social',
      size: 'medium',
      dimensions: '1200x630',
      format: 'JPG',
      url: 'https://placehold.co/1200x630/1e40af/white?text=Video+Hosting+For+Creators',
      previewUrl: 'https://placehold.co/300x158/1e40af/white?text=Video+Hosting',
      description: 'Facebook post template with placeholder for your text',
      tags: ['social', 'facebook', 'video']
    },
    {
      id: 'email-1',
      title: 'Promotional Email',
      type: 'email',
      size: 'small',
      dimensions: '600x800',
      format: 'HTML',
      url: '#',
      previewUrl: 'https://placehold.co/300x400/1e3a8a/white?text=Email+Template',
      description: 'Responsive email template for promotions',
      tags: ['email', 'newsletter', 'promo'],
      codeSnippet: '<!-- Replace YOUR_AFFILIATE_CODE -->\n<a href="https://example.com/ref=YOUR_AFFILIATE_CODE">Get Started</a>'
    },
    {
      id: 'text-1',
      title: 'Product Description',
      type: 'text',
      size: 'small',
      dimensions: 'N/A',
      format: 'TXT',
      url: '#',
      previewUrl: 'https://placehold.co/300x100/e5e7eb/1f2937?text=Product+Description',
      description: 'Compelling product description for video hosting',
      tags: ['text', 'description', 'video'],
      codeSnippet: '🚀 Start your video streaming journey today with our reliable hosting platform. Perfect for creators who demand quality and performance. Sign up now and get 30% off your first 3 months! #VideoHosting #ContentCreators'
    },
    {
      id: 'logo-1',
      title: 'Brand Logo',
      type: 'logo',
      size: 'small',
      dimensions: '800x400',
      format: 'PNG',
      url: 'https://placehold.co/800x400/2563eb/white?text=Logo',
      previewUrl: 'https://placehold.co/200x100/2563eb/white?text=Logo',
      description: 'Official brand logo in transparent PNG',
      tags: ['logo', 'brand']
    },
  ];

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === 'all' || asset.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: message,
    });
  };

  const getSizeClass = (size: AssetSize) => {
    switch (size) {
      case 'small': return 'w-24 h-24';
      case 'medium': return 'w-48 h-48';
      case 'large': return 'w-full h-48';
      default: return 'w-32 h-32';
    }
  };

  const getTypeLabel = (type: AssetType) => {
    switch (type) {
      case 'banner': return 'Banner';
      case 'social': return 'Social Media';
      case 'email': return 'Email Template';
      case 'text': return 'Text';
      case 'logo': return 'Logo';
      default: return type;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Marketing Assets</h1>
        <p className="text-muted-foreground mt-2">Download banners, logos, and promotional materials</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as AssetType | 'all')}
        >
          <option value="all">All Types</option>
          <option value="banner">Banners</option>
          <option value="social">Social Media</option>
          <option value="email">Email Templates</option>
          <option value="text">Text Snippets</option>
          <option value="logo">Logos</option>
        </select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-6">
          <TabsTrigger value="all" onClick={() => setSelectedType('all')}>All</TabsTrigger>
          <TabsTrigger value="banner" onClick={() => setSelectedType('banner')}>Banners</TabsTrigger>
          <TabsTrigger value="social" onClick={() => setSelectedType('social')}>Social</TabsTrigger>
          <TabsTrigger value="email" onClick={() => setSelectedType('email')}>Email</TabsTrigger>
          <TabsTrigger value="text" onClick={() => setSelectedType('text')}>Text</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType === 'all' ? 'all' : selectedType}>
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No assets found. Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => (
                <Card key={asset.id} className="overflow-hidden">
                  <div className={`bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${asset.type === 'banner' ? 'p-2' : 'p-4'}`}>
                    {asset.type === 'text' ? (
                      <div className="p-4 bg-white dark:bg-gray-900 rounded w-full">
                        <p className="text-sm text-muted-foreground line-clamp-4">
                          {asset.codeSnippet || asset.description}
                        </p>
                      </div>
                    ) : (
                      <img 
                        src={asset.previewUrl} 
                        alt={asset.title}
                        className={`${asset.type === 'banner' ? 'w-full h-auto' : 'max-h-48 mx-auto'}`}
                      />
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{asset.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                            {getTypeLabel(asset.type)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {asset.dimensions} • {asset.format}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{asset.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {asset.codeSnippet ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(asset.codeSnippet || '', 'Code snippet copied to clipboard')}
                        >
                          <Copy className="mr-2 h-4 w-4" /> Copy Code
                        </Button>
                      ) : (
                        <Button size="sm" className="gap-2" asChild>
                          <a href={asset.url} download={`${asset.title.replace(/\s+/g, '-').toLowerCase()}.${asset.format.toLowerCase()}`}>
                            <Download className="h-4 w-4" /> Download
                          </a>
                        </Button>
                      )}
                      {asset.tags.map(tag => (
                        <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Custom Assets?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Need custom-sized banners or promotional materials for your specific needs?
          </p>
          <Button variant="outline">Request Custom Assets</Button>
        </CardContent>
      </Card>
    </div>
  );
}
