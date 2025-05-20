import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Truck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function DeliveryDropdown({ orderId, onExport }) {
  const { toast } = useToast();
  const [activeIntegrations, setActiveIntegrations] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActiveIntegrations();
  }, []);

  const fetchActiveIntegrations = () => {
    try {
      const saved = localStorage.getItem('activeDeliveryIntegrations');
      if (saved) {
        setActiveIntegrations(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to fetch active integrations:', error);
    }
  };

  const handleExport = async (companyId) => {
    if (!orderId) {
      toast({
        title: '❌ Export failed',
        description: 'No order selected for export'
      });
      return;
    }

    setLoading(true);

    try {
      // In a real app, you would call your backend API
      // For now, we'll simulate a successful export after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: '✅ Order exported',
        description: `Order #${orderId} has been exported to ${activeIntegrations[companyId].name}`
      });

      if (onExport) {
        onExport(companyId, orderId);
      }
    } catch (error) {
      toast({
        title: '❌ Export failed',
        description: error.message || 'Failed to export order'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get active integrations as an array
  const activeIntegrationsArray = Object.values(activeIntegrations);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading || activeIntegrationsArray.length === 0}>
          <Truck className="mr-2 h-4 w-4" />
          {loading ? 'Exporting...' : 'Export to Delivery'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Delivery Providers</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {activeIntegrationsArray.length > 0 ? (
            activeIntegrationsArray.map(company => (
              <DropdownMenuItem
                key={company.id}
                onClick={() => handleExport(company.id)}
                disabled={loading}
              >
                <div className="flex items-center w-full">
                  <div className="w-6 h-6 mr-2 flex-shrink-0 bg-gray-50 rounded-sm p-0.5 flex items-center justify-center">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="max-h-4 max-w-[80%] object-contain"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <span>{company.name}</span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              No active delivery integrations
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => window.location.href = '#/settings/courier'}
        >
          Manage Integrations
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
