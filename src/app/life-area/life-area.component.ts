import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import LifeArea from '../../model/LifeArea';
import { PathItem } from '../../model/PathItem';
import Problem from '../../model/Problem';
import { LifeAreaService } from '../../services/life-area.service';
import { ProblemService } from '../../services/problem.service';
import { AddEditModalComponent } from '../components/add-edit-modal/add-edit-modal.component';
import { BreadcrumComponent } from '../components/breadcrum/breadcrum.component';
import { PageHederComponent } from '../components/page-heder/page-heder.component';
import { ProblemsTabComponent } from '../components/problems-list/problems-list.component';
import { TopItemsComponent } from '../components/top-items/top-items.component';

@Component({
  selector: 'app-life-area',
  standalone: true,
  imports: [
    BreadcrumComponent,
    PageHederComponent,
    TopItemsComponent,
    FormsModule,

    AddEditModalComponent,
    ProblemsTabComponent,
  ],
  templateUrl: './life-area.component.html',
  styleUrl: './life-area.component.scss',
})
export class LifeAreaComponent implements OnInit {
  id = input.required<number>();
  vision: string = '';
  plan: string = '';

  showProblemModal = false;
  selectedProblemId: number | undefined;
  enteredTitle: string = '';

  private lifeAreaService = inject(LifeAreaService);
  private problemService = inject(ProblemService);

  lifeArea = signal<LifeArea | undefined>(undefined);
  problems = signal<Problem[]>([]);

  get paths() {
    return [new PathItem('Life Areas', '/'), new PathItem('Detail', '')];
  }

  // problems = computed(() =>
  //   this.problemService.problems().sort((a, b) => (a.index < b.index ? -1 : 1))
  // );

  get top20PercentProblems() {
    return this.problems()
      .filter((prob) => prob.twentyPercent)
      .map((problem) => new PathItem(problem.text, '/problem/' + problem.id));
  }

  ngOnInit() {
    const lifeAreaValue = this.lifeAreaService.getById(+this.id());
    this.lifeArea.set(lifeAreaValue);

    this.vision = lifeAreaValue?.vision ?? '';
    this.plan = lifeAreaValue?.plan ?? '';

    this.problems.set(
      this.problemService
        .problems()
        .filter((prob) => prob.lifeAreaId == lifeAreaValue?.id)
    );
  }

  updateVision() {
    this.lifeAreaService.updateVision(+this.id(), this.vision);
  }

  updatePlan() {
    this.lifeAreaService.updatePlan(+this.id(), this.plan);
  }

  startAddingProblem() {
    this.showProblemModal = true;
  }

  hideModal() {
    this.showProblemModal = false;
    this.selectedProblemId = undefined;
  }

  handleEdit(problem: Problem) {
    this.showProblemModal = true;
    this.selectedProblemId = problem.id;
    this.enteredTitle = problem.text;
  }

  handleSubmitForm(title: string) {
    if (this.selectedProblemId) {
      this.problemService.updateProblem(this.selectedProblemId, title);
    } else {
      this.problemService.addProblem(title, this.id());
    }
  }
}
