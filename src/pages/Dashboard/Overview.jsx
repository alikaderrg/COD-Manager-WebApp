
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Package, BarChart, Users } from 'lucide-react';

const DashboardOverview = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-6"
  >
    <h1 className="text-3xl font-bold mb-6 text-primary">Dashboard Overview</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Example Cards - Replace with actual data */}
      <motion.div whileHover={{ scale: 1.03 }} className="bg-card p-6 rounded-lg shadow-lg border border-border">
        <h2 className="text-xl font-semibold mb-2 text-card-foreground">Total Orders</h2>
        <p className="text-3xl font-bold text-primary">1,234</p>
      </motion.div>
      <motion.div whileHover={{ scale: 1.03 }} className="bg-card p-6 rounded-lg shadow-lg border border-border">
        <h2 className="text-xl font-semibold mb-2 text-card-foreground">Revenue</h2>
        <p className="text-3xl font-bold text-green-500">DA 56,789</p>
      </motion.div>
      <motion.div whileHover={{ scale: 1.03 }} className="bg-card p-6 rounded-lg shadow-lg border border-border">
        <h2 className="text-xl font-semibold mb-2 text-card-foreground">Pending Shipments</h2>
        <p className="text-3xl font-bold text-orange-500">56</p>
      </motion.div>
      <motion.div whileHover={{ scale: 1.03 }} className="bg-card p-6 rounded-lg shadow-lg border border-border">
        <h2 className="text-xl font-semibold mb-2 text-card-foreground">New Customers</h2>
        <p className="text-3xl font-bold text-blue-500">12</p>
      </motion.div>
    </div>
     <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
            <Button variant="secondary">
                <Package className="mr-2 h-4 w-4" /> Add New Order
            </Button>
            <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" /> View Reports
            </Button>
             <Button variant="ghost">
                <Users className="mr-2 h-4 w-4" /> Manage Customers
            </Button>
        </div>
    </div>
     {/* Placeholder for Team Productivity */}
     <div className="mt-8 bg-card p-6 rounded-lg shadow-lg border border-border">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Team Productivity</h2>
        <p className="text-muted-foreground">Team productivity metrics will be displayed here.</p>
     </div>
  </motion.div>
);

export default DashboardOverview;
