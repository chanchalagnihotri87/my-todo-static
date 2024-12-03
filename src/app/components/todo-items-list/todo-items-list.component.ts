import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import TodoItem from '../../../model/TodoItem';
import { SprintService } from '../../../services/sprint.service';
import { TodoService } from '../../../services/todo.service';

@Component({
  selector: 'app-todo-items-list',
  standalone: true,
  imports: [CdkDrag, CdkDropList, RouterLink],
  templateUrl: './todo-items-list.component.html',
  styleUrl: './todo-items-list.component.scss',
})
export class TodoItemsListComponent {
  todoService = inject(TodoService);
  sprintService = inject(SprintService);
  taskId = input.required<number>();
  todoItems = input.required<TodoItem[]>();

  onEdit = output<TodoItem>();

  sprints = computed(() =>
    this.sprintService.sprints().filter((sprint) => sprint.endDate > new Date())
  );

  ngOnInit() {
    console.log(this.sprints());
  }

  markAsNormal(id: number) {
    this.todoService.markAsNormal(id);
  }

  markAsTwentyPercent(id: number) {
    this.todoService.markAsTwentyPercent(id);
  }

  handleEdit(todoItem: TodoItem) {
    this.onEdit.emit(todoItem);
  }
  handleDelete(id: number) {
    const confirmed = window.confirm('Do you really want to delete?');
    if (confirmed) {
      this.todoService.delete(id);
    }
  }

  toggleCompleted(id: number) {
    this.todoService.toggleCompleted(id);
  }

  dropProblem(event: CdkDragDrop<TodoItem[]>) {
    const id = this.todoItems()[event.previousIndex].id;
    const objectiveId = +this.taskId();

    this.todoService.moveTodoItem(id, objectiveId, event.currentIndex);
  }

  updateSprint(id: number, event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    this.todoService.assignSprint(id, value ? +value : undefined);
  }
}
