import { StackItem } from './stackItem';

export class Stack {
	
	public name: string;
	public items: Array<StackItem>;  	

	constructor(name: string){

		this.name = name;
		this.items = [];
	}
}