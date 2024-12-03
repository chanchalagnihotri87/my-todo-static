import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Goal from '../../model/Goal';
import Objective from '../../model/Objective';
import { PathItem } from '../../model/PathItem';
import Problem from '../../model/Problem';
import Task from '../../model/Task';
import TodoItem from '../../model/TodoItem';
import { GoalService } from '../../services/goal.service';
import { ObjectiveService } from '../../services/objective.service';
import { ProblemService } from '../../services/problem.service';
import { SprintService } from '../../services/sprint.service';
import { TaskService } from '../../services/task.service';
import { TodoService } from '../../services/todo.service';
import { AddEditModalComponent } from '../components/add-edit-modal/add-edit-modal.component';
import { BreadcrumComponent } from '../components/breadcrum/breadcrum.component';
import { GoalsListComponent } from '../components/goals-list/goals-list.component';
import { PageHederComponent } from '../components/page-heder/page-heder.component';
import { TodoItemsListComponent } from '../components/todo-items-list/todo-items-list.component';
import { TopItemsComponent } from '../components/top-items/top-items.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    BreadcrumComponent,
    PageHederComponent,
    FormsModule,
    GoalsListComponent,
    AddEditModalComponent,
    TopItemsComponent,
    TodoItemsListComponent,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  id = input.required<number>();

  showTodoModal = false;
  selectedTodoItemId: number | undefined;
  enteredTitle: string = '';

  private todoService = inject(TodoService);
  private taskService = inject(TaskService);
  private objectiveService = inject(ObjectiveService);
  private goalService = inject(GoalService);
  private problemService = inject(ProblemService);
  private sprintService = inject(SprintService);

  task = signal<Task | undefined>(undefined);

  objective = signal<Objective | undefined>(undefined);

  goal = signal<Goal | undefined>(undefined);

  problem = signal<Problem | undefined>(undefined);

  get paths() {
    return [
      new PathItem('Life Areas', '/'),
      new PathItem('Problems', '/lifearea/' + this.problem()?.lifeAreaId),
      new PathItem('Goals', '/problem/' + this.goal()?.problemId),
      new PathItem('Objectives', '/goal/' + this.objective()?.goalId),
      new PathItem('Tasks', '/objective/' + this.task()?.objectiveId),
      new PathItem('Detail', ''),
    ];
  }

  todoItems = computed(() =>
    this.todoService.todoItems().sort((a, b) => (a.index < b.index ? -1 : 1))
  );

  get top20PercentTasks() {
    return this.todoItems()
      .filter((task) => task.twentyPercent)
      .map((task) => new PathItem(task.text, '/task/' + task.id));
  }

  ngOnInit() {
    const task = this.taskService.getById(+this.id());
    this.task.set(task);

    const objective = this.objectiveService.getById(task?.objectiveId ?? 0);
    this.objective.set(objective);

    const goal = this.goalService.getById(objective?.goalId ?? 0);
    this.goal.set(goal);

    const problem = this.problemService.getById(goal?.problemId ?? 0);
    this.problem.set(problem);
  }

  startAddingTodoItem() {
    this.showTodoModal = true;
  }

  hideModal() {
    this.showTodoModal = false;
    this.selectedTodoItemId = undefined;
    this.enteredTitle = '';
  }

  handleEdit(todoItem: TodoItem) {
    this.showTodoModal = true;
    this.selectedTodoItemId = todoItem.id;
    this.enteredTitle = todoItem.text;
  }

  handleSubmitForm(title: string) {
    if (this.selectedTodoItemId) {
      this.todoService.updateTodoItem(this.selectedTodoItemId, title);
    } else {
      this.todoService.addTodoItem(title, +this.id());
    }
  }
}
