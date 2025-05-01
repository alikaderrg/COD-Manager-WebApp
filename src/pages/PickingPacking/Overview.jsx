
import React from 'react';
import { motion } from 'framer-motion';

const PickingPackingOverview = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-6"
  >
    <h1 className="text-3xl font-bold mb-6 text-primary">Picking & Packing</h1>
    <p className="text-muted-foreground">Overview, picking lists, and packing station functionalities will be here.</p>
    {/* Add Picking & Packing specific components here */}
  </motion.div>
);

export default PickingPackingOverview;
