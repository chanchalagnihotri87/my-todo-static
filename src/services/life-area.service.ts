import { Injectable } from '@angular/core';
import LifeArea from '../model/LifeArea';

@Injectable({ providedIn: 'root' })
export class LifeAreaService {
  lifeAreas = [
    new LifeArea(1, 'Business'),
    new LifeArea(2, 'Health'),
    new LifeArea(3, 'Family'),
    new LifeArea(4, 'Finance'),
    new LifeArea(5, 'Social'),
    new LifeArea(6, 'Creativity'),
  ];

  getById(id: number) {
    return this.lifeAreas.find((x) => x.id === id);
  }

  updatePlan(id: number, plan: string) {
    const currentIndex = this.lifeAreas.findIndex(
      (lifeArea) => lifeArea.id === id
    );

    if (currentIndex > -1) {
      this.lifeAreas[currentIndex].plan = plan;
    }
  }

  updateVision(id: number, vision: string) {
    const currentIndex = this.lifeAreas.findIndex(
      (lifeArea) => lifeArea.id === id
    );

    if (currentIndex > -1) {
      this.lifeAreas[currentIndex].vision = vision;
    }
  }
}
