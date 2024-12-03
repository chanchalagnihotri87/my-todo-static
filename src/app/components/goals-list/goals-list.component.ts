import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import Goal from '../../../model/Goal';
import { GoalService } from '../../../services/goal.service';

@Component({
  selector: 'app-goals-list',
  standalone: true,
  imports: [CdkDrag, CdkDropList, RouterLink],
  templateUrl: './goals-list.component.html',
  styleUrl: './goals-list.component.scss',
})
export class GoalsListComponent {
  goalService = inject(GoalService);
  problemId = input.required<number>();
  goals = input.required<Goal[]>();

  onEdit = output<Goal>();

  markAsNormal(id: number) {
    this.goalService.markAsNormal(id);
  }

  markAsTwentyPercent(id: number) {
    this.goalService.markAsTwentyPercent(id);
  }

  handleEdit(goal: Goal) {
    this.onEdit.emit(goal);
  }
  handleDelete(id: number) {
    const confirmed = window.confirm('Do you really want to delete?');
    if (confirmed) {
      this.goalService.delete(id);
    }
  }

  toggleCompleted(id: number) {
    this.goalService.toggleCompleted(id);
  }

  dropProblem(event: CdkDragDrop<Goal[]>) {
    const id = this.goals()[event.previousIndex].id;
    const problemId = +this.problemId();

    this.goalService.moveGoal(id, problemId, event.currentIndex);
  }
}
