import { useEffect, useState } from "react";
import seed from "@/data/admin_api_settings.json";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadObject, saveObject, STORE_KEYS } from "@/lib/dataStore";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Save, X, MessageSquare, Server, Mail, CreditCard, Eye, EyeOff, TestTube, CheckCircle, AlertCircle } from "lucide-react";

interface ApiSettings {
  whatsapp: { provider: string; apiKey: string; senderNumber: string };
  contabo: { apiToken: string; region: string };
  smtp: { host: string; port: number; username: string; password: string; fromEmail: string };
  tripay: { apiKey: string; merchantCode: string; privateKey: string };
}

export default function AdminApiSettings() {
  const { toast } = useToast();
  const [form, setForm] = useState<ApiSettings>({
    whatsapp: { provider: "waba", apiKey: "", senderNumber: "" },
    contabo: { apiToken: "", region: "eu-central-1" },
    smtp: { host: "", port: 587, username: "", password: "", fromEmail: "" },
    tripay: { apiKey: "", merchantCode: "", privateKey: "" },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [open, setOpen] = useState<null | "whatsapp" | "contabo" | "smtp" | "tripay">(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'success' | 'error' | 'unknown'>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const initial = loadObject<ApiSettings>(STORE_KEYS.apiSettings, seed as any);
        setForm({
          whatsapp: {
            provider: initial.whatsapp?.provider || "waba",
            apiKey: initial.whatsapp?.apiKey || "",
            senderNumber: initial.whatsapp?.senderNumber || ""
          },
          contabo: {
            apiToken: initial.contabo?.apiToken || "",
            region: initial.contabo?.region || "eu-central-1"
          },
          smtp: {
            host: initial.smtp?.host || "",
            port: initial.smtp?.port || 587,
            username: initial.smtp?.username || "",
            password: initial.smtp?.password || "",
            fromEmail: initial.smtp?.fromEmail || ""
          },
          tripay: {
            apiKey: initial.tripay?.apiKey || "",
            merchantCode: initial.tripay?.merchantCode || "",
            privateKey: initial.tripay?.privateKey || ""
          }
        });
      } catch (error) {
        console.error('Error loading API settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load API settings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const validateForm = (service: string): boolean => {
    const newErrors: Record<string, string> = {};

    switch (service) {
      case 'whatsapp':
        if (!form.whatsapp.apiKey.trim()) {
          newErrors['whatsapp.apiKey'] = 'API Key is required';
        }
        if (!form.whatsapp.senderNumber.trim()) {
          newErrors['whatsapp.senderNumber'] = 'Sender number is required';
        } else if (!/^\+?[1-9]\d{1,14}$/.test(form.whatsapp.senderNumber)) {
          newErrors['whatsapp.senderNumber'] = 'Invalid phone number format';
        }
        break;
      case 'contabo':
        if (!form.contabo.apiToken.trim()) {
          newErrors['contabo.apiToken'] = 'API Token is required';
        }
        break;
      case 'smtp':
        if (!form.smtp.host.trim()) {
          newErrors['smtp.host'] = 'SMTP host is required';
        }
        if (!form.smtp.username.trim()) {
          newErrors['smtp.username'] = 'Username is required';
        }
        if (!form.smtp.password.trim()) {
          newErrors['smtp.password'] = 'Password is required';
        }
        if (!form.smtp.fromEmail.trim()) {
          newErrors['smtp.fromEmail'] = 'From email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.smtp.fromEmail)) {
          newErrors['smtp.fromEmail'] = 'Invalid email format';
        }
        if (form.smtp.port < 1 || form.smtp.port > 65535) {
          newErrors['smtp.port'] = 'Port must be between 1 and 65535';
        }
        break;
      case 'tripay':
        if (!form.tripay.apiKey.trim()) {
          newErrors['tripay.apiKey'] = 'API Key is required';
        }
        if (!form.tripay.merchantCode.trim()) {
          newErrors['tripay.merchantCode'] = 'Merchant Code is required';
        }
        if (!form.tripay.privateKey.trim()) {
          newErrors['tripay.privateKey'] = 'Private Key is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const testConnection = async (service: string) => {
    if (!validateForm(service)) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before testing connection',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsTesting(service);
      toast({
        title: 'Testing Connection',
        description: `Testing ${service} connection...`,
      });

      // Simulate API test with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        setConnectionStatus(prev => ({ ...prev, [service]: 'success' }));
        toast({
          title: 'Connection Successful',
          description: `${service} connection test passed`,
        });
      } else {
        setConnectionStatus(prev => ({ ...prev, [service]: 'error' }));
        toast({
          title: 'Connection Failed',
          description: `${service} connection test failed`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, [service]: 'error' }));
      toast({
        title: 'Test Failed',
        description: `Failed to test ${service} connection`,
        variant: 'destructive',
      });
    } finally {
      setIsTesting(null);
    }
  };

  const save = async () => {
    try {
      setIsSaving(true);
      saveObject<ApiSettings>(STORE_KEYS.apiSettings, form);
      
      toast({
        title: 'Success',
        description: 'API settings saved successfully',
      });
      
      setOpen(null);
      setErrors({});
    } catch (error) {
      console.error('Error saving API settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save API settings',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getStatusIcon = (service: string) => {
    const status = connectionStatus[service];
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (service: string) => {
    const status = connectionStatus[service];
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Settings className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Loading API settings...</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">API Settings</h1>
        <p className="text-muted-foreground mt-2">Configure external service integrations and API connections</p>
      </div>
      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API Configurations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* WhatsApp */}
          <section className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">WhatsApp Business API</h3>
                  <p className="text-sm text-muted-foreground">Configure WhatsApp messaging service</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon('whatsapp')}
                {getStatusBadge('whatsapp')}
                <Button size="sm" variant="outline" onClick={() => setOpen("whatsapp")}>
                  <Settings className="h-4 w-4 mr-2"/>Configure
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Provider</div>
                <div className="font-medium">{form.whatsapp.provider || '-'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">API Key</div>
                <div className="font-mono text-xs bg-gray-50 p-2 rounded border truncate">
                  {form.whatsapp.apiKey ? '••••••••••••' + form.whatsapp.apiKey.slice(-4) : 'Not configured'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Sender Number</div>
                <div className="font-medium">{form.whatsapp.senderNumber || 'Not configured'}</div>
              </div>
            </div>
          </section>

          {/* Contabo */}
          <section className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Server className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Contabo Cloud</h3>
                  <p className="text-sm text-muted-foreground">Configure cloud hosting service</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon('contabo')}
                {getStatusBadge('contabo')}
                <Button size="sm" variant="outline" onClick={() => setOpen("contabo")}>
                  <Settings className="h-4 w-4 mr-2"/>Configure
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">API Token</div>
                <div className="font-mono text-xs bg-gray-50 p-2 rounded border truncate">
                  {form.contabo.apiToken ? '••••••••••••' + form.contabo.apiToken.slice(-4) : 'Not configured'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Region</div>
                <div className="font-medium">{form.contabo.region || 'Not configured'}</div>
              </div>
            </div>
          </section>

          {/* SMTP */}
          <section className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Mail className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">SMTP Email Service</h3>
                  <p className="text-sm text-muted-foreground">Configure email delivery service</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon('smtp')}
                {getStatusBadge('smtp')}
                <Button size="sm" variant="outline" onClick={() => setOpen("smtp")}>
                  <Settings className="h-4 w-4 mr-2"/>Configure
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Host</div>
                <div className="font-medium">{form.smtp.host || 'Not configured'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Port</div>
                <div className="font-medium">{form.smtp.port || 'Not configured'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Username</div>
                <div className="font-mono text-xs bg-gray-50 p-2 rounded border truncate">
                  {form.smtp.username || 'Not configured'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Password</div>
                <div className="font-mono text-xs bg-gray-50 p-2 rounded border">
                  {form.smtp.password ? '••••••••••••' : 'Not configured'}
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">From Email</div>
                <div className="font-medium">{form.smtp.fromEmail || 'Not configured'}</div>
              </div>
            </div>
          </section>

          {/* Tripay */}
          <section className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Tripay Payment Gateway</h3>
                  <p className="text-sm text-muted-foreground">Configure payment processing service</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon('tripay')}
                {getStatusBadge('tripay')}
                <Button size="sm" variant="outline" onClick={() => setOpen("tripay")}>
                  <Settings className="h-4 w-4 mr-2"/>Configure
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">API Key</div>
                <div className="font-mono text-xs bg-gray-50 p-2 rounded border truncate">
                  {form.tripay.apiKey ? '••••••••••••' + form.tripay.apiKey.slice(-4) : 'Not configured'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Merchant Code</div>
                <div className="font-medium">{form.tripay.merchantCode || 'Not configured'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Private Key</div>
                <div className="font-mono text-xs bg-gray-50 p-2 rounded border">
                  {form.tripay.privateKey ? '••••••••••••' : 'Not configured'}
                </div>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      {/* WhatsApp Dialog */}
      <Dialog open={open === "whatsapp"} onOpenChange={(v) => setOpen(v ? "whatsapp" : null)}>
        <DialogContent className="sm:max-w-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Configure WhatsApp Business API
            </DialogTitle>
            <DialogDescription>
              Set up your WhatsApp Business API credentials for messaging services.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp-provider">Provider *</Label>
              <Select value={form.whatsapp.provider} onValueChange={(val) => setForm({ ...form, whatsapp: { ...form.whatsapp, provider: val } })}>
                <SelectTrigger id="whatsapp-provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="waba">Meta WABA</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="whatsapp-apikey">API Key *</Label>
              <div className="relative">
                <Input 
                  id="whatsapp-apikey"
                  type={showPasswords['whatsapp.apiKey'] ? 'text' : 'password'}
                  value={form.whatsapp.apiKey} 
                  onChange={e => setForm({ ...form, whatsapp: { ...form.whatsapp, apiKey: e.target.value } })}
                  className={errors['whatsapp.apiKey'] ? 'border-red-500' : ''}
                  placeholder="Enter your WhatsApp API key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('whatsapp.apiKey')}
                >
                  {showPasswords['whatsapp.apiKey'] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors['whatsapp.apiKey'] && (
                <p className="text-sm text-red-500">{errors['whatsapp.apiKey']}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="whatsapp-sender">Sender Number *</Label>
              <Input 
                id="whatsapp-sender"
                value={form.whatsapp.senderNumber} 
                onChange={e => setForm({ ...form, whatsapp: { ...form.whatsapp, senderNumber: e.target.value } })}
                className={errors['whatsapp.senderNumber'] ? 'border-red-500' : ''}
                placeholder="+1234567890"
              />
              {errors['whatsapp.senderNumber'] && (
                <p className="text-sm text-red-500">{errors['whatsapp.senderNumber']}</p>
              )}
              <p className="text-xs text-muted-foreground">Include country code (e.g., +1234567890)</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => testConnection('whatsapp')}
              disabled={isTesting === 'whatsapp'}
            >
              {isTesting === 'whatsapp' ? (
                <>
                  <TestTube className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            <Button 
              onClick={save} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setOpen(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contabo Dialog */}
      <Dialog open={open === "contabo"} onOpenChange={(v) => setOpen(v ? "contabo" : null)}>
        <DialogContent className="sm:max-w-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              Configure Contabo Cloud
            </DialogTitle>
            <DialogDescription>
              Set up your Contabo cloud hosting API credentials for server management.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contabo-token">API Token *</Label>
              <div className="relative">
                <Input 
                  id="contabo-token"
                  type={showPasswords['contabo.apiToken'] ? 'text' : 'password'}
                  value={form.contabo.apiToken} 
                  onChange={e => setForm({ ...form, contabo: { ...form.contabo, apiToken: e.target.value } })}
                  className={errors['contabo.apiToken'] ? 'border-red-500' : ''}
                  placeholder="Enter your Contabo API token"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('contabo.apiToken')}
                >
                  {showPasswords['contabo.apiToken'] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors['contabo.apiToken'] && (
                <p className="text-sm text-red-500">{errors['contabo.apiToken']}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contabo-region">Region</Label>
              <Select value={form.contabo.region} onValueChange={(val) => setForm({ ...form, contabo: { ...form.contabo, region: val } })}>
                <SelectTrigger id="contabo-region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eu-central-1">Europe Central (Frankfurt)</SelectItem>
                  <SelectItem value="eu-west-1">Europe West (London)</SelectItem>
                  <SelectItem value="us-east-1">US East (Virginia)</SelectItem>
                  <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => testConnection('contabo')}
              disabled={isTesting === 'contabo'}
            >
              {isTesting === 'contabo' ? (
                <>
                  <TestTube className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            <Button 
              onClick={save} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setOpen(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SMTP Dialog */}
      <Dialog open={open === "smtp"} onOpenChange={(v) => setOpen(v ? "smtp" : null)}>
        <DialogContent className="sm:max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5 text-orange-600" />
              Configure SMTP Email Service
            </DialogTitle>
            <DialogDescription>
              Set up your SMTP server credentials for email delivery services.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host *</Label>
              <Input 
                id="smtp-host"
                value={form.smtp.host} 
                onChange={e => setForm({ ...form, smtp: { ...form.smtp, host: e.target.value } })}
                className={errors['smtp.host'] ? 'border-red-500' : ''}
                placeholder="smtp.gmail.com"
              />
              {errors['smtp.host'] && (
                <p className="text-sm text-red-500">{errors['smtp.host']}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">Port *</Label>
              <Input 
                id="smtp-port"
                type="number" 
                value={form.smtp.port} 
                onChange={e => setForm({ ...form, smtp: { ...form.smtp, port: Number(e.target.value) } })}
                className={errors['smtp.port'] ? 'border-red-500' : ''}
                placeholder="587"
              />
              {errors['smtp.port'] && (
                <p className="text-sm text-red-500">{errors['smtp.port']}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-username">Username *</Label>
              <Input 
                id="smtp-username"
                value={form.smtp.username} 
                onChange={e => setForm({ ...form, smtp: { ...form.smtp, username: e.target.value } })}
                className={errors['smtp.username'] ? 'border-red-500' : ''}
                placeholder="your-email@gmail.com"
              />
              {errors['smtp.username'] && (
                <p className="text-sm text-red-500">{errors['smtp.username']}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">Password *</Label>
              <div className="relative">
                <Input 
                  id="smtp-password"
                  type={showPasswords['smtp.password'] ? 'text' : 'password'}
                  value={form.smtp.password} 
                  onChange={e => setForm({ ...form, smtp: { ...form.smtp, password: e.target.value } })}
                  className={errors['smtp.password'] ? 'border-red-500' : ''}
                  placeholder="Your SMTP password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('smtp.password')}
                >
                  {showPasswords['smtp.password'] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors['smtp.password'] && (
                <p className="text-sm text-red-500">{errors['smtp.password']}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="smtp-from">From Email *</Label>
              <Input 
                id="smtp-from"
                type="email"
                value={form.smtp.fromEmail} 
                onChange={e => setForm({ ...form, smtp: { ...form.smtp, fromEmail: e.target.value } })}
                className={errors['smtp.fromEmail'] ? 'border-red-500' : ''}
                placeholder="noreply@yourdomain.com"
              />
              {errors['smtp.fromEmail'] && (
                <p className="text-sm text-red-500">{errors['smtp.fromEmail']}</p>
              )}
              <p className="text-xs text-muted-foreground">This email will appear as the sender</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => testConnection('smtp')}
              disabled={isTesting === 'smtp'}
            >
              {isTesting === 'smtp' ? (
                <>
                  <TestTube className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            <Button 
              onClick={save} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setOpen(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tripay Dialog */}
      <Dialog open={open === "tripay"} onOpenChange={(v) => setOpen(v ? "tripay" : null)}>
        <DialogContent className="sm:max-w-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Configure Tripay Payment Gateway
            </DialogTitle>
            <DialogDescription>
              Set up your Tripay payment gateway credentials for processing transactions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tripay-apikey">API Key *</Label>
              <div className="relative">
                <Input 
                  id="tripay-apikey"
                  type={showPasswords['tripay.apiKey'] ? 'text' : 'password'}
                  value={form.tripay.apiKey} 
                  onChange={e => setForm({ ...form, tripay: { ...form.tripay, apiKey: e.target.value } })}
                  className={errors['tripay.apiKey'] ? 'border-red-500' : ''}
                  placeholder="Enter your Tripay API key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('tripay.apiKey')}
                >
                  {showPasswords['tripay.apiKey'] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors['tripay.apiKey'] && (
                <p className="text-sm text-red-500">{errors['tripay.apiKey']}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tripay-merchant">Merchant Code *</Label>
              <Input 
                id="tripay-merchant"
                value={form.tripay.merchantCode} 
                onChange={e => setForm({ ...form, tripay: { ...form.tripay, merchantCode: e.target.value } })}
                className={errors['tripay.merchantCode'] ? 'border-red-500' : ''}
                placeholder="Your merchant code"
              />
              {errors['tripay.merchantCode'] && (
                <p className="text-sm text-red-500">{errors['tripay.merchantCode']}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tripay-private">Private Key *</Label>
              <div className="relative">
                <Input 
                  id="tripay-private"
                  type={showPasswords['tripay.privateKey'] ? 'text' : 'password'}
                  value={form.tripay.privateKey} 
                  onChange={e => setForm({ ...form, tripay: { ...form.tripay, privateKey: e.target.value } })}
                  className={errors['tripay.privateKey'] ? 'border-red-500' : ''}
                  placeholder="Your private key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('tripay.privateKey')}
                >
                  {showPasswords['tripay.privateKey'] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors['tripay.privateKey'] && (
                <p className="text-sm text-red-500">{errors['tripay.privateKey']}</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => testConnection('tripay')}
              disabled={isTesting === 'tripay'}
            >
              {isTesting === 'tripay' ? (
                <>
                  <TestTube className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            <Button 
              onClick={save} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setOpen(null)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
