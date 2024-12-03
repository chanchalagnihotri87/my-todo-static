import { Injectable, signal } from '@angular/core';
import Problem from '../model/Problem';

const initialProblems = [
  new Problem(1, 'Not able to speak in english', 1, true, true),
  new Problem(2, 'Lack of sales man skill', 1, true, true),
  new Problem(3, 'Build product from scratch', 1, true, true),
  new Problem(4, 'Business mindset', 1),
];

@Injectable({ providedIn: 'root' })
export class ProblemService {
  private _problems = signal(initialProblems);

  problems = this._problems.asReadonly();

  updatePlan(id: number, plan: string) {
    this._problems.update((prevProblems) => {
      const currentProblemIndex = prevProblems.findIndex(
        (prob) => prob.id === id
      );

      if (currentProblemIndex > -1) {
        prevProblems[currentProblemIndex].plan = plan;
      }

      return prevProblems;
    });
  }

  toggleCompleted(id: number) {
    this._problems.update((prevProblems) => {
      const currentProblemIndex = prevProblems.findIndex(
        (prob) => prob.id === id
      );

      if (currentProblemIndex > -1) {
        prevProblems[currentProblemIndex].completed =
          !prevProblems[currentProblemIndex].completed;
      }

      return prevProblems;
    });
  }

  markAsTwentyPercent(id: number) {
    this._problems.update((prevProblems) => {
      const currentProblemIndex = prevProblems.findIndex(
        (prob) => prob.id === id
      );

      if (currentProblemIndex > -1) {
        prevProblems[currentProblemIndex].twentyPercent = true;
      }

      return prevProblems;
    });
  }

  markAsNormal(id: number) {
    this._problems.update((prevProblems) => {
      const currentProblemIndex = prevProblems.findIndex(
        (prob) => prob.id === id
      );

      if (currentProblemIndex > -1) {
        prevProblems[currentProblemIndex].twentyPercent = false;
      }

      return prevProblems;
    });
  }

  delete(id: number) {
    this._problems.update((prevProblems) =>
      prevProblems.filter((prob) => prob.id !== id)
    );
  }

  addProblem(title: string, lifeAreaId: number) {
    const problemIds = this._problems().map((problem) => problem.id);
    const id = problemIds.length === 0 ? 1 : Math.max(...problemIds) + 1;

    this._problems.update((prevProblems) => [
      ...prevProblems,
      new Problem(id, title, lifeAreaId),
    ]);
  }

  updateProblem(id: number, title: string) {
    this._problems.update((prevProblems) => {
      const currentProblemIndex = prevProblems.findIndex(
        (prob) => prob.id === id
      );

      if (currentProblemIndex > -1) {
        prevProblems[currentProblemIndex].text = title;
      }

      return prevProblems;
    });
  }

  moveProblem(id: number, lifeAreaId: number, index: number) {
    const actualIndex = index + 1;

    const nonUpdatedProblems = [
      ...this._problems().filter(
        (problem) => problem.lifeAreaId !== lifeAreaId
      ),
    ];

    const updatedProblems = [
      ...this._problems().filter(
        (problem) => problem.lifeAreaId === lifeAreaId
      ),
    ];

    const draggedProblem = updatedProblems.find((problem) => problem.id === id);

    if (actualIndex === draggedProblem!.index) {
      return;
    }

    if (actualIndex < draggedProblem!.index) {
      updatedProblems
        .filter(
          (problem) =>
            problem.index <= actualIndex && problem.index >= actualIndex
        )
        .forEach((problem) => {
          problem.index++;
        });
    } else {
      updatedProblems
        .filter(
          (problem) =>
            problem.index >= actualIndex && problem.index <= actualIndex
        )
        .forEach((problem) => {
          problem.index--;
        });
    }

    draggedProblem!.index = actualIndex;

    this._problems.set([...nonUpdatedProblems, ...updatedProblems]);
  }

  getById(id: number) {
    return this._problems().find((x) => x.id === id);
  }
}
