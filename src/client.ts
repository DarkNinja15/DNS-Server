import dgram from 'dgram';

// Define the DNS header interface
interface Dnsheader {
    packet_id: number;
    query_response_indicator: boolean;
    opcode: number;
    authoritative_answer: boolean;
    truncation: boolean;
    recursion_desired: boolean;
    recursion_available: boolean;
    reserved: number;
    response_code: number;
    question_count: number;
    answer_record_count: number;
    authority_record_count: number;
    additional_record_count: number;
}

// Function to create a DNS packet
function createDnsPacket(header: Dnsheader): Buffer {
    const packet = Buffer.alloc(12); // Initial buffer for DNS header

    // Encode the header values into the buffer
    packet.writeUInt16BE(header.packet_id, 0);
    let flags = 0;
    flags |= (header.query_response_indicator ? 1 : 0) << 15;
    flags |= header.opcode << 11;
    flags |= (header.authoritative_answer ? 1 : 0) << 10;
    flags |= (header.truncation ? 1 : 0) << 9;
    flags |= (header.recursion_desired ? 1 : 0) << 8;
    flags |= (header.recursion_available ? 1 : 0) << 7;
    flags |= header.reserved;
    flags |= header.response_code;
    packet.writeUInt16BE(flags, 2);
    packet.writeUInt16BE(header.question_count, 4);
    packet.writeUInt16BE(header.answer_record_count, 6);
    packet.writeUInt16BE(header.authority_record_count, 8);
    packet.writeUInt16BE(header.additional_record_count, 10);

    return packet;
}

// Define DNS server address and port
const DNS_SERVER_ADDRESS = '127.0.0.1';
const DNS_SERVER_PORT = 2053;

// Create a DNS packet with some example values
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
    question_count: 0,
    answer_record_count: 0,
    authority_record_count: 0,
    additional_record_count: 0
};

const packet = createDnsPacket(header);

// Create a UDP client and send the packet
const client = dgram.createSocket('udp4');

client.send(packet, DNS_SERVER_PORT, DNS_SERVER_ADDRESS, (err) => {
    if (err) {
        console.error('Error sending DNS packet:', err);
    } else {
        console.log('DNS packet sent successfully');
    }
    client.close();
});
