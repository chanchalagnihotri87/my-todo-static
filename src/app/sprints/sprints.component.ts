import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PathItem } from '../../model/PathItem';
import Sprint from '../../model/Sprint';
import { SprintService } from '../../services/sprint.service';
import { BreadcrumComponent } from '../components/breadcrum/breadcrum.component';
import { PageHederComponent } from '../components/page-heder/page-heder.component';

@Component({
  selector: 'app-sprints',
  standalone: true,
  imports: [
    BreadcrumComponent,
    PageHederComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './sprints.component.html',
  styleUrl: './sprints.component.scss',
})
export class SprintsComponent {
  showSprintModal = false;
  selectedSprintId: number | undefined;

  sprintService = inject(SprintService);

  get paths() {
    return [new PathItem('Sprints', '')];
  }

  sprints = computed(() =>
    this.sprintService
      .sprints()
      .sort(
        (a: Sprint, b: Sprint) =>
          a.startDate.getMilliseconds() - b.startDate.getMilliseconds()
      )
  );

  hideModal() {
    this.closeModal();
  }

  private closeModal() {
    this.selectedSprintId = undefined;
    this.showSprintModal = false;
    this.sprintForm.reset();
  }

  startAddingSprint() {
    this.showSprintModal = true;
  }

  sprintForm = new FormGroup({
    title: new FormControl('', { validators: [Validators.required] }),
    startDate: new FormControl('', { validators: [Validators.required] }),
    endDate: new FormControl('', { validators: [Validators.required] }),
  });

  converToDateElementString(date: Date) {
    return new DatePipe('en-US').transform(date, 'yyyy-MM-dd');
  }
  handleEdit(sprint: Sprint) {
    this.selectedSprintId = sprint.id;
    this.sprintForm.controls.title.setValue(sprint.text);

    this.sprintForm.controls.startDate.setValue(
      this.converToDateElementString(sprint.startDate)
    );

    this.sprintForm.controls.endDate.setValue(
      this.converToDateElementString(sprint.endDate)
    );

    this.showSprintModal = true;
  }

  handleDelete(id: number) {
    const confirmed = window.confirm('Do you really want to delete?');
    if (confirmed) {
      this.sprintService.delete(id);
    }
  }
  onsubmitSprintForm() {
    if (this.sprintForm.invalid) {
      return;
    }

    const title = this.sprintForm.value.title ?? '';
    const startDate = new Date(this.sprintForm.value.startDate ?? '');
    const endDate = new Date(this.sprintForm.value.endDate ?? '');

    if (this.selectedSprintId) {
      this.sprintService.updateSprint(
        this.selectedSprintId,
        title,
        startDate,
        endDate
      );
    } else {
      this.sprintService.addSprint(title, startDate, endDate);
    }

    this.closeModal();
  }

  toggleCompleted(id: number) {}
}
