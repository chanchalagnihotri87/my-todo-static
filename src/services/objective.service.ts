import { Injectable, signal } from '@angular/core';
import Objective from '../model/Objective';

const initialObjectives = [
  new Objective(1, 'Feeling as real time conversation', 1, true, true),
  new Objective(2, 'Think in english', 1, true, true),
  new Objective(3, 'Run time topic', 1, true, true),
  new Objective(4, 'English Movies', 1),
];

@Injectable({ providedIn: 'root' })
export class ObjectiveService {
  // private _objectives = signal(initialObjectives);
  private _objectives = signal(initialObjectives);

  objectives = this._objectives.asReadonly();

  updatePlan(id: number, plan: string) {
    this._objectives.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].plan = plan;
      }

      return prevItems;
    });
  }

  toggleCompleted(id: number) {
    this._objectives.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].completed = !prevItems[currentIndex].completed;
      }

      return prevItems;
    });
  }

  markAsTwentyPercent(id: number) {
    this._objectives.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].twentyPercent = true;
      }

      return prevItems;
    });
  }

  markAsNormal(id: number) {
    this._objectives.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].twentyPercent = false;
      }

      return prevItems;
    });
  }

  delete(id: number) {
    this._objectives.update((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  }

  addObjective(title: string, goalId: number) {
    const ids = this._objectives().map((item) => item.id);
    const id = ids.length === 0 ? 1 : Math.max(...ids) + 1;

    this._objectives.update((prevItems) => [
      ...prevItems,
      new Objective(id, title, goalId),
    ]);
  }

  updateObjective(id: number, title: string) {
    this._objectives.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].text = title;
      }

      return prevItems;
    });
  }

  moveObjective(id: number, goalId: number, index: number) {
    const actualIndex = index + 1;

    const nonUpdatedItems = [
      ...this._objectives().filter((item) => item.goalId !== goalId),
    ];

    const updatedItems = [
      ...this._objectives().filter((goal) => goal.goalId === goalId),
    ];

    const draggedItem = updatedItems.find((item) => item.id === id);

    if (actualIndex === draggedItem!.index) {
      return;
    }

    if (actualIndex < draggedItem!.index) {
      updatedItems
        .filter(
          (problem) =>
            problem.index <= actualIndex && problem.index >= actualIndex
        )
        .forEach((problem) => {
          problem.index++;
        });
    } else {
      updatedItems
        .filter(
          (problem) =>
            problem.index >= actualIndex && problem.index <= actualIndex
        )
        .forEach((problem) => {
          problem.index--;
        });
    }

    draggedItem!.index = actualIndex;

    this._objectives.set([...nonUpdatedItems, ...updatedItems]);
  }

  getById(id: number) {
    return this._objectives().find((item) => item.id === id);
  }
}
