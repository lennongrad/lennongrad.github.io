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

  constructor() { }

  ngOnInit(): void {
  }

}
