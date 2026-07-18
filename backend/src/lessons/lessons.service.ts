import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  private lessons: any[] = [];

  create(createLessonDto: CreateLessonDto) {
    const newLesson = { id: this.lessons.length + 1, ...createLessonDto };
    this.lessons.push(newLesson);
    return newLesson;
  }

  findOne(id: number) {
    return this.lessons.find(l => l.id === id);
  }

  update(id: number, updateLessonDto: UpdateLessonDto) {
    const lessonIndex = this.lessons.findIndex(l => l.id === id);
    if (lessonIndex > -1) {
      this.lessons[lessonIndex] = { ...this.lessons[lessonIndex], ...updateLessonDto };
      return this.lessons[lessonIndex];
    }
    return null;
  }

  remove(id: number) {
    const lessonIndex = this.lessons.findIndex(l => l.id === id);
    if (lessonIndex > -1) {
      const removed = this.lessons[lessonIndex];
      this.lessons.splice(lessonIndex, 1);
      return removed;
    }
    return null;
  }
}
