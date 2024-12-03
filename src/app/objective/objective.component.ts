import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Goal from '../../model/Goal';
import Objective from '../../model/Objective';
import { PathItem } from '../../model/PathItem';
import Problem from '../../model/Problem';
import Task from '../../model/Task';
import { GoalService } from '../../services/goal.service';
import { ObjectiveService } from '../../services/objective.service';
import { ProblemService } from '../../services/problem.service';
import { TaskService } from '../../services/task.service';
import { AddEditModalComponent } from '../components/add-edit-modal/add-edit-modal.component';
import { BreadcrumComponent } from '../components/breadcrum/breadcrum.component';
import { GoalsListComponent } from '../components/goals-list/goals-list.component';
import { PageHederComponent } from '../components/page-heder/page-heder.component';
import { TasksListComponent } from '../components/tasks-list/tasks-list.component';
import { TopItemsComponent } from '../components/top-items/top-items.component';

@Component({
  selector: 'app-objective',
  standalone: true,
  imports: [
    BreadcrumComponent,
    PageHederComponent,
    FormsModule,
    GoalsListComponent,
    AddEditModalComponent,
    TopItemsComponent,
    TasksListComponent,
  ],
  templateUrl: './objective.component.html',
  styleUrl: './objective.component.scss',
})
export class ObjectiveComponent {
  id = input.required<number>();
  plan: string = '';

  showTaskModal = false;
  selectedTaskId: number | undefined;
  enteredTitle: string = '';

  private taskService = inject(TaskService);
  private objectiveService = inject(ObjectiveService);
  private goalService = inject(GoalService);
  private problemService = inject(ProblemService);

  objective = signal<Objective | undefined>(undefined);

  goal = signal<Goal | undefined>(undefined);

  problem = signal<Problem | undefined>(undefined);

  get paths() {
    return [
      new PathItem('Life Areas', '/'),
      new PathItem('Problems', '/lifearea/' + this.problem()?.lifeAreaId),
      new PathItem('Goals', '/problem/' + this.goal()?.problemId),
      new PathItem('Objectives', '/goal/' + this.objective()?.goalId),
      new PathItem('Detail', ''),
    ];
  }

  tasks = computed(() =>
    this.taskService.tasks().sort((a, b) => (a.index < b.index ? -1 : 1))
  );

  get top20PercentTasks() {
    return this.tasks()
      .filter((task) => task.twentyPercent)
      .map((task) => new PathItem(task.text, '/task/' + task.id));
  }

  ngOnInit() {
    const objective = this.objectiveService.getById(+this.id());
    this.objective.set(objective);

    this.plan = objective?.plan ?? '';

    const goal = this.goalService.getById(objective?.goalId ?? 0);
    this.goal.set(goal);

    const problem = this.problemService.getById(goal?.problemId ?? 0);
    this.problem.set(problem);
  }

  updatePlan() {
    this.objectiveService.updatePlan(+this.id(), this.plan);
  }

  startAddingTask() {
    this.showTaskModal = true;
  }

  hideModal() {
    this.showTaskModal = false;
    this.selectedTaskId = undefined;
    this.enteredTitle = '';
  }

  handleEdit(task: Task) {
    this.showTaskModal = true;
    this.selectedTaskId = task.id;
    this.enteredTitle = task.text;
  }

  handleSubmitForm(title: string) {
    if (this.selectedTaskId) {
      this.taskService.updateTask(this.selectedTaskId, title);
    } else {
      this.taskService.addTask(title, +this.id());
    }
  }
}
