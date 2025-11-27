import Express, { Router } from 'express';
import { getCourse, getCourses, getCoursesByProduct, getProducts, renderCoursesView } from './controller.js';

const apiRouter: Router = Express.Router();
const viewRouter: Router = Express.Router();

/**
 * API router for course-related endpoints.
 */
apiRouter.get('/courses', getCourses);
apiRouter.get('/products', getProducts);
apiRouter.get('/products/:productId/courses', getCoursesByProduct);
apiRouter.get('/courses/:id', getCourse);

/**
 * View router for course pages.
 */
viewRouter.get('/courses', renderCoursesView);

export { apiRouter as coursesApiRoutes, viewRouter as coursesViewRoutes };
