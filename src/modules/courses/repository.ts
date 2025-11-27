import prisma from '../../db/prisma.js';
import type { Course } from './types/course.js';

/**
 * Repository responsible for data access related to Courses.
 * Encapsulates Prisma queries and shields higher layers from ORM details.
 */
export class CoursesRepository {
  /**
   * Fetch all courses.
   * @returns Promise resolving to an array of courses.
   */
  async findAll(): Promise<Course[]> {
    return prisma.course.findMany();
  }

  /**
   * Fetch a course by its unique identifier.
   * @param id Course id
   * @returns Promise resolving to a course or null if not found.
   */
  async findById(id: string): Promise<Course | null> {
    return prisma.course.findUnique({ where: { id } });
  }

  /**
   * Fetch all courses that require a given product deliverable.
   * @param productId Product identifier
   * @returns Promise resolving to an array of courses.
   */
  async findByProduct(productId: string): Promise<Course[]> {
    return prisma.course.findMany({
      where: {
        producten: {
          has: productId,
        },
      },
    });
  }

  /**
   * Fetch distinct product ids across all courses.
   * @returns Promise resolving to an array of product ids.
   */
  async findDistinctProductIds(): Promise<string[]> {
    const records = await prisma.course.findMany({
      select: { producten: true },
    });
    const allProducts = records.flatMap((r) => r.producten ?? []);
    return Array.from(new Set(allProducts));
  }
}

export default new CoursesRepository();
