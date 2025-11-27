import type { Router } from 'express';
import { clientsRoutes } from './clients/index.js';
import { coursesRoutes } from './courses/index.js';

export { clientsRoutes } from './clients/index.js';
export { coursesRoutes } from './courses/index.js';

export const moduleRoutes: Router[] = [clientsRoutes, coursesRoutes];
