import {bytesToBase64} from '../util/base64';
import {MessageParser} from '../util/messageParser';

export class UdpRelayStateChange extends  MessageParser {

	public header : number; //uint8_t header[4];
    public nodeName : string; //char nodeName[MAX_NAME_LEN];
    public relayName : string;//char relayName[MAX_NAME_LEN];
    public relayStatus : number;//uint8_t relayStatus
    constructor(nodeName : string, relayName : string, status : number) {
        super();
        this.header = MessageParser.RELAYSTATE_CHANGE;
        this.nodeName = nodeName;
        this.relayName = relayName;
        this.relayStatus = status;
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
        let buffer = new Uint8Array(40);
        buffer[3] = (this.header & 0XFF000000) >> 24;
        buffer[2] = (this.header & 0XFF0000) >> 16;
        buffer[1] = (this.header & 0XFF00) >> 8;
        buffer[0] = (this.header & 0XFF);
        let pos = 4;
        this.copy(buffer, this.nodeName, pos, 16);
        pos += 16;
        this.copy(buffer, this.relayName, pos, 16);
        pos += 16;
        buffer[pos] = this.relayStatus;
        pos++;
        buffer[pos] = 0;
        let b64 = bytesToBase64(buffer);
        return b64;
    }
}