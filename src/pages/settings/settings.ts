import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private localNotifications: LocalNotifications,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  public sendNotification(): void {
    let prompt = this.alertCtrl.create({
      title: 'Local Notification',
      message: "Enter information for the local notification. The notification will show in 10s",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
        {
          name: 'text',
          placeholder: 'Notification Text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            setTimeout(() => {
              this.creatNotification(data.title, data.text);
            }, 10000); // Wait for 10 sec
          }
        }
      ]
    });
    prompt.present();
  }

  private creatNotification(title: string, text: string): void {
    this.localNotifications.schedule({
      id: 1,
      at: new Date(new Date().getTime()),
      title: title,
      text: text,
    });

    this.localNotifications.on('click', () => {
      console.log("User clicked the notification");
    });
  }
}
