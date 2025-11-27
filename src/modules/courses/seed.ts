import { PrismaClient, Client } from '../../../prisma/generated/prisma/client.ts';
import { readFile } from 'fs/promises';

interface CurriculumCourse {
  id: string;
  naam: string;
  jaar: number;
  blok: number;
  track: Track;
  ects: number;
  programmeertaal: string | null;
  phaseScores: {
    analyse: number;
    ontwerp: number;
    implementatie: number;
    evaluatie: number;
  };
  producten: string[];
}

interface CurriculumData {
  courses?: CurriculumCourse[];
}

/**
 * Seed Course records from the curriculum JSON file.
 */
export async function seedCourses(prisma: PrismaClient): Promise<number> {
  const curriculumPath = new URL('../../../curriculum.data.json', import.meta.url);
  const raw = await readFile(curriculumPath, 'utf-8');
  const { courses = [] } = JSON.parse(raw) as CurriculumData;

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        naam: course.naam,
        jaar: course.jaar,
        blok: course.blok,
        track: course.track,
        ects: course.ects,
        programmeertaal: course.programmeertaal,
        phaseScores: course.phaseScores,
        producten: course.producten,
      },
      create: {
        id: course.id,
        naam: course.naam,
        jaar: course.jaar,
        blok: course.blok,
        track: course.track,
        ects: course.ects,
        programmeertaal: course.programmeertaal,
        phaseScores: course.phaseScores,
        producten: course.producten,
      },
    });
  }

  return courses.length;
}
