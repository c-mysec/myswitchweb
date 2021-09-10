import {bytesToBase64} from '../util/base64';
import {MessageParser} from '../util/messageParser';

export class UdpStatusRes {

	public header : number; //uint8_t header[4];
    public nodeName : string; //char nodeName[MAX_NAME_LEN];
    public relays : string[];//char relays[MAX_NAME_LEN * 3];
    public buttons : string[]; //char buttons[MAX_NAME_LEN * 3];
    public relayStatus : number[];//uint8_t relayStatus[4];

    constructor(obj : Uint8Array) {
        this.relays = [];
        this.buttons = [];
        this.relayStatus = [];
        this.header = obj[0];
        let pos = 4;
        this.nodeName = this.copyToString(obj, pos, 16);
        pos += 16;
        for (let i = 0; i < 3; i++) {
            this.relays[i] = this.copyToString(obj , pos, 16);
            pos += 16;
        }
        for (let i = 0; i < 3; i++) {
            this.buttons[i] = this.copyToString(obj , pos, 16);
            pos += 16;
        };
        for (let i = 0; i < 3; i++) {
            this.relayStatus[i] = obj[pos];
            pos++;
        }
    }
    copyToString(buffer:Uint8Array, pos : number, len : number) : string {
        let str = '';
        while (buffer[pos + len - 1] == 0) len--;
        for (var i = 0; i < len; ++i) {
            var code = buffer[pos + i];
            str += String.fromCharCode(code);
        }
        return str.trim();
    }
}