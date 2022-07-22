import { Component, OnInit, Input  } from '@angular/core';
import { Skill } from '../skill';

@Component({
  selector: 'app-skill-tooltip',
  templateUrl: './skill-tooltip.component.html',
  styleUrls: ['./skill-tooltip.component.less']
})
export class SkillTooltipComponent implements OnInit {
  @Input() hoveredSkill?: Skill;
  @Input() top = 0;
  @Input() left = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
