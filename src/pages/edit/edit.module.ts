import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditPage } from './edit';
import { ToggleComponent } from './../../components/toggle/toggle';

@NgModule({
  declarations: [
    EditPage,
    ToggleComponent
  ],
  imports: [
    IonicPageModule.forChild(EditPage),
  ],
  exports: [
    EditPage
  ]
})
export class EditPageModule {}
