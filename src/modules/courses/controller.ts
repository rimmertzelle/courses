import { NextFunction, Request, Response } from 'express';
import coursesService from './service.js';
import type { CourseDto } from './dtos/courseDto.js';
import type { LinkDto } from './dtos/linkDto.js';
import { ok } from '../../common/utils/response.js';
import { resourceUrl } from '../../common/utils/url.js';

/**
 * GET /courses
 * Returns a list of hyperlinks to individual course resources.
 */
export async function getCourses(req: Request, res: Response): Promise<void> {
  const courses: CourseDto[] = await coursesService.listCourses();
  const links: LinkDto[] = courses.map((course) => ({
    href: resourceUrl(req, `/courses/${course.id}`),
    rel: 'course',
    title: course.naam,
  }));
  const response = ok<LinkDto[]>(req, links, { title: 'All courses', count: courses.length });
  res.status(200).json(response);
}

/**
 * GET /products
 * Returns a list of hyperlinks to courses grouped by product id.
 */
export async function getProducts(req: Request, res: Response): Promise<void> {
  const productIds: string[] = await coursesService.listProducts();
  const links: LinkDto[] = productIds.map((productId) => ({
    href: resourceUrl(req, `/products/${productId}/courses`),
    rel: 'product',
    title: productId,
  }));
  const response = ok<LinkDto[]>(req, links, { title: 'All products', count: productIds.length });
  res.status(200).json(response);
}

/**
 * GET /products/:productId/courses
 * Returns all courses that include the given product as a deliverable.
 */
export async function getCoursesByProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  const productId: string = req.params.productId;

  try {
    const courses: CourseDto[] = await coursesService.listCoursesByProduct(productId);
    const response = ok<CourseDto[]>(req, courses, { title: 'Courses by product', count: courses.length });
    res.status(200).json(response);
  } catch (err) {
    next(err); // forwards to error handler
  }
}

/**
 * GET /courses/:id
 * Returns a single course resource.
 */
export async function getCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id: string = req.params.id;

  try {
    const course: CourseDto = await coursesService.getCourseById(id);
    const response = ok<CourseDto>(req, course, { title: 'Course by id' });
    res.status(200).json(response);
  } catch (err) {
    next(err); // forwards to error handler
  }
}
