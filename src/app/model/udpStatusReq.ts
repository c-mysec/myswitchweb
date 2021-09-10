import {bytesToBase64} from '../util/base64';
import {MessageParser} from '../util/messageParser';

export class UdpStatusReq extends  MessageParser {

	public header : number; //uint8_t header[4];
    public nodeName : string; //char nodeName[MAX_NAME_LEN];
    public relays : string[];//char relays[MAX_NAME_LEN * 3];
    public buttons : string[]; //char buttons[MAX_NAME_LEN * 3];
    public relayStatus : number[];//uint8_t relayStatus[4];

    constructor(obj : string) {
        super();
        this.relays = [];
        this.buttons = [];
        this.relayStatus = [];
        this.header = MessageParser.STATUS_REQ;
        this.nodeName = obj;
    }
    addButton(name : string) {
        this.buttons.push(name);
    }
    addRelay(name : string, status : number) {
        this.relays.push(name);
        this.relayStatus.push(status);
    }
    copyToString(buffer:Uint8Array, pos : number, len : number) : string {
        let str = '';
        for (var i = 0; i < len; ++i) {
            var code = buffer[pos + i];
            str += String.fromCharCode(code);
        }
        return str;
    }
    copy(buffer:Uint8Array, str : string, pos : number, len : number) {
        for (var i = 0; i < len; ++i) {
            var code = str.length > i ? str.charCodeAt(i) : 0;
            buffer[pos + i] = code;
        }
    }
    zeroFill(buffer:Uint8Array, pos : number, len : number) {
        for (var i = 0; i < len; ++i) {
            buffer[pos + i] = 0;
        }
    }
    getMessage() : string {
        let buffer = new Uint8Array(120);
        buffer[3] = (this.header & 0XFF000000) >> 24;
        buffer[2] = (this.header & 0XFF0000) >> 16;
        buffer[1] = (this.header & 0XFF00) >> 8;
        buffer[0] = (this.header & 0XFF);
        let pos = 4;
        this.copy(buffer, this.nodeName, pos, 16);
        pos += 16;
        for (let i = 0; i < 3; i++) {
            if (this.relays.length > i) this.copy(buffer, this.relays[i], pos, 16);
            else this.zeroFill(buffer, pos, 16);
            pos += 16;
        }
        for (let i = 0; i < 3; i++) {
            if (this.buttons.length > i) this.copy(buffer, this.buttons[i], pos, 16);
            else this.zeroFill(buffer, pos, 16);
            pos += 16;
        };
        for (let i = 0; i < 3; i++) {
            if (this.relayStatus.length > i) buffer[pos] = this.relayStatus[i];
            else buffer[pos] = 0;
            pos++;
        }
        buffer[pos] = 0;
        let b64 = bytesToBase64(buffer);
        return b64;
    }
}