import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';

@Injectable()
export class CoursesService {
  private courses: any[] = [];

  create(createCourseDto: CreateCourseDto) {
    const newCourse = {
      id: this.courses.length + 1,
      ...createCourseDto,
      lessons: [],
      enrollCount: 0,
      avgRating: 0,
      createdAt: new Date(),
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  findAll(query: QueryCourseDto) {
    return this.courses;
  }

  findOne(id: number) {
    return this.courses.find(c => c.id === id);
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    const courseIndex = this.courses.findIndex(c => c.id === id);
    if (courseIndex > -1) {
      this.courses[courseIndex] = { ...this.courses[courseIndex], ...updateCourseDto };
      return this.courses[courseIndex];
    }
    return null;
  }

  remove(id: number) {
    const courseIndex = this.courses.findIndex(c => c.id === id);
    if (courseIndex > -1) {
      const removed = this.courses[courseIndex];
      this.courses.splice(courseIndex, 1);
      return removed;
    }
    return null;
  }
}
