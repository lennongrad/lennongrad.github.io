import { Component, OnInit, Input, Output, ElementRef } from '@angular/core';
import { Skill } from '../skill';
import { DragDropModule, CdkDragDrop, CdkDragStart, CdkDragMove, CdkDragRelease, moveItemInArray } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import { SoundInfo } from '../soundinfo';
import { SelectedSkillService } from '../selected-skill.service';
import { SoundEffectPlayerService } from '../sound-effect-player.service';
import * as _ from 'underscore';

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
  selectedSlots = Array<number>();
  selectedRow = 0;
  dragging = false;

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

    if (this.selectedSkill != undefined) {
      this.selectedSkillService.useSkill(this.selectedSkill);
    }

    if (!holdingCTRL) {
      this.onSelect(undefined);
    }
    this.updateSlots()

    this.soundEffectPlayer.playSound(this.trackPlacementNoise);
  }

  deleteSkills() {
    for (var index in this.selectedSlots) {
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
    
    this.soundEffectPlayer.playSound(this.trackPlacementNoise);
  }

  onDragStart(event: CdkDragStart<string[]>, rowIndex: number) {
    this.dragging = true;

    if (rowIndex != this.selectedRow) {
      this.selectedRow = rowIndex;
      this.selectedSlots = [];
    }
  }

  onDragMove(event: CdkDragMove<string[]>, rowIndex: number) {
    var originalEvent = event.event as any;

    const previewElement = document.querySelector(".cdk-drag.cdk-drag-preview") as HTMLElement;
    const rowElement = event.source.dropContainer.element.nativeElement as HTMLElement;
    if(previewElement != null){
      const iconElement = previewElement.querySelector(".icon") as HTMLElement;

      var yDistance = event.pointerPosition.y - rowElement.getBoundingClientRect().top
      var currentRowPosition = Math.floor(yDistance / this.slotHeight) + rowIndex
      currentRowPosition = Math.max(Math.min(currentRowPosition, 2), 0)
      var yGoal = rowElement.getBoundingClientRect().top + this.slotHeight * (currentRowPosition - rowIndex)

      var yOffset = yGoal - previewElement.getBoundingClientRect().top

      /*
      console.log(yDistance)
      var yOffset = -(yDistance % this.slotWidth) 
      
      if(yDistance > this.slotWidth * (2 - rowIndex)){
        yOffset = (this.slotWidth * (2 - rowIndex) - yDistance)
      } else if (yDistance < this.slotWidth * -rowIndex){
        yOffset = this.slotWidth * -rowIndex - yDistance
      }*/

      iconElement.style.top = yOffset + 3 + "px";
    }

    //console.log(draggedElement.style.top);

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

  onDragRelease(event: CdkDragRelease<string[]>){
    const previewElement = document.querySelector(".cdk-drag.cdk-drag-preview") as HTMLElement;
    if(previewElement != null){
      const iconElement = previewElement.querySelector(".icon") as HTMLElement;
      iconElement.style.top = "";
    }
  }

  onDragDrop(event: CdkDragDrop<string[]>, dropRow: number) {
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
      this.skillSlots[dropRow].splice(newIndex, 0, ...selectedItems);
    } else {
      // If a single selection


      const removedElement = this.skillSlots[this.selectedRow].splice(event.previousIndex, 1)[0];
      this.skillSlots[dropRow].splice(event.currentIndex, 0, removedElement);
      
      //moveItemInArray(this.skillSlots[dropRow], event.previousIndex, event.currentIndex);
    }

    this.soundEffectPlayer.playSound(this.trackPlacementNoise);

    this.selectedSlots = [];
    this.dragging = false;
    this.updateSlots()
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
