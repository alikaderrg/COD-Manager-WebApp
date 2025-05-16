
import React from 'react';
import { motion } from 'framer-motion';

const TeamMemebers = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="p-6"
  >
    <h1 className="text-3xl font-bold mb-6 text-primary">HR & Team Management</h1>
    <p className="text-muted-foreground">Team members, roles, salary setup, and warehouse management functionalities will be here.</p>
    {/* Add HR specific components here */}
  </motion.div>
);

export default TeamMemebers;
