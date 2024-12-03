import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import Problem from '../../../model/Problem';
import { ProblemService } from '../../../services/problem.service';

@Component({
  selector: 'app-problems-list',
  standalone: true,
  imports: [CdkDrag, CdkDropList, RouterLink],
  templateUrl: './problems-list.component.html',
  styleUrl: './problems-list.component.scss',
})
export class ProblemsTabComponent {
  problemService = inject(ProblemService);
  lifeAreaId = input.required<number>();
  problems = input.required<Problem[]>();

  onEdit = output<Problem>();

  markAsNormal(id: number) {
    this.problemService.markAsNormal(id);
  }

  markAsTwentyPercent(id: number) {
    this.problemService.markAsTwentyPercent(id);
  }

  handleEdit(problem: Problem) {
    this.onEdit.emit(problem);
  }
  handleDelete(id: number) {
    const confirmed = window.confirm('Do you really want to delete?');
    if (confirmed) {
      this.problemService.delete(id);
    }
  }

  toggleCompleted(id: number) {
    this.problemService.toggleCompleted(id);
  }

  dropProblem(event: CdkDragDrop<Problem[]>) {
    const id = this.problems()[event.previousIndex].id;
    const lifeAreadId = +this.lifeAreaId();

    this.problemService.moveProblem(id, lifeAreadId, event.currentIndex);
  }
}
