import { validateApiConfig } from './utils/apiHelper.js';
import { initializeAPIClients } from './api/clients.js';

export const setupApplication = () => {
  try {
    validateApiConfig();
    const clients = initializeAPIClients();
    return {
      ready: true,
      clients,
    };
  } catch (error) {
    return {
      ready: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};