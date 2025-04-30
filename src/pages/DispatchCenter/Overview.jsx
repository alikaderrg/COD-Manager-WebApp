
import React from 'react';
import { motion } from 'framer-motion';

const DispatchCenterOverview = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-6"
  >
    <h1 className="text-3xl font-bold mb-6 text-primary">Dispatch Center</h1>
    <p className="text-muted-foreground">Bags overview, order dispatch, and bag dispatch functionalities will be here.</p>
    {/* Add Dispatch Center specific components here */}
  </motion.div>
);

export default DispatchCenterOverview;
