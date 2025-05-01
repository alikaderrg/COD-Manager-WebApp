
import React from 'react';
import { motion } from 'framer-motion';

const ReturnCenterOverview = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-6"
  >
    <h1 className="text-3xl font-bold mb-6 text-primary">Return Center</h1>
    <p className="text-muted-foreground">Return overview, reception, and history will be managed here.</p>
    {/* Add Return Center specific components here */}
  </motion.div>
);

export default ReturnCenterOverview;
