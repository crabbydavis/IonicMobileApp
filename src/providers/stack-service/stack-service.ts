/*
	This service is to manage the stacks throughout the app
  This is where the interaction with the db will be.
*/

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Auth, User } from '@ionic/cloud-angular';

import { Storage } from '@ionic/storage';

// Import Model
import { Stack } from '../../model/stack';


@Injectable()
export class StackService {

	public currentStack: Stack = new Stack("None");; // Used for managing the stack on the Current screen
	public stacks: Array<Stack>; // Used to keep track of the stacks throughout the app

  // Injecting the auth and user so their account can be updated in the database
  constructor(public auth: Auth, public user: User, private storage: Storage) {
    console.log('Created StackService Provider');
    this.initStackService();
  }

  private initStackService(): void {
    // Get the stacks from the db if there are any
    this.storage.get('stacks').then((dbStacks) => {
      if(dbStacks == null){
        this.stacks = [];
      } else {
        console.log("Got stacks from db");
        this.stacks = dbStacks;
      }
    }).catch(error => {
      console.log("Couldn't get stacks from the db", error);
    });
    // Get the current stack from the db
    this.storage.get('currentStack').then((dbCurrentStack) => {
      if(dbCurrentStack == null){ // If there is no current stack then make a blank one
        this.currentStack =  new Stack("None");
        console.log("Current stack is null");
      } else {
      this.currentStack = dbCurrentStack;
      }
    }).catch(error => {
      console.log("Couldn't get current stack", error);
    });
  }

  // This will add a stack locally as well as to the users account
  addStack(stack: Stack) {
    // If this stack is the first stack then set it as the current stack
    if(this.stacks.length == 0){
      this.storage.set('currentStack', stack);
      this.currentStack = stack;
    }
  	this.stacks.push(stack);

    this.storage.set('stacks', this.stacks); // save stacks to the db
  	//this.user.set('stacks', this.stacks);
  	//this.user.save();
  }

  // This is remove the stack locally as well as from the users account
  removeStack(stack: Stack) {
  	var newStacks = [];

    for (var i in this.stacks) {
      console.log(this.stacks[i].name);
      console.log(stack.name);
      if(this.stacks[i].name != stack.name){
        console.log("trying to add " + this.stacks[i].name);
        newStacks.push(this.stacks[i]);
      }
    }
    // If there is only one stack, then set it as the current stack
    if(this.stacks.length == 1){
      this.storage.set('currentStack', this.stacks[0]);
      this.currentStack = this.stacks[0];
    }

    this.stacks = newStacks;
    this.storage.set('stacks', newStacks); // Save new stacks to the db
    //this.user.set('stacks', newStacks);
    //this.user.save();
  }

  // This will update the stack in the stacks array as well as on the users account
  updateStack(stack: Stack) {

  	for (var i in this.stacks) {
  		if(this.stacks[i].name === stack.name) {
  			this.stacks[i] = stack;
  			break;
  		}
  	}
    this.storage.set('stacks', this.stacks); // save the stacks to the db

    if(this.isCurrent(stack)){
      this.makeCurrent(stack);
    }
  	//this.user.set('stacks', this.stacks);
  	//this.user.save();
  }

  public makeCurrent(stack: Stack): void {
    this.storage.set('currentStack', stack);
    this.currentStack = stack;
  }

  // Check if the stack is the current stack to highlight it
  public isCurrent(other: Stack): boolean {
    //console.log(other);
    //console.log(this.currentStack);
    if(this.currentStack.name !== other.name){
			return false;
    }
    //if(!this.itemsAreEqual(other, this.currentStack)){
      //return false;
    //}
		return true;
  }

  // This should primarily be used for seeing if a stack equals the current stack
  private itemsAreEqual(first:Stack, second:Stack): boolean{
    for(var i = 0; i < first.items.length; i++){
      if(first.items[i].name !== second.items[i].name){
			  return false;
      }
      /*if(first.items[i].id !== second.items[i].id){
        return false;
      }*/
    }
    return true;
  }

}
