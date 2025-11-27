import { NextFunction, Request, Response } from 'express';
import coursesService from './service.js';
import type { CourseDto } from './dtos/courseDto.js';
import type { LinkDto } from './dtos/linkDto.js';
import { ok } from '../../common/utils/response.js';
import { resourceUrl } from '../../common/utils/url.js';

const PHASE_ORDER: Array<keyof CourseDto['phaseScores']> = ['analyse', 'ontwerp', 'implementatie', 'evaluatie'];
const PHASE_COLORS: Record<keyof CourseDto['phaseScores'], string> = {
  analyse: '#2563eb',
  ontwerp: '#7c3aed',
  implementatie: '#16a34a',
  evaluatie: '#f97316',
};

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
 * GET /courses/view
 * Renders an HTML view of all courses using EJS.
 */
export async function renderCoursesView(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const courses: CourseDto[] = await coursesService.listCourses();
    const viewModel = courses.map((course) => {
      const totalScore = PHASE_ORDER.reduce((sum, phase) => sum + course.phaseScores[phase], 0);
      let startDeg = 0;
      const segments = PHASE_ORDER.map((phase) => {
        const pct = totalScore > 0 ? (course.phaseScores[phase] / totalScore) * 100 : 0;
        const deg = pct * 3.6;
        const segment = {
          phase,
          score: course.phaseScores[phase],
          color: PHASE_COLORS[phase],
          start: startDeg,
          end: startDeg + deg,
        };
        startDeg += deg;
        return segment;
      });
      const gradient = segments
        .map((seg) => `${seg.color} ${seg.start.toFixed(2)}deg ${seg.end.toFixed(2)}deg`)
        .join(', ');

      return {
        id: course.id,
        name: course.naam,
        year: course.jaar,
        block: course.blok,
        track: course.track,
        phases: segments,
        gradient: `conic-gradient(${gradient})`,
      };
    });

    const years = [1, 2, 3, 4];
    const blocks = [1, 2, 3, 4];
    const grid = years.map((year) => ({
      year,
      blocks: blocks.map((block) => ({
        block,
        courses: viewModel.filter((course) => course.year === year && course.block === block),
      })),
    }));

    const yearLong = viewModel.filter((course) => course.block === 0);

    res.render('courses', {
      title: 'Courses',
      grid,
      yearLong,
    });
  } catch (err) {
    next(err); // forwards to error handler
  }
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
