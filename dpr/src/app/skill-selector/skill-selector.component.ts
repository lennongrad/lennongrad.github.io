import { Component, Input, OnInit, Output } from '@angular/core';
import { Skill } from '../skill';
import { SKILLS } from '../skills-list';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-skill-selector',
  templateUrl: './skill-selector.component.html',
  styleUrls: ['./skill-selector.component.less']
})
export class SkillSelectorComponent implements OnInit {
  skills = SKILLS;
  
  @Input() selectedSkill?: Skill;
  @Output() selectedSkillChange = new EventEmitter<Skill>();
  onSelect(skill: Skill): void{
    if(skill == this.selectedSkill){
      this.selectedSkill = undefined;
    } else {
      this.selectedSkill = skill;
    }
    this.selectedSkillChange.emit(this.selectedSkill);
  }

  hoveredTooltipSkill ?: Skill;
  hoveredElement ?: Element;
  hoveredOpacity = 0;

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
  }

}
