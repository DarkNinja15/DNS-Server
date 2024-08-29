import * as dgram from "dgram";
import {decodeHeader, Dnsheader} from './models/dns_header';
import { Dnsquestion, writeQuestions } from "./models/dns_question";
import {Dnsanswer, writeAnswers} from "./models/dns_answer";


const udpSocket: dgram.Socket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1",()=>{
    console.log("Server connected on port 2053");
});

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
    try {
        console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);
        console.log(data);
        console.log(decodeHeader(data));
        
        const response=Buffer.from('');

        udpSocket.send(response, remoteAddr.port, remoteAddr.address);
    } catch (e) {
        console.log(`Error sending data: ${e}`);
    }
});