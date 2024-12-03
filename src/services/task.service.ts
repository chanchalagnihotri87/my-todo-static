import { Injectable, signal } from '@angular/core';
import Task from '../model/Task';

const initialTasks = [
  new Task(
    1,
    'Remind yourself to think as real life conversation before start video',
    1,
    true,
    true
  ),
  new Task(2, 'Look at bar above mobile screen', 1, true, true),
  new Task(
    3,
    'Make runtime content, just keep the content clarity points',
    1,
    true,
    true
  ),
  new Task(4, 'Normal face expression', 1),
];

@Injectable({ providedIn: 'root' })
export class TaskService {
  private _tasks = signal(initialTasks);

  tasks = this._tasks.asReadonly();

  toggleCompleted(id: number) {
    this._tasks.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].completed = !prevItems[currentIndex].completed;
      }

      return prevItems;
    });
  }

  markAsTwentyPercent(id: number) {
    this._tasks.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].twentyPercent = true;
      }

      return prevItems;
    });
  }

  markAsNormal(id: number) {
    this._tasks.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].twentyPercent = false;
      }

      return prevItems;
    });
  }

  delete(id: number) {
    this._tasks.update((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  }

  addTask(title: string, obectiveId: number) {
    const ids = this._tasks().map((item) => item.id);
    const id = ids.length === 0 ? 1 : Math.max(...ids) + 1;

    this._tasks.update((prevItems) => [
      ...prevItems,
      new Task(id, title, obectiveId),
    ]);
  }

  updateTask(id: number, title: string) {
    this._tasks.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].text = title;
      }

      return prevItems;
    });
  }

  moveTask(id: number, objectiveId: number, index: number) {
    const actualIndex = index + 1;

    const nonUpdatedItems = [
      ...this._tasks().filter((item) => item.objectiveId !== objectiveId),
    ];

    const updatedItems = [
      ...this._tasks().filter((goal) => goal.objectiveId === objectiveId),
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

    this._tasks.set([...nonUpdatedItems, ...updatedItems]);
  }

  getById(id: number) {
    return this._tasks().find((item) => item.id === id);
  }
}
