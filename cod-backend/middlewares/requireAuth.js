// This file simply re-exports the authenticateToken function under the name 'requireAuth'
import { authenticateToken } from './authenticate.js';

export const requireAuth = authenticateToken;
