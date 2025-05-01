
import React from 'react';
import { motion } from 'framer-motion';

const AccountingOverview = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-6"
  >
    <h1 className="text-3xl font-bold mb-6 text-primary">Accounting</h1>
    <p className="text-muted-foreground">Overview summary, expenses, payroll, and invoice management will be handled here.</p>
    {/* Add Accounting specific components here */}
  </motion.div>
);

export default AccountingOverview;
