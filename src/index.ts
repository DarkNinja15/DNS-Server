import * as dgram from "dgram";
import {Dnsheader} from './models/dns_header';
import { Dnsquestion, writeQuestions } from "./models/dns_question";
import {Dnsanswer, writeAnswers} from "./models/dns_answer";

let dnsHeader=new Dnsheader();
dnsHeader.packet_id=1234;
dnsHeader.query_response_indicator=true;
dnsHeader.question_count=1;
dnsHeader.answer_record_count=1;


const udpSocket: dgram.Socket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1",()=>{
    console.log("Server connected on port 2053");
});

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
    try {
        console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);
        console.log(data);
        const questions:Dnsquestion[]=[{class:1,name:"google.com",type:1}];
        const answers:Dnsanswer[]=[{type: 1,class: 1,ttl: 60,data: '\x08\x08\x08\x08',name: 'google.com'}];


        const response = Buffer.concat([Buffer.from(dnsHeader.encode()),writeQuestions(questions),writeAnswers(answers)]);


        udpSocket.send(response, remoteAddr.port, remoteAddr.address);
    } catch (e) {
        console.log(`Error sending data: ${e}`);
    }
});