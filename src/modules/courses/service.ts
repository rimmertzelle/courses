import coursesRepository from './repository.js';
import type { Course } from './types/course.js';
import type { CourseDto } from './dtos/courseDto.js';
import { toCourseDto, toCourseDtos } from './mapper.js';
import { BadRequestError, NotFoundError } from '../../common/errors/httpErrors.js';

/**
 * Service layer that contains business logic for Courses.
 * Uses the repository for data access and maps entities to DTOs.
 */
export class CoursesService {
  /**
   * List all courses and map them to DTOs.
   * @returns Promise resolving to an array of CourseDto
   */
  async listCourses(): Promise<CourseDto[]> {
    const courses: Course[] = await coursesRepository.findAll();
    return toCourseDtos(courses);
  }

  /**
   * List all distinct products referenced by courses.
   * @returns Promise resolving to an array of product ids
   */
  async listProducts(): Promise<string[]> {
    return coursesRepository.findDistinctProductIds();
  }

  /**
   * List all courses that include a specific product in their deliverables.
   * @param productId Product identifier
   * @throws BadRequestError when productId is missing
   * @returns Promise resolving to an array of CourseDto
   */
  async listCoursesByProduct(productId: string): Promise<CourseDto[]> {
    if (!productId) {
      throw new BadRequestError('Product id is required.');
    }
    const courses = await coursesRepository.findByProduct(productId);
    return toCourseDtos(courses);
  }

  /**
   * Get a single course by id and map to DTO.
   * @param id Course id (non-empty string)
   * @throws BadRequestError when id is missing
   * @throws NotFoundError when course does not exist
   * @returns Promise resolving to a CourseDto
   */
  async getCourseById(id: string): Promise<CourseDto> {
    if (!id) {
      throw new BadRequestError('Course id is required.');
    }
    const course = await coursesRepository.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return toCourseDto(course);
  }
}

export default new CoursesService();
