import * as dgram from "dgram";
import {Dnsheader} from './models/dns_header';

let dnsHeader=new Dnsheader();
dnsHeader.packet_id=1234;
dnsHeader.query_response_indicator=true;
dnsHeader.question_count=1;


const udpSocket: dgram.Socket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1",()=>{
    console.log("Server connected on port 2053");
});

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
    try {
        console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);
        console.log(data);
        
        const response = Buffer.from(dnsHeader.encode());
        udpSocket.send(response, remoteAddr.port, remoteAddr.address);
    } catch (e) {
        console.log(`Error sending data: ${e}`);
    }
});