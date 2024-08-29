import * as dgram from "dgram";
import {decodeHeader, Dnsheader} from './models/dns_header';
import { decodeQuestion, Dnsquestion, writeQuestions } from "./models/dns_question";
import {Dnsanswer, writeAnswers} from "./models/dns_answer";


const udpSocket: dgram.Socket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1",()=>{
    console.log("Server connected on port 2053");
});

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
    try {
        console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);
        console.log(data);

        const headBuff = data.subarray(0,12);
        
        console.log(decodeHeader(headBuff));

        const questionBuff= data.subarray(12,data.length);
        console.log(decodeQuestion(questionBuff));

        
        const response=Buffer.from('');

        udpSocket.send(response, remoteAddr.port, remoteAddr.address);
    } catch (e) {
        console.log(`Error sending data: ${e}`);
    }
});