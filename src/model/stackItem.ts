export class StackItem {

	public name: string;
	public nearby: boolean;

	constructor(name: string){

		this.name = name;
		this.nearby = false;
	}
}

export class ChecklistItem extends StackItem {

	constructor(name: string){
		super(name);
	}
}

export class TrackerItem extends StackItem {

	public id: string;

	constructor(name: string){
		super(name);
		this.id = "12fr3";
	}
}