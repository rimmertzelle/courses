/**
 * Application-facing Course entity shape.
 * Includes curriculum-specific grading and deliverables.
 */
export interface PhaseScores {
  analyse: number;
  ontwerp: number;
  implementatie: number;
  evaluatie: number;
}

export type Track = 'SE' | 'DS' | 'Both';

export interface Course {
  id?: string;
  naam: string;
  jaar: number;
  blok: number;
  track: Track;
  ects: number;
  programmeertaal: string | null;
  phaseScores: PhaseScores;
  producten: string[];
}

export default Course;
