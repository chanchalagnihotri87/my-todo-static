import { Injectable, signal } from '@angular/core';
import TodoItem from '../model/TodoItem';

const initialTodoItems = [
  new TodoItem(1, 'Remind before random topic for 7 days', 1, true, true),
  new TodoItem(
    2,
    'Remind before dictionary practice for 7 days',
    1,
    true,
    true
  ),
  new TodoItem(3, 'Remind before FS set for 7 days', 1, true, true, 2),
  new TodoItem(
    4,
    'Aware for real life conversation without reminder for 7 days',
    1,
    false,
    false,
    2
  ),
];

@Injectable({ providedIn: 'root' })
export class TodoService {
  private _todoItems = signal(initialTodoItems);

  todoItems = this._todoItems.asReadonly();

  toggleCompleted(id: number) {
    this._todoItems.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].completed = !prevItems[currentIndex].completed;
      }

      return prevItems;
    });
  }

  markAsTwentyPercent(id: number) {
    this._todoItems.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].twentyPercent = true;
      }

      return prevItems;
    });
  }

  markAsNormal(id: number) {
    this._todoItems.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].twentyPercent = false;
      }

      return prevItems;
    });
  }

  delete(id: number) {
    this._todoItems.update((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  }

  addTodoItem(title: string, taskId: number) {
    const ids = this._todoItems().map((item) => item.id);
    const id = ids.length === 0 ? 1 : Math.max(...ids) + 1;

    this._todoItems.update((prevItems) => [
      ...prevItems,
      new TodoItem(id, title, taskId),
    ]);
  }

  updateTodoItem(id: number, title: string) {
    this._todoItems.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].text = title;
      }

      return prevItems;
    });
  }

  moveTodoItem(id: number, taskId: number, index: number) {
    const actualIndex = index + 1;

    const nonUpdatedItems = [
      ...this._todoItems().filter((item) => item.taskId !== taskId),
    ];

    const updatedItems = [
      ...this._todoItems().filter((goal) => goal.taskId === taskId),
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

    this._todoItems.set([...nonUpdatedItems, ...updatedItems]);
  }

  getById(id: number) {
    return this._todoItems().find((item) => item.id === id);
  }

  assignSprint(id: number, sprintId: number | undefined) {
    this._todoItems.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].sprintId = sprintId;
        prevItems[currentIndex].date = undefined;
      }

      return prevItems;
    });
  }

  assignDate(id: number, dateString: string | undefined) {
    const date = dateString ? new Date(dateString) : undefined;

    this._todoItems.update((prevItems) => {
      const currentIndex = prevItems.findIndex((item) => item.id === id);

      if (currentIndex > -1) {
        prevItems[currentIndex].date = date;
      }

      return prevItems;
    });
  }
}
