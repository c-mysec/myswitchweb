import {bytesToBase64} from '../util/base64';
import {base64ToBytes} from '../util/base64';
import {UdpMessage} from '../model/udpMessage';
import {UdpStatusReq} from '../model/udpStatusReq';
import { UdpStatusRes } from '../model/udpStatusRes';
// header[0]:	0 - status request
//				1 - status reply
//				2 - button change
export class MessageParser {
    public static STATUS_REQ: number = 0;
    public static STATUS_RES: number = 1;
    public static RELAYSTATE_TOGGLE: number = 2;
    public static RELAYSTATE_CHANGE: number = 3;

    public static parse(msg : string) : UdpMessage {
        let buf = base64ToBytes(msg); 
        let header = (buf[3] << 24) + (buf[2] << 16) + (buf[1] << 8) + buf[0];
        if (header == this.STATUS_RES) {
            return new UdpStatusRes(buf);
        }
        return new UdpStatusRes(buf);
    }
}