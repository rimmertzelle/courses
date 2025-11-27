import type { Track } from '../types/course.js';

export interface PhaseScoresDto {
  analyse: number;
  ontwerp: number;
  implementatie: number;
  evaluatie: number;
}

/**
 * API-facing Course DTO.
 */
export interface CourseDto {
  id: string;
  naam: string;
  jaar: number;
  blok: number;
  track: Track;
  ects: number;
  programmeertaal: string | null;
  phaseScores: PhaseScoresDto;
  producten: string[];
}

export default CourseDto;
