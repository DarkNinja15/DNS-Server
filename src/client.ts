import dgram from 'dgram';
import { Dnsheader } from './models/dns_header';
import { Dnsquestion } from './models/dns_question';



function createDnsPacket(header: Dnsheader, question: Dnsquestion): Buffer {
    const headerBuffer = Buffer.alloc(12); 

    // Encode the header values into the buffer
    headerBuffer.writeUInt16BE(header.packet_id, 0);
    let flags = 0;
    flags |= (header.query_response_indicator ? 1 : 0) << 15;
    flags |= header.opcode << 11;
    flags |= (header.authoritative_answer ? 1 : 0) << 10;
    flags |= (header.truncation ? 1 : 0) << 9;
    flags |= (header.recursion_desired ? 1 : 0) << 8;
    flags |= (header.recursion_available ? 1 : 0) << 7;
    flags |= header.reserved;
    flags |= header.response_code;
    headerBuffer.writeUInt16BE(flags, 2);
    headerBuffer.writeUInt16BE(header.question_count, 4);
    headerBuffer.writeUInt16BE(header.answer_record_count, 6);
    headerBuffer.writeUInt16BE(header.authority_record_count, 8);
    headerBuffer.writeUInt16BE(header.additional_record_count, 10);

    
    const domainParts = question.domainName.split('.');
    const domainBufferParts = domainParts.map(part => {
        const length = Buffer.alloc(1);
        length.writeUInt8(part.length, 0);
        return Buffer.concat([length, Buffer.from(part)]);
    });
    const domainBuffer = Buffer.concat([...domainBufferParts, Buffer.alloc(1)]);

    // Create question buffer
    const questionBuffer = Buffer.alloc(4); // 2 bytes for type, 2 bytes for class
    questionBuffer.writeUInt16BE(question.type, 0);
    questionBuffer.writeUInt16BE(question.question_class, 2);

    // Combine all buffers into one DNS packet
    return Buffer.concat([headerBuffer, domainBuffer, questionBuffer]);
}

// Define DNS server address and port
const DNS_SERVER_ADDRESS = '127.0.0.1';
const DNS_SERVER_PORT = 2053;

// Create a DNS header with some example values
const header: Dnsheader = {
    packet_id: 0x1234,
    query_response_indicator: false,
    opcode: 0, // Standard query
    authoritative_answer: false,
    truncation: false,
    recursion_desired: true,
    recursion_available: true,
    reserved: 0,
    response_code: 0, // No error
    question_count: 1,
    answer_record_count: 0,
    authority_record_count: 0,
    additional_record_count: 0
};

// Create a DNS question for a specific domain
const question: Dnsquestion = {
    domainName: 'google.com',
    type: 1, // Type A (host address)
    question_class: 1 // Class IN (Internet)
};

// Create the DNS packet
const packet = createDnsPacket(header, question);

// Create a UDP client and send the packet
const client = dgram.createSocket('udp4');

client.send(packet, DNS_SERVER_PORT, DNS_SERVER_ADDRESS, (err) => {
    if (err) {
        console.error('Error sending DNS packet:', err);
    } else {
        console.log('DNS packet sent successfully');
    }
});

client.on('message', (msg) => {
    try {
        console.log(msg);
    } catch (error) {
      console.error('Error decoding response:', error);
    } finally {
      client.close();
    }
}); 
