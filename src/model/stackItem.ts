export class StackItem {

	public name: string;
	public nearby: boolean;
	public notified: boolean;
	public rssi: any;

	constructor(name: string){

		this.name = name;
		this.nearby = false;
		this.notified = false;
		this.rssi = "";
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