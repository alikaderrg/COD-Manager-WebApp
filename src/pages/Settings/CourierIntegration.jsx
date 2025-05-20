import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, AlertCircle } from 'lucide-react';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const headers = {
  Authorization: `Bearer ${localStorage.getItem('auth_token')}`
};

// List of delivery companies
const deliveryCompanies = [
  { id: 'maystro', name: 'Maystro Delivery', logo: '/images/maystro.png' },
  { id: 'zr', name: 'Zr Express', logo: '/images/zr.png' },
  { id: 'yalidine', name: 'Yalidine Express', logo: '/images/yalidine.png' },
  { id: 'noest', name: 'Nord et ouest (Noest)', logo: '/images/nord.png' },
  { id: 'dhd', name: 'Dhd Livraison Express', logo: '/images/dhd.png' },
  { id: 'guepex', name: 'Guepex Express', logo: '/images/guepex.png' },
  { id: 'yalitec', name: 'Yalitec', logo: '/images/yalitec.png' },
  { id: '48h', name: '48h Courrier Express', logo: '/images/48h.png' },
  { id: 'anderson', name: 'Anderson National Express', logo: '/images/anderson.png' },
  { id: 'world', name: 'World Express', logo: '/images/world.png' },
  { id: 'ecom', name: 'E-com Delivery', logo: '/images/ecom.png' }
];

export default function CourierIntegration() {
  const { toast } = useToast();
  const [activeIntegrations, setActiveIntegrations] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    apiKey: '',
    apiSecret: '',
    token: ''
  });
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Fetch active integrations on component mount
  useEffect(() => {
    fetchActiveIntegrations();
  }, []);

  const fetchActiveIntegrations = async () => {
    try {
      // In a real app, you would fetch this from your backend
      // For now, we'll simulate with localStorage
      const saved = localStorage.getItem('activeDeliveryIntegrations');
      if (saved) {
        setActiveIntegrations(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to fetch active integrations:', error);
    }
  };

  const handleIntegrateClick = (company) => {
    setSelectedCompany(company);
    setCredentials({
      username: '',
      password: '',
      apiKey: '',
      apiSecret: '',
      token: ''
    });
    setTestResult(null);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestConnection = async () => {
    if (!selectedCompany) return;

    setLoading(true);
    setTestResult(null);

    try {
      // In a real app, you would test the connection with your backend
      // For now, we'll simulate a successful test after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setTestResult({
        success: true,
        message: `Successfully connected to ${selectedCompany.name} API`
      });

      toast({
        title: '✅ Connection successful',
        description: `Successfully connected to ${selectedCompany.name} API`
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message || 'Failed to connect to API'
      });

      toast({
        title: '❌ Connection failed',
        description: error.message || 'Failed to connect to API'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIntegration = async () => {
    if (!selectedCompany) return;

    setLoading(true);

    try {
      // In a real app, you would save this to your backend
      // For now, we'll save to localStorage
      const newIntegrations = {
        ...activeIntegrations,
        [selectedCompany.id]: {
          ...selectedCompany,
          credentials,
          active: true,
          dateAdded: new Date().toISOString()
        }
      };

      localStorage.setItem('activeDeliveryIntegrations', JSON.stringify(newIntegrations));
      setActiveIntegrations(newIntegrations);

      toast({
        title: '✅ Integration saved',
        description: `${selectedCompany.name} has been successfully integrated`
      });

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: '❌ Save failed',
        description: error.message || 'Failed to save integration'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveIntegration = async (companyId) => {
    try {
      const newIntegrations = { ...activeIntegrations };
      delete newIntegrations[companyId];

      localStorage.setItem('activeDeliveryIntegrations', JSON.stringify(newIntegrations));
      setActiveIntegrations(newIntegrations);

      toast({
        title: '✅ Integration removed',
        description: 'The integration has been successfully removed'
      });
    } catch (error) {
      toast({
        title: '❌ Remove failed',
        description: error.message || 'Failed to remove integration'
      });
    }
  };

  // Determine which credential fields to show based on the selected company
  const getCredentialFields = () => {
    if (!selectedCompany) return [];

    // Default fields for most companies
    const fields = [
      { name: 'username', label: 'Username', placeholder: `Your ${selectedCompany.name} username` },
      { name: 'password', label: 'Password', placeholder: `Your ${selectedCompany.name} password`, type: 'password' }
    ];

    // Add API key for specific companies
    if (['zr', 'yalidine', 'maystro', 'world'].includes(selectedCompany.id)) {
      fields.push(
        { name: 'apiKey', label: 'API Key', placeholder: `Your ${selectedCompany.name} API Key` }
      );
    }

    // Add API secret for specific companies
    if (['zr', 'yalidine', 'ecom'].includes(selectedCompany.id)) {
      fields.push(
        { name: 'apiSecret', label: 'API Secret', placeholder: `Your ${selectedCompany.name} API Secret` }
      );
    }

    // Add token for specific companies
    if (['maystro', 'noest', 'dhd'].includes(selectedCompany.id)) {
      fields.push(
        { name: 'token', label: 'API Token', placeholder: `Your ${selectedCompany.name} API Token` }
      );
    }

    return fields;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Delivery Integrations</h1>
        <p className="text-muted-foreground mb-6">
          Connect your delivery providers to automate shipping and tracking.
        </p>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {deliveryCompanies.map(company => (
                <Card key={company.id} className="overflow-hidden">
                  <div className="relative">
                    {activeIntegrations[company.id] && (
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        Active
                      </Badge>
                    )}
                    <div className="h-40 flex items-center justify-center p-4 bg-gray-50 rounded-t-lg">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="max-h-28 max-w-[80%] object-contain"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
                    {activeIntegrations[company.id] ? (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIntegrateClick(company)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveIntegration(company.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleIntegrateClick(company)}
                      >
                        Integrate
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="w-full">
            <div className="space-y-4">
              {deliveryCompanies.map(company => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-50 rounded-md p-2 border border-gray-100">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="max-h-14 max-w-[80%] object-contain"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{company.name}</h3>
                      {activeIntegrations[company.id] && (
                        <Badge className="bg-green-500">Active</Badge>
                      )}
                    </div>
                  </div>

                  {activeIntegrations[company.id] ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleIntegrateClick(company)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveIntegration(company.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleIntegrateClick(company)}
                    >
                      Integrate
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Integration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedCompany && (
                <>
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-md p-1">
                    <img
                      src={selectedCompany.logo}
                      alt={`${selectedCompany.name} logo`}
                      className="max-h-6 max-w-[80%] object-contain"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  {selectedCompany.name} Integration
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Enter your API credentials to connect with {selectedCompany?.name}.
            </p>

            {getCredentialFields().map(field => (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  value={credentials[field.name]}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            {testResult && (
              <div className={`p-3 rounded-md ${
                testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  {testResult.success ? <Check size={16} /> : <AlertCircle size={16} />}
                  <p className="text-sm">{testResult.message}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex space-x-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={loading}
            >
              Test Connection
            </Button>
            <Button
              type="button"
              onClick={handleSaveIntegration}
              disabled={loading || (testResult && !testResult.success)}
            >
              {loading ? 'Saving...' : 'Save Integration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
