import * as dgram from 'dgram';
import { Dnsquestion, encode } from './models/dns_question';

const dnsClient = dgram.createSocket('udp4');

let question:Dnsquestion = {
    name:"google.com",
    class:1,
    type:1
};

const q_byte_array=encode(question);

const dnsQueryPacket = new Uint8Array(12+q_byte_array.length);
// Set the Packet Identifier (ID) to 1234 (0x04D2)
dnsQueryPacket[0] = 0x04; // High byte
dnsQueryPacket[1] = 0xD2; // Low byte

// Set the QR bit to 0 (query), OPCODE to 0, AA to 0, TC to 0, RD to 0
dnsQueryPacket[2] = 0x00;

// Set RA to 0, Z to 0, RCODE to 0
dnsQueryPacket[3] = 0x00;

// Set QDCOUNT, ANCOUNT, NSCOUNT, ARCOUNT to 0
dnsQueryPacket[4] = 0x00; dnsQueryPacket[5] = 0x01;
dnsQueryPacket[6] = 0x00; dnsQueryPacket[7] = 0x00;
dnsQueryPacket[8] = 0x00; dnsQueryPacket[9] = 0x00;
dnsQueryPacket[10] = 0x00; dnsQueryPacket[11] = 0x00;

for(let i=0;i<q_byte_array.length;i++){
    dnsQueryPacket[i+12]=q_byte_array[i];
}

console.log("dnsQueryPacket",dnsQueryPacket);

// Send the query packet to the server
dnsClient.send(dnsQueryPacket, 2053, '127.0.0.1', (err) => {
    if (err) {
        console.error('Error sending query:', err);
        dnsClient.close();
        return;
    }
    console.log('Query sent to server');

    // Listen for the response
    dnsClient.on('message', (msg) => {
        console.log('Received response:', msg);
        dnsClient.close();
    });
});
