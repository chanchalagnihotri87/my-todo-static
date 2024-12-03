import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import Objective from '../../../model/Objective';
import { ObjectiveService } from '../../../services/objective.service';

@Component({
  selector: 'app-objectives-list',
  standalone: true,
  imports: [CdkDrag, CdkDropList, RouterLink],
  templateUrl: './objectives-list.component.html',
  styleUrl: './objectives-list.component.scss',
})
export class ObjectivesListComponent {
  objectiveService = inject(ObjectiveService);
  goalId = input.required<number>();
  objectives = input.required<Objective[]>();

  onEdit = output<Objective>();

  markAsNormal(id: number) {
    this.objectiveService.markAsNormal(id);
  }

  markAsTwentyPercent(id: number) {
    this.objectiveService.markAsTwentyPercent(id);
  }

  handleEdit(objective: Objective) {
    this.onEdit.emit(objective);
  }
  handleDelete(id: number) {
    const confirmed = window.confirm('Do you really want to delete?');
    if (confirmed) {
      this.objectiveService.delete(id);
    }
  }

  toggleCompleted(id: number) {
    this.objectiveService.toggleCompleted(id);
  }

  dropProblem(event: CdkDragDrop<Objective[]>) {
    const id = this.objectives()[event.previousIndex].id;
    const goalId = +this.goalId();

    this.objectiveService.moveObjective(id, goalId, event.currentIndex);
  }
}
