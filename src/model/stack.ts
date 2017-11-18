import { StackItem, TrackerItem, ChecklistItem } from './stackItem';

export class Stack {
	
	public name: string;
	public items: Array<StackItem>;
	public isCurrent: boolean;
	public showItems: boolean;
	public currentState: string;
	public checklistItems: Array<ChecklistItem>;
	public trackerItems: Array<TrackerItem>; 	

	constructor(name: string){

		this.name = name;
		this.items = new Array<StackItem>();
		this.isCurrent = false;
		this.showItems = false;
		this.currentState = 'inactive';
		this.checklistItems = new Array<ChecklistItem>();
		this.trackerItems = new Array<TrackerItem>();
	}
}