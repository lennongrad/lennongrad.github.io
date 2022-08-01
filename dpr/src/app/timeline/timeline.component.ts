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

  initialDragIndex?: SlotIndex;
  currentDragIndex?: SlotIndex;
  dragDisplacement?: SlotIndex;

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

  getTransformation(slotIndex: number, rowIndex: number): any {
    if (!this.selectedSlots[rowIndex][slotIndex] || this.dragDisplacement == undefined) {
      return {};
    }

    var translateX = "translateX(" + (this.dragDisplacement.x * this.slotWidth) + "px)"
    var translateY = "translateY(" + (this.dragDisplacement.y * this.slotHeight) + "px)"

    return { "transform": translateX + " " + translateY };
  }

  onDragStart(slotIndex: number, rowIndex: number, event: any): void {
    event.dataTransfer.setDragImage(new Image(), 0, 0);
    this.initialDragIndex = { x: slotIndex, y: rowIndex };

    this.selectedSlots[rowIndex][slotIndex] = true;
  }

  onDragOver(slotIndex: number, rowIndex: number, event: any): void {
    if (this.initialDragIndex == undefined) {
      return;
    }

    var lastDisplacement = this.dragDisplacement
    this.currentDragIndex = { x: slotIndex, y: rowIndex };
    this.dragDisplacement = {
      x: this.currentDragIndex.x - this.initialDragIndex.x,
      y: this.currentDragIndex.y - this.initialDragIndex.y
    }

    if (lastDisplacement != undefined && (lastDisplacement.x != this.dragDisplacement.x || lastDisplacement.y != this.dragDisplacement.y)) {
      this.soundEffectPlayer.playSound(this.trackPingNoise);
    }

    event.preventDefault();
  }

  onDragEnd(event: any): void {
    if (this.initialDragIndex != undefined && this.currentDragIndex != undefined && this.dragDisplacement) {
      const selectedSlotIndices = Array<SlotIndex>();
      const selectedItems = Array<Skill>();
      this.forEachSlot((rowIndex, slotIndex) => {
        if (this.selectedSlots[rowIndex][slotIndex]) {
          selectedSlotIndices.push({ x: slotIndex, y: rowIndex });
          selectedItems.push(this.skillSlots[rowIndex][slotIndex]);
          this.skillSlots[rowIndex][slotIndex] = undefined;
        }
      })

      for (var i = selectedSlotIndices.length - 1; i >= 0; i--) {
        var displacedIndex = {
          x: Math.max(0, Math.min(this.skillSlots[0].length, selectedSlotIndices[i].x + this.dragDisplacement.x)),
          y: Math.max(0, Math.min(2, selectedSlotIndices[i].y + this.dragDisplacement.y))
        }

        this.insertSkill(displacedIndex.x, displacedIndex.y, selectedItems[i]);
      }

      this.soundEffectPlayer.playSound(this.trackPlacementNoise);

      this.updateSlots()
    }

    this.initialDragIndex = undefined;
    this.currentDragIndex = undefined;
    this.dragDisplacement = undefined;

    this.forEachSlot((rowIndex, slotIndex) => this.selectedSlots[rowIndex][slotIndex] = false);
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
