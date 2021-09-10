import { Component, OnInit, NgZone } from '@angular/core';
import {UdpStatusReq} from '../model/udpStatusReq';
import {UdpRelayStateChange} from '../model/udpRelayStateChange';
import {MessageParser} from '../util/messageParser';
import {base64ToBytes} from '../util/base64';
import { UdpStatusRes } from '../model/udpStatusRes';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';

declare const Android: any;
declare global {
  interface Window { angularComponentReference: any; }
}

@Component({
  selector: 'app-relays',
  templateUrl: './relays.component.html',
  styleUrls: ['./relays.component.css']
})
export class RelaysComponent implements OnInit {
  faRedoAlt = faRedoAlt;
  relays : any[] = [];
  constructor(
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    console.log('aaaaa');
    window.angularComponentReference = window.angularComponentReference || 
      { component: this, zone: this.ngZone, broadcastReceivedBase64: (ip : string, msg : string) => this.broadcastReceivedBase64(ip, msg), };
    this.broadcastBase64();
  }
  broadcastReceivedBase64(ip : string, msg : string) { 
    let buf = base64ToBytes(msg); 
    let message = MessageParser.parse(msg);
    if (message.header == MessageParser.STATUS_RES) {
      let res = message as UdpStatusRes;
      for (let i = 0; i < res.relays.length; i++) {
        if (res.relays[i] && res.relays[i].trim().length > 0)
          this.relays[this.relayIndex(res.relays[i])] = {'name' : res.relays[i], 'status' : res.relayStatus[i]};
      }
    }
  }
  relayIndex(name : string) {
    for (let i = 0; i < this.relays.length; i++) {
      if (this.relays[i].name == name) return i;
    }
    return this.relays.length;
  }
  broadcastBase64() {
    try {
      let req = new UdpStatusReq('Android');
      Android.broadcastBase64(req.getMessage());
    } catch(e){
      // estamos no browser
      let result = (e as Error).message;
      this.testMsg();
    }
  }
  click(relay : string) {
    let status = this.relays[this.relayIndex(relay)]['status'];
    status = status == 1 ? 0 : 1;
    this.relays[this.relayIndex(relay)]['status'] = status;
    let req = new UdpRelayStateChange('Android', relay, status);
    try {
      Android.broadcastBase64(req.getMessage());
    } catch(e){
      // estamos no browser
      let result = (e as Error).message;
      console.log(result);
    }
  }
  testMsg() {
    let ip1 = '192.168.15.35';
    let msg1 = 'AQAAAGRpbm5pbmcgcm9vbQAAAABiYWxjb255AAAAAAAAAAAAbmljaGUAAAAAAAAAAAAAAGRpbm5pbmcAAAAAAAAAAABiYWxjb255AAAAAAAAAAAAZGlubmluZwAAAAAAAAAAAG5pY2hlAAAAAAAAAAAAAAAAAAAA';
    let ip2 = '192.168.15.33';
    let msg2 = 'AQAAAGxpdmluZyByb29tAAAAAABsaXZpbmcgcm9vbQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsaXZpbmcgcm9vbQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8A';
    let ip3 = '192.168.15.32';
    let msg3 = 'AQAAAGdhYmkgcm9vbQAAAAAAAABnYWJpIHJvb20AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABnYWJpIHJvb20AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8A';
    let ip4 = '192.168.15.34';
    let msg4 = 'AQAAAGtpdGNoZW4AAAAAAAAAAABraXRjaGVuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABraXRjaGVuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8A';
    let ip5 = '192.168.15.36';
    let msg5 = 'AQAAAGxpdmluZyAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABuaWNoZQAAAAAAAAAAAAAAbGl2aW5nIHJvb20AAAAAAAAAAAAAAAAAAAAAAAAAAAD///8A';

    this.broadcastReceivedBase64(ip1, msg1);
    this.broadcastReceivedBase64(ip2, msg2);
    this.broadcastReceivedBase64(ip3, msg3);
    this.broadcastReceivedBase64(ip4, msg4);
    this.broadcastReceivedBase64(ip5, msg5);
  }

}
