import type { Course } from './types/course.js';
import type { CourseDto } from './dtos/courseDto.js';

/**
 * Map an application Course entity to a DTO for API responses.
 */
export function toCourseDto(course: Course): CourseDto {
  return {
    id: course.id ?? '',
    naam: course.naam,
    jaar: course.jaar,
    blok: course.blok,
    track: course.track,
    ects: course.ects,
    programmeertaal: course.programmeertaal ?? null,
    phaseScores: {
      analyse: course.phaseScores.analyse,
      ontwerp: course.phaseScores.ontwerp,
      implementatie: course.phaseScores.implementatie,
      evaluatie: course.phaseScores.evaluatie,
    },
    producten: [...course.producten],
  };
}

/**
 * Map an array of Course entities to DTOs.
 */
export function toCourseDtos(courses: Course[]): CourseDto[] {
  return courses.map(toCourseDto);
}
