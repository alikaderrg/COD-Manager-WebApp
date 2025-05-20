import React from 'react';

// List of delivery companies with hardcoded image URLs
const deliveryCompanies = [
  { id: 'maystro', name: 'Maystro Delivery', logo: 'https://placehold.co/200x100/e9d5ff/4c1d95?text=Maystro' },
  { id: 'zr', name: 'Zr Express', logo: 'https://placehold.co/200x100/e9d5ff/4c1d95?text=ZR+Express' },
  { id: 'yalidine', name: 'Yalidine Express', logo: 'https://placehold.co/200x100/e9d5ff/4c1d95?text=Yalidine' },
  { id: 'noest', name: 'Nord et ouest (Noest)', logo: 'https://placehold.co/200x100/e9d5ff/4c1d95?text=Noest' },
  { id: 'dhd', name: 'Dhd Livraison Express', logo: 'https://placehold.co/200x100/e9d5ff/4c1d95?text=DHD' },
  { id: 'guepex', name: 'Guepex Express', logo: 'https://placehold.co/200x100/e9d5ff/4c1d95?text=Guepex' },
  { id: 'yalitec', name: 'Yalitec', logo: 'https://placehold.co/200x100/e9d5ff/4c1d95?text=Yalitec' },
  { id: '48h', name: '48h Courrier Express', logo: 'https://placehold.co/200x100/e9d5ff/4c1d95?text=48h' },
  { id: 'anderson', name: 'Anderson National Express', logo: 'https://placehold.co/200x100/e9d5ff/4c1d95?text=Anderson' },
  { id: 'world', name: 'World Express', logo: 'https://placehold.co/200x100/e9d5ff/4c1d95?text=World' },
  { id: 'ecom', name: 'E-com Delivery', logo: 'https://placehold.co/200x100/e9d5ff/4c1d95?text=E-com' }
];

export default function CourierIntegration() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Delivery Integrations</h1>
        <p className="text-gray-600 mb-6">
          Connect your delivery providers to automate shipping and tracking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deliveryCompanies.map(company => (
            <div key={company.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="h-40 flex items-center justify-center p-4 bg-gray-50">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="max-h-28 max-w-[80%] object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                >
                  Integrate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
