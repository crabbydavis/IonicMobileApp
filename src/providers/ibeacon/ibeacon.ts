import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { IBeacon, BeaconRegion } from '@ionic-native/ibeacon';
import { Platform } from 'ionic-angular/platform/platform';
import { NativeStorage } from '@ionic-native/native-storage';


/*
  Generated class for the IbeaconProvider provider.
*/

interface Beacon{
  region: BeaconRegion;
	nearby: boolean;
	notified: boolean;
}

@Injectable()
export class IbeaconProvider {

  public beacons: Beacon [];

  constructor(private platform: Platform, private nativeStorage: NativeStorage, private iBeacon: IBeacon) {
    platform.ready().then(() => {
      this.nativeStorage.getItem('beacons').then(res => {
        // If we've already initialized the beacons we don't need to do anything
        this.beacons = res;
      }).catch(err => {
        // Beacons haven't been initialized
        this.initBeacons();    
      });
    });
  }

  private setupMonitoring(){
    let delegate = this.iBeacon.Delegate();

      // Subscribe to some of the delegate's event handlers
      delegate.didRangeBeaconsInRegion()
      .subscribe(
        //data => console.log('didRangeBeaconsInRegion: ', data),
        error => console.error()
      );
      delegate.didStartMonitoringForRegion()
      .subscribe(
        //data => console.log('didStartMonitoringForRegion: ', data),
        error => console.error()
      );
      delegate.didEnterRegion().subscribe(data => {
          console.log("");
          console.log("********** Entered Region: " + data.region.identifier + "**********");
          console.log("");
          let index: number = parseInt(data.region.identifier) - 1;
          this.beacons[index].nearby = true;
          //this.cdr.detectChanges();
        }, error => console.log('Error in didEnterRegion()'));
      delegate.didExitRegion().subscribe(data => {
        console.log("");
        console.log('########### didExitRegion: ', data.region.identifier + "############");
        console.log("");
        let index: number = parseInt(data.region.identifier) - 1;
        //console.log("Index of region is " + index);
        this.beacons[index].nearby = false;
        console.log("Index of region is " + this.beacons[index]);
        //this.cdr.detectChanges();
      }, error => console.log('Error in didExitRegion()'));
  }

  public initBeacons(){
    this.iBeacon.requestAlwaysAuthorization().then(() => {

      this.setupMonitoring();

      this.beacons.push({region: this.iBeacon.BeaconRegion('0','B9407F30-F5F8-466E-AFF9-25556B57FE6D', 8725, 0), nearby: false, notified: true});
      this.beacons.push({region: this.iBeacon.BeaconRegion('1','B9407F30-F5F8-466E-AFF9-25556B57FE6D', 8725, 1), nearby: false, notified: true});
      this.beacons.push({region: this.iBeacon.BeaconRegion('2','B9407F30-F5F8-466E-AFF9-25556B57FE6D', 8725, 2), nearby: false, notified: true});
      this.beacons.push({region: this.iBeacon.BeaconRegion('3','B9407F30-F5F8-466E-AFF9-25556B57FE6D', 8725, 3), nearby: false, notified: true});
      this.beacons.push({region: this.iBeacon.BeaconRegion('4','B9407F30-F5F8-466E-AFF9-25556B57FE6D', 8725, 4), nearby: false, notified: true});
      this.beacons.push({region: this.iBeacon.BeaconRegion('5','B9407F30-F5F8-466E-AFF9-25556B57FE6D', 8725, 5), nearby: false, notified: true});
      this.beacons.push({region: this.iBeacon.BeaconRegion('6','B9407F30-F5F8-466E-AFF9-25556B57FE6D', 8725, 6), nearby: false, notified: true});
      this.beacons.push({region: this.iBeacon.BeaconRegion('7','B9407F30-F5F8-466E-AFF9-25556B57FE6D', 8725, 7), nearby: false, notified: true});
      this.beacons.push({region: this.iBeacon.BeaconRegion('8','B9407F30-F5F8-466E-AFF9-25556B57FE6D', 8725, 8), nearby: false, notified: true});
      this.beacons.push({region: this.iBeacon.BeaconRegion('9','B9407F30-F5F8-466E-AFF9-25556B57FE6D', 8725, 9), nearby: false, notified: true});
      this.beacons.push({region: this.iBeacon.BeaconRegion('10','B9407F30-F5F8-466E-AFF9-25556B57FE6D', 8725, 10), nearby: false, notified: true});

      this.beacons.forEach(beacon => {
        this.iBeacon.startMonitoringForRegion(beacon.region).then(res => {
          console.log("Res for monitoring Beacon Region" + beacon.region.identifier + ": ", res)
        }).catch(error => console.error('Native layer failed to begin monitoring: ', error));
      });

      this.nativeStorage.setItem('beacons', this.beacons);
    });
  }
}
