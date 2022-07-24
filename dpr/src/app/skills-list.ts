import { Skill } from './skill';

export const SKILLS: Skill[] = [
  {
    icon: 'skill_alt_154.png', name: 'Melee',
    description: () => {
      return "Deal 3 damage to each enemy."
    },
    flavour: 'A swift flurry of blows.',
    effect: () => {
      console.log("h")
    },
  },
  {
    icon: 'skill_36.png', name: 'Ranged',
    description: () => {
      return "Deal 3 damage to target enemy that may be chosen by the user at their leisure and whom feels pain in their chest."
    },
    flavour: 'A volley of arrows are launched from an unyielding bow by an evermore unyielding archer, who vows to see their foes\' demise.',
    effect: () => {
      console.log("h")
    },
  }
];