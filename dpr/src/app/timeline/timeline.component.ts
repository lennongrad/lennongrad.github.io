import { Component, OnInit, Input, Output, ElementRef } from '@angular/core';
import { Skill } from '../skill';
import { DragDropModule, CdkDragDrop, CdkDragStart, CdkDragMove, CdkDragRelease, moveItemInArray } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import { SoundInfo } from '../soundinfo';
import { SelectedSkillService } from '../selected-skill.service';
import { SoundEffectPlayerService } from '../sound-effect-player.service';
import * as _ from 'underscore';
import { initial } from 'underscore';

interface SlotIndex { x: number, y: number };

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.less']
})
export class TimelineComponent implements OnInit {
  selectedSkill?: Skill;
  onSelect(skill?: Skill): void {
    this.selectedSkillService.changeSelectedSkill(skill);
  }

  slotWidth = 30;
  slotHeight = 31

  skillSlots = Array<Array<Skill | undefined>>(3).fill([]).map(() => new Array());
  selectedSlots = Array<Array<boolean>>(3).fill([]).map(() => new Array());
  numberSelected = 0
  selectedRow = 0;
  dragging = false;
  initialDragIndex?: SlotIndex;
  currentDragIndex?: SlotIndex;

  currentTime = -1;
  timeLength = 0;

  hoveredTooltipSkill?: Skill;
  hoveredElement?: Element;
  hoveredOpacity = 0;

  trackPingNoise: SoundInfo = {
    audioFilename: "../assets/tracknoise.mp3",
    playbackRateMin: 3,
    playbackRateMax: 4,
    volume: .5,
    concurrentMaximum: 6,
    replacePrevious: true
  }

  trackPlacementNoise: SoundInfo = {
    audioFilename: "../assets/tracknoise.mp3",
    playbackRateMin: 2,
    playbackRateMax: 3,
    volume: 1,
    concurrentMaximum: 1,
    replacePrevious: true
  }

  processTime() {
    if (this.timeLength > 0) {
      if (isNaN(this.currentTime)) {
        this.currentTime = -1;
      }
      this.currentTime = (this.currentTime + 1) % this.timeLength;

      for (var rowIndex in this.skillSlots) {
        this.skillSlots[rowIndex][this.currentTime]?.effect();
      }
    } else {
      this.currentTime = -1;
    }
  }

  updateSlots() {
    this.timeLength = 1 + _.reduce(this.skillSlots, (highest: number, arr: Array<number>) => {
      return Math.max(highest, _.max(arr.map((value, index) => value == undefined ? -1 : index)));
    }, 0)
  }

  clickSlot(slotIndex: number, rowIndex: number, event: MouseEvent): void {
    if (this.selectedSkill != undefined) {
      this.insertSkill(slotIndex, rowIndex, this.selectedSkill);

      if (this.selectedSkill != undefined) {
        this.selectedSkillService.useSkill(this.selectedSkill);
      }

      if (!event.ctrlKey) {
        this.onSelect(undefined);
      }

      this.soundEffectPlayer.playSound(this.trackPlacementNoise);
  
      this.forEachSlot((rowIndex, slotIndex) => this.selectedSlots[rowIndex][slotIndex] = false);
      this.updateNumberSelected();
    } else {
      this.selectSlot(slotIndex, rowIndex, event.shiftKey);
    }
  }

  insertSkill(slotIndex: number, rowIndex: number, skill: Skill): void {
    var currentIndex = slotIndex;
    var movingSkill = skill;
    while (this.skillSlots[rowIndex][currentIndex] != undefined) {
      var nextSkill = this.skillSlots[rowIndex][currentIndex];
      this.skillSlots[rowIndex][currentIndex] = movingSkill;
      movingSkill = nextSkill;

      currentIndex += 1;
      this.setMaxSkillSlots(currentIndex);
    }
    this.skillSlots[rowIndex][currentIndex] = movingSkill;
    this.setMaxSkillSlots(currentIndex + 8)

    this.updateSlots()
  }

  deleteSkills() {
    this.forEachSlot((rowIndex, slotIndex) => {
      if (this.selectedSlots[rowIndex][slotIndex]) {
        this.skillSlots[rowIndex][slotIndex] = undefined;
        this.selectedSlots[rowIndex][slotIndex] = false;
      }
    })
    this.updateNumberSelected();
  }

  setMaxSkillSlots(newMax: number): void {
    for (var rowIndex in this.skillSlots) {
      while (this.skillSlots[rowIndex].length < newMax) {
        this.skillSlots[rowIndex].push(undefined);
        this.selectedSlots[rowIndex].push(false);
      }
    }
  }

  selectSlot(slotIndex: number, rowIndex: number, holdingSHIFT: boolean): void {
    if (rowIndex != this.selectedRow) {
      this.selectedRow = rowIndex;
    }

    if (this.skillSlots[rowIndex][slotIndex] != undefined) {
      if (holdingSHIFT) {
        this.selectedSlots[rowIndex][slotIndex] = !this.selectedSlots[rowIndex][slotIndex];
      } else {
        var previouslySelected = this.selectedSlots[rowIndex][slotIndex]
        this.forEachSlot((rowIndex, slotIndex) => this.selectedSlots[rowIndex][slotIndex] = false);
        this.selectedSlots[rowIndex][slotIndex] = !previouslySelected
      }
      this.soundEffectPlayer.playSound(this.trackPlacementNoise);
    } else {
      this.forEachSlot((rowIndex, slotIndex) => this.selectedSlots[rowIndex][slotIndex] = false);
    }

    this.updateNumberSelected();
  }

  isDisplaced(slotIndex: number, rowIndex: number): boolean{
    if(this.initialDragIndex == undefined || this.currentDragIndex == undefined){
      return false;
    }

    if(this.initialDragIndex.y == rowIndex && this.currentDragIndex.y == rowIndex){
      var rightOfDrag = this.initialDragIndex.x < slotIndex && slotIndex < this.currentDragIndex.x
      var leftOfDrag = this.initialDragIndex.x > slotIndex - 1 && slotIndex > this.currentDragIndex.x
      return rightOfDrag || leftOfDrag
    }

    return false;
  }

  isDisplacedRight(slotIndex: number, rowIndex: number): boolean{
    if(this.initialDragIndex == undefined || this.currentDragIndex == undefined){
      return false;
    }

    if(this.initialDragIndex.y == rowIndex && this.currentDragIndex.y != rowIndex){
      return slotIndex > this.currentDragIndex.x;
    }

    return false;
  }

  isDisplacedLeft(slotIndex: number, rowIndex: number): boolean{
    if(this.initialDragIndex == undefined || this.currentDragIndex == undefined){
      return false;
    }

    if(this.initialDragIndex.y != rowIndex && this.currentDragIndex.y == rowIndex){
      return slotIndex > this.currentDragIndex.x;
    }

    return false;
  }

  forEachSlot(callback: (rowIndex: number, slotIndex: number) => void): void {
    _.forEach(this.skillSlots, (row, rowIndex) => {
      _.forEach(row, (_skill, slotIndex) => {
        callback(rowIndex, slotIndex);
      })
    })
  }

  updateNumberSelected(): void {
    this.numberSelected = 0
    this.forEachSlot((rowIndex, slotIndex) => {
      if (this.selectedSlots[rowIndex][slotIndex]) {
        this.numberSelected += 1;
      }
    })
  }

  onDragStart(event: CdkDragStart<string[]>, slotIndex: number, rowIndex: number) {
    this.dragging = true;
    this.initialDragIndex = {x: slotIndex, y: rowIndex};

    if (rowIndex != this.selectedRow) {
      this.selectedRow = rowIndex;
    }
  }

  onDragMove(event: CdkDragMove<string[]>, rowIndex: number) {
    var originalEvent = event.event as any;
    const rowElement = event.source.dropContainer.element.nativeElement as HTMLElement;
    var xDistance = event.pointerPosition.x - rowElement.getBoundingClientRect().left
    var yDistance = event.pointerPosition.y - rowElement.getBoundingClientRect().top

    this.currentDragIndex = {x: Math.max(Math.floor(xDistance / this.slotWidth), 0),
       y: Math.max(Math.min(Math.floor(yDistance / this.slotHeight) + rowIndex, 2), 0)};

    const previewElement = document.querySelector(".cdk-drag.cdk-drag-preview") as HTMLElement;
    if (previewElement != null) {
      const iconElement = previewElement.querySelector(".icon") as HTMLElement;

      var yGoal = rowElement.getBoundingClientRect().top + this.slotHeight * (this.currentDragIndex.y - rowIndex)

      var yOffset = yGoal - previewElement.getBoundingClientRect().top
      iconElement.style.top = yOffset + 3 + "px";
    }

    if (event.delta.x > 0) {
      for (var i = event.pointerPosition.x - originalEvent.movementX; i < event.pointerPosition.x; i++) {
        if (i % this.slotWidth == 0) {
          this.soundEffectPlayer.playSound(this.trackPingNoise);
          return;
        }
      }
    } else {
      for (var i = event.pointerPosition.x - originalEvent.movementX; i > event.pointerPosition.x; i--) {
        if (i % this.slotWidth == 0) {
          this.soundEffectPlayer.playSound(this.trackPingNoise);
          return;
        }
      }
    }
  }

  onDragRelease(event: CdkDragRelease<string[]>) {
    const previewElement = document.querySelector(".cdk-drag.cdk-drag-preview") as HTMLElement;
    if (previewElement != null) {
      const iconElement = previewElement.querySelector(".icon") as HTMLElement;
      iconElement.style.top = "";
    }
  }

  onDragDrop(event: CdkDragDrop<string[]>, dropRow: number) {
    if (this.numberSelected > 1) {
      // If multiple selections exist
      let newIndex = event.currentIndex;
      let indexCounted = false;

      const selectedSlotIndices = Array<SlotIndex>();
      const selectedItems = Array<Skill>();
      this.forEachSlot((rowIndex, slotIndex) => {
        if (this.selectedSlots[rowIndex][slotIndex]) {
          selectedSlotIndices.push({ x: slotIndex, y: rowIndex })
          selectedItems.push(this.skillSlots[rowIndex][slotIndex])

          if (rowIndex == dropRow && slotIndex < event.currentIndex) {
            newIndex--;
            indexCounted = true;
          }
        }
      })

      // correct the index
      if (indexCounted) {
        newIndex++;
      }

      for (var i = selectedSlotIndices.length - 1; i >= 0; i--) {
        this.skillSlots[selectedSlotIndices[i].y][selectedSlotIndices[i].x] = undefined;
        this.insertSkill(newIndex, dropRow, selectedItems[i]);
      }

      // add selected items at new index
      //this.skillSlots[dropRow].splice(newIndex, 0, ...selectedItems);
    } else {
      // If a single selection
      //const removedSkill = this.skillSlots[this.selectedRow].splice(event.previousIndex, 1)[0];
      const removedSkill =  this.skillSlots[this.selectedRow][event.previousIndex]
      this.skillSlots[this.selectedRow][event.previousIndex] = undefined;

      this.insertSkill(event.currentIndex, dropRow, removedSkill);
      //this.skillSlots[dropRow].splice(event.currentIndex, 0, removedElement);

      //moveItemInArray(this.skillSlots[dropRow], event.previousIndex, event.currentIndex);
    }

    this.soundEffectPlayer.playSound(this.trackPlacementNoise);
    this.initialDragIndex = undefined;

    this.forEachSlot((rowIndex, slotIndex) => this.selectedSlots[rowIndex][slotIndex] = false);
    this.dragging = false;
    this.updateSlots()
    this.updateNumberSelected();
  }

  mouseoverSlot(event: any, hoveredSkill: Skill) {
    this.hoveredTooltipSkill = hoveredSkill;
    this.hoveredElement = event.toElement;
    this.hoveredOpacity = .9;
  }

  mouseoutSlot(event: any, hoveredSkill: Skill) {
    this.hoveredOpacity = 0;
  }

  constructor(private selectedSkillService: SelectedSkillService,
    private soundEffectPlayer: SoundEffectPlayerService) {
    this.selectedSkillService.selectedSkillChange.subscribe(value => this.selectedSkill = value);
  }


  ngOnInit(): void {
    this.setMaxSkillSlots(80);
  }
}
