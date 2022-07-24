import { Component, OnInit, Input, Output } from '@angular/core';
import { Skill } from '../skill';
import { DragDropModule, CdkDragDrop, CdkDragStart, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import * as _ from 'underscore';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.less']
})
export class TimelineComponent implements OnInit {
  @Input() selectedSkill?: Skill;
  @Output() selectedSkillChange = new EventEmitter<Skill>();
  onSelect(skill?: Skill): void {
    if (skill == this.selectedSkill) {
      this.selectedSkill = undefined;
    } else {
      this.selectedSkill = skill;
    }
    this.selectedSkillChange.emit(this.selectedSkill);
  }

  trackNoise = new Audio("../../assets/tracknoise.mp3");

  slotWidth = 30;

  skillSlots = Array<Array<Skill | undefined>>(3).fill([]).map(() => new Array());
  selectedSlots = Array<number>();
  selectedRow = 0;
  dragging = false;

  currentTime = -1;
  timeLength = 0;

  hoveredTooltipSkill ?: Skill;
  hoveredElement ?: Element;
  hoveredOpacity = 0;

  processTime(){
    if(this.timeLength > 0){
      if(isNaN(this.currentTime)){
        this.currentTime = -1;
      }
      this.currentTime = (this.currentTime + 1) % this.timeLength;

      for(var rowIndex in this.skillSlots){
        this.skillSlots[rowIndex][this.currentTime]?.effect();
      }
    } else {
      this.currentTime = -1;
    }
  }

  updateSlots(){
    this.timeLength = 1 + _.reduce(this.skillSlots, (highest: number, arr: Array<number>) => {
      return Math.max(highest, _.max(arr.map((value, index) => value == undefined ? -1 : index)));
    }, 0)
  }

  clickSlot(slotIndex: number, rowIndex: number, event: MouseEvent): void {
    if (this.selectedSkill != undefined) {
      this.insertSkill(slotIndex, rowIndex, event.ctrlKey);
    } else {
      this.selectSlot(slotIndex, rowIndex, event.shiftKey);
    }
  }

  insertSkill(slotIndex: number, rowIndex: number, holdingCTRL: boolean): void {
    var currentIndex = slotIndex;
    var movingSkill = this.selectedSkill;
    while (this.skillSlots[rowIndex][currentIndex] != undefined) {
      var nextSkill = this.skillSlots[rowIndex][currentIndex];
      this.skillSlots[rowIndex][currentIndex] = movingSkill;
      movingSkill = nextSkill;

      currentIndex += 1;
      this.setMaxSkillSlots(currentIndex);
    }
    this.skillSlots[rowIndex][currentIndex] = movingSkill;
    this.setMaxSkillSlots(currentIndex + 8)

    if (!holdingCTRL) {
      this.onSelect(undefined);
    }
    this.updateSlots()
  }

  deleteSkills(){
    for(var index in this.selectedSlots){
      this.skillSlots[this.selectedRow][this.selectedSlots[index]] = undefined;
    }
  }

  setMaxSkillSlots(newMax: number): void {
    for (var rowIndex in this.skillSlots) {
      while (this.skillSlots[rowIndex].length < newMax) {
        this.skillSlots[rowIndex].push(undefined);
      }
    }
  }

  selectSlot(slotIndex: number, rowIndex: number, holdingSHIFT: boolean): void {
    if (rowIndex != this.selectedRow) {
      this.selectedRow = rowIndex;
      this.selectedSlots = [];
    }

    if (holdingSHIFT) {
      if (_.contains(this.selectedSlots, slotIndex)) {
        this.selectedSlots = _.without(this.selectedSlots, slotIndex);
      } else {
        this.selectedSlots.push(slotIndex);
      }
    } else {
      if (_.contains(this.selectedSlots, slotIndex)) {
        this.selectedSlots = [];
      } else {
        this.selectedSlots = [slotIndex];
      }
    }
  }

  onDragStart(event: CdkDragStart<string[]>, rowIndex: number) {
    this.dragging = true;

    if (rowIndex != this.selectedRow) {
      this.selectedRow = rowIndex;
      this.selectedSlots = [];
    }
  }

  dragMove(event: CdkDragMove<string[]>){
    if(event.delta.x > 0){
      for(var i = event.distance.x - event.delta.x; i < event.distance.x; i++){
        if(i % this.slotWidth == 0){
          this.playTrackNoise(3, .5);
        }
      }
    } else{
      for(var i = event.distance.x - event.delta.x; i > event.distance.x; i--){
        if(i % this.slotWidth == 0){
          this.playTrackNoise(3, .5);
        }
      }
    }
  }

  playTrackNoise(playbackRate: number, volume: number){
    // ts wont let me do preservesPitch unless i cast it as any
    var trackNoise =  new Audio("../../assets/tracknoise.mp3") as any;
    trackNoise.playbackRate = playbackRate;
    trackNoise.volume = volume;
    if ('preservesPitch' in trackNoise) {
      trackNoise.preservesPitch = false;
    }
    else if ('mozPreservesPitch' in trackNoise) { //deprecated
      trackNoise.mozPreservesPitch = false;
    }
    trackNoise.play();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.selectedSlots.length > 1) {
      // If multiple selections exist
      let newIndex = event.currentIndex;
      let indexCounted = false;

      // create an array of the selected items
      // set newCurrentIndex to currentIndex - (any items before that index)
      this.selectedSlots = _.sortBy(this.selectedSlots, s => s);
      const selectedItems = _.map(this.selectedSlots, s => {
        if (s < event.currentIndex) {
          newIndex--;
          indexCounted = true;
        }
        return this.skillSlots[this.selectedRow][s];
      });

      // correct the index
      if (indexCounted) {
        newIndex++;
      }

      for (var i = this.selectedSlots.length - 1; i >= 0; i--) {
        this.skillSlots[this.selectedRow].splice(this.selectedSlots[i], 1);
      }

      // add selected items at new index
      this.skillSlots[this.selectedRow].splice(newIndex, 0, ...selectedItems);
    } else {
      // If a single selection
      moveItemInArray(this.skillSlots[this.selectedRow], event.previousIndex, event.currentIndex);
    }

    this.playTrackNoise(2, 1);

    this.selectedSlots = [];
    this.dragging = false;
    this.updateSlots()
  }

  mouseoverSlot(event: any, hoveredSkill: Skill){
    this.hoveredTooltipSkill = hoveredSkill;
    this.hoveredElement = event.toElement;
    this.hoveredOpacity = .9;
  }

  mouseoutSlot(event: any, hoveredSkill: Skill){
    this.hoveredOpacity = 0;
  }

  constructor() { }
  ngOnInit(): void {
    this.setMaxSkillSlots(50);
  }
}
