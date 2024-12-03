import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Goal from '../../model/Goal';
import { PathItem } from '../../model/PathItem';
import Problem from '../../model/Problem';
import { GoalService } from '../../services/goal.service';
import { ProblemService } from '../../services/problem.service';
import { AddEditModalComponent } from '../components/add-edit-modal/add-edit-modal.component';
import { BreadcrumComponent } from '../components/breadcrum/breadcrum.component';
import { GoalsListComponent } from '../components/goals-list/goals-list.component';
import { PageHederComponent } from '../components/page-heder/page-heder.component';
import { TopItemsComponent } from '../components/top-items/top-items.component';

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [
    BreadcrumComponent,
    PageHederComponent,
    FormsModule,
    GoalsListComponent,
    AddEditModalComponent,
    TopItemsComponent,
  ],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss',
})
export class ProblemComponent {
  id = input.required<number>();
  vision: string = '';
  plan: string = '';

  showGoalModal = false;
  selectedGoalId: number | undefined;
  enteredTitle: string = '';

  private goalService = inject(GoalService);
  private problemService = inject(ProblemService);

  problem = signal<Problem | undefined>(undefined);

  get paths() {
    return [
      new PathItem('Life Areas', '/'),
      new PathItem('Problems', '/lifearea/' + this.problem()?.lifeAreaId),
      new PathItem('Detail', ''),
    ];
  }

  goals = computed(() =>
    this.goalService.goals().sort((a, b) => (a.index < b.index ? -1 : 1))
  );

  get top20PercentGoals() {
    return this.goals()
      .filter((goal) => goal.twentyPercent)
      .map((goal) => new PathItem(goal.text, '/goal/' + goal.id));
  }

  ngOnInit() {
    const problem = this.problemService.getById(+this.id());
    this.problem.set(problem);

    this.plan = problem?.plan ?? '';
  }

  updatePlan() {
    this.problemService.updatePlan(+this.id(), this.plan);
  }

  startAddingGoal() {
    this.showGoalModal = true;
  }

  hideModal() {
    this.showGoalModal = false;
    this.selectedGoalId = undefined;
    this.enteredTitle = '';
  }

  handleEdit(goal: Goal) {
    this.showGoalModal = true;
    this.selectedGoalId = goal.id;
    this.enteredTitle = goal.text;
  }

  handleSubmitForm(title: string) {
    if (this.selectedGoalId) {
      this.goalService.updateGoal(this.selectedGoalId, title);
    } else {
      this.goalService.addGoal(title, +this.id());
    }
  }
}
