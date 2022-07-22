export interface Skill {
    icon: string;
    name: string;
    flavour: string;
    effect: () => void;
    description: () => string;
}