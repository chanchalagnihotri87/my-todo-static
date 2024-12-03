import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { PathItem } from '../../model/PathItem';
import Sprint from '../../model/Sprint';
import { SprintService } from '../../services/sprint.service';
import { TodoService } from '../../services/todo.service';
import { BreadcrumComponent } from '../components/breadcrum/breadcrum.component';
import { TopItemsComponent } from '../components/top-items/top-items.component';

@Component({
  selector: 'app-sprint',
  standalone: true,
  imports: [BreadcrumComponent, DatePipe, TopItemsComponent],
  templateUrl: './sprint.component.html',
  styleUrl: './sprint.component.scss',
})
export class SprintComponent implements OnInit {
  id = input.required<number>();
  sprint = signal<Sprint | undefined>(undefined);
  dateRange = signal<Date[]>([]);

  sprintService = inject(SprintService);
  todoService = inject(TodoService);

  get paths() {
    return [new PathItem('Sprints', '/sprints'), new PathItem('Detail', '')];
  }

  todoItems = computed(() =>
    this.todoService.todoItems().filter((item) => item.sprintId === +this.id())
  );

  get todaysItems() {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    return this.todoItems()
      .filter((item) => !item.completed && item.date && item.date <= todayDate)
      .map((item) => new PathItem(item.text + item.date?.toString(), ''));
  }

  ngOnInit() {
    const sprint = this.sprintService.getById(+this.id());
    this.sprint.set(sprint);

    const dateRange: Date[] = [];
    const date = new Date(sprint!.startDate);
    while (date <= sprint!.endDate) {
      dateRange.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    this.dateRange.set(dateRange);
  }

  toggleCompleted(id: number) {
    this.todoService.toggleCompleted(id);
  }

  updateDate(id: number, event: Event) {
    debugger;
    const value = (event.target as HTMLSelectElement).value;

    this.todoService.assignDate(id, value);
  }

  converTotString(date: Date | undefined): string | undefined {
    try {
      if (date) {
        const month = this.converToNumberString(date.getMonth() + 1);
        const day = this.converToNumberString(date.getDate());

        return month + '/' + day + '/' + date.getFullYear().toString();
      }
    } catch {}

    return undefined;
  }

  convertToLongDateString(date: Date) {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];

    return `${weekDays[date.getDay()]}, ${this.converToNumberString(
      date.getDate()
    )} ${months[date.getMonth()]}`;
  }

  converToNumberString(no: number) {
    return no > 9 ? no.toString() : '0' + no.toString();
  }
}
