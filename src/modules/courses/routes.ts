import Express, { Router } from 'express';
import { getCourse, getCourses, getCoursesByProduct, getProducts } from './controller.js';

const router: Router = Express.Router();

/**
 * Router for course-related endpoints.
 */

/**
 * GET /courses
 * Returns a hypermedia list of links to course resources.
 */
router.get('/courses', getCourses);

/**
 * GET /products
 * Returns a hypermedia list of links to products with course overviews.
 */
router.get('/products', getProducts);

/**
 * GET /products/:productId/courses
 * Returns all courses for a given product deliverable.
 */
router.get('/products/:productId/courses', getCoursesByProduct);

/**
 * GET /courses/:id
 * Returns a single course resource by id.
 */
router.get('/courses/:id', getCourse);

export default router;
