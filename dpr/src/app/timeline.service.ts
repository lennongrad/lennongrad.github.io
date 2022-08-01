import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'underscore';
import { Skill } from './skill';

export type SkillGrid = Array<Array<Skill | undefined>>
export interface SlotIndex { x: number, y: number };

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  currentSkillGrid = Array<Array<Skill | undefined>>(3).fill([]).map(() => new Array());
  currentGridChange = new Subject<SkillGrid>();

  currentTime = -1;
  gridTimeMax = 0;

  distributeSkillGrid(){
    this.currentGridChange.next(this.currentSkillGrid);
  }

  processTime() {
    if (this.gridTimeMax > 0) {
      if (isNaN(this.currentTime)) {
        this.currentTime = -1;
      }
      this.currentTime = (this.currentTime + 1) % this.gridTimeMax;

      for (var rowIndex in this.currentSkillGrid) {
        this.currentSkillGrid[rowIndex][this.currentTime]?.effect();
      }
    } else {
      this.currentTime = -1;
    }
  }

  insertSkill(slotIndex: number, rowIndex: number, skill: Skill | undefined): SlotIndex {
    var currentIndex = slotIndex;
    var movingSkill = skill;
    while (this.currentSkillGrid[rowIndex][currentIndex] != undefined) {
      var nextSkill = this.currentSkillGrid[rowIndex][currentIndex];
      this.currentSkillGrid[rowIndex][currentIndex] = movingSkill;
      movingSkill = nextSkill;

      currentIndex += 1;
      this.setGridMax(currentIndex);
    }
    this.currentSkillGrid[rowIndex][currentIndex] = movingSkill;
    this.setGridMax(currentIndex + 8)

    this.updateSlots()

    return {x: currentIndex, y: rowIndex};
  }

  deleteSkill(rowIndex: number, slotIndex: number) {
    this.currentSkillGrid[rowIndex][slotIndex] = undefined;
    this.updateSlots()
  }

  getGridMax(): number{
    return this.currentSkillGrid[0].length;
  }

  setGridMax(newMax: number): void {
    for (var rowIndex in this.currentSkillGrid) {
      while (this.currentSkillGrid[rowIndex].length < newMax) {
        this.currentSkillGrid[rowIndex].push(undefined);
      }
    }
    this.distributeSkillGrid();
  }

  updateSlots() {
    this.gridTimeMax = 1 + _.reduce(this.currentSkillGrid, (highest: number, arr: Array<number>) => {
      return Math.max(highest, _.max(arr.map((value, index) => value == undefined ? -1 : index)));
    }, 0)
  }

  constructor() { }
}
