import { Injectable, signal } from '@angular/core';
import Goal from '../model/Goal';

const initialGoals = [
  new Goal(1, 'Correct in english', 1, true, true),
  new Goal(2, 'Confidence in english', 1, true, true),
  new Goal(3, 'Speaking fast', 1, true, true),
  new Goal(4, 'Fluent in english', 1),
];

@Injectable({ providedIn: 'root' })
export class GoalService {
  private _goals = signal(initialGoals);

  goals = this._goals.asReadonly();

  updatePlan(id: number, plan: string) {
    this._goals.update((prevGoals) => {
      const currentGoalIndex = prevGoals.findIndex((goal) => goal.id === id);

      if (currentGoalIndex > -1) {
        prevGoals[currentGoalIndex].plan = plan;
      }

      return prevGoals;
    });
  }

  toggleCompleted(id: number) {
    this._goals.update((prevGoals) => {
      const currentGoalIndex = prevGoals.findIndex((goal) => goal.id === id);

      if (currentGoalIndex > -1) {
        prevGoals[currentGoalIndex].completed =
          !prevGoals[currentGoalIndex].completed;
      }

      return prevGoals;
    });
  }

  markAsTwentyPercent(id: number) {
    this._goals.update((prevGoals) => {
      const currentGoalIndex = prevGoals.findIndex((goal) => goal.id === id);

      if (currentGoalIndex > -1) {
        prevGoals[currentGoalIndex].twentyPercent = true;
      }

      return prevGoals;
    });
  }

  markAsNormal(id: number) {
    this._goals.update((prevGoals) => {
      const currentGoalIndex = prevGoals.findIndex((goal) => goal.id === id);

      if (currentGoalIndex > -1) {
        prevGoals[currentGoalIndex].twentyPercent = false;
      }

      return prevGoals;
    });
  }

  delete(id: number) {
    this._goals.update((prevGoals) =>
      prevGoals.filter((goal) => goal.id !== id)
    );
  }

  addGoal(title: string, lifeAreaId: number) {
    const goalIds = this._goals().map((goal) => goal.id);
    const id = goalIds.length === 0 ? 1 : Math.max(...goalIds) + 1;

    this._goals.update((prevGoals) => [
      ...prevGoals,
      new Goal(id, title, lifeAreaId),
    ]);
  }

  updateGoal(id: number, title: string) {
    this._goals.update((prevGoals) => {
      const currentGoalIndex = prevGoals.findIndex((goal) => goal.id === id);

      if (currentGoalIndex > -1) {
        prevGoals[currentGoalIndex].text = title;
      }

      return prevGoals;
    });
  }

  moveGoal(id: number, problemId: number, index: number) {
    const actualIndex = index + 1;

    const nonUpdatedGoals = [
      ...this._goals().filter((goal) => goal.problemId !== problemId),
    ];

    const updatedGoals = [
      ...this._goals().filter((goal) => goal.problemId === problemId),
    ];

    const draggedGoal = updatedGoals.find((goal) => goal.id === id);

    if (actualIndex === draggedGoal!.index) {
      return;
    }

    if (actualIndex < draggedGoal!.index) {
      updatedGoals
        .filter(
          (problem) =>
            problem.index <= actualIndex && problem.index >= actualIndex
        )
        .forEach((problem) => {
          problem.index++;
        });
    } else {
      updatedGoals
        .filter(
          (problem) =>
            problem.index >= actualIndex && problem.index <= actualIndex
        )
        .forEach((problem) => {
          problem.index--;
        });
    }

    draggedGoal!.index = actualIndex;

    this._goals.set([...nonUpdatedGoals, ...updatedGoals]);
  }

  getById(id: number) {
    return this._goals().find((x) => x.id === id);
  }
}
