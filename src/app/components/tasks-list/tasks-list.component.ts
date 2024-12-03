import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import Task from '../../../model/Task';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CdkDrag, CdkDropList, RouterLink],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export class TasksListComponent {
  taskService = inject(TaskService);
  objectiveId = input.required<number>();
  tasks = input.required<Task[]>();

  onEdit = output<Task>();

  markAsNormal(id: number) {
    this.taskService.markAsNormal(id);
  }

  markAsTwentyPercent(id: number) {
    this.taskService.markAsTwentyPercent(id);
  }

  handleEdit(task: Task) {
    this.onEdit.emit(task);
  }
  handleDelete(id: number) {
    const confirmed = window.confirm('Do you really want to delete?');
    if (confirmed) {
      this.taskService.delete(id);
    }
  }

  toggleCompleted(id: number) {
    this.taskService.toggleCompleted(id);
  }

  dropProblem(event: CdkDragDrop<Task[]>) {
    const id = this.tasks()[event.previousIndex].id;
    const objectiveId = +this.objectiveId();

    this.taskService.moveTask(id, objectiveId, event.currentIndex);
  }
}
