import { Component, OnInit } from '@angular/core';
import { Skill } from '../skill';

@Component({
  selector: 'app-timeline-builder',
  templateUrl: './timeline-builder.component.html',
  styleUrls: ['./timeline-builder.component.less']
})
export class TimelineBuilderComponent implements OnInit {
  currentSkill?: Skill; 

  constructor() { }

  ngOnInit(): void {
  }

}
