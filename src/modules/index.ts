import type { Router } from 'express';
import { clientsRoutes } from './clients/index.js';
import { coursesApiRoutes, coursesViewRoutes } from './courses/index.js';

export { clientsRoutes } from './clients/index.js';
export { coursesApiRoutes, coursesViewRoutes } from './courses/index.js';

export const apiRoutes: Router[] = [clientsRoutes, coursesApiRoutes];
export const viewRoutes: Router[] = [coursesViewRoutes];
