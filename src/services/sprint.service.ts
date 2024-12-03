import { Injectable, signal } from '@angular/core';
import Sprint from '../model/Sprint';

const initialSprints = [
  new Sprint(1, 'Sprint 101', new Date(2024, 8, 30), new Date(2024, 9, 4)),
  new Sprint(
    2,
    'Sprint 102',
    new Date(2024, 9, 7),
    new Date(2024, 9, 11),
    false
  ),
  new Sprint(3, 'Sprint 103', new Date(2024, 9, 14), new Date(2024, 9, 18)),
];

@Injectable({ providedIn: 'root' })
export class SprintService {
  private _sprints = signal(initialSprints);

  sprints = this._sprints.asReadonly();

  delete(id: number) {
    this._sprints.update((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  }

  addSprint(title: string, startDate: Date, endDate: Date) {
    const ids = this._sprints().map((item) => item.id);
    const id = ids.length === 0 ? 1 : Math.max(...ids) + 1;

    this._sprints.update((prevItems) => [
      ...prevItems,
      new Sprint(id, title, startDate, endDate),
    ]);
  }

  updateSprint(id: number, title: string, startDate: Date, endDate: Date) {
    this._sprints.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].text = title;
        prevItems[currentIndex].startDate = startDate;
        prevItems[currentIndex].endDate = endDate;
      }

      return prevItems;
    });
  }

  getById(id: number) {
    return this._sprints().find((item) => item.id === id);
  }
}
