import * as dgram from "dgram";
import { decodeHeader } from './models/dns_header';
import { decodeQuestion } from "./models/dns_question";

const udpSocket: dgram.Socket = dgram.createSocket("udp4");

udpSocket.bind(2053, "127.0.0.1", () => {
    console.log("Server connected on port 2053");
});

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
    try {
        console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);
        console.log(data);

        const headBuff = data.subarray(0, 12);
        console.log(decodeHeader(headBuff));

        const questionBuff = data.subarray(12, data.length);
        console.log(decodeQuestion(questionBuff));

        const client = dgram.createSocket('udp4');

        client.send(data, 0, data.length, 53, '8.8.8.8', (err) => {
            if (err) {
                console.error('Error sending query:', err);
                client.close();
            }
        });

        client.on('message', (msg) => {
            try {
                console.log('Received response from 8.8.8.8');
                console.log(msg);

                udpSocket.send(msg, remoteAddr.port, remoteAddr.address, (err) => {
                    if (err) {
                        console.error('Error sending response to client:', err);
                    }
                });
            } catch (error) {
                console.error('Error processing DNS response:', error);
            } finally {
                client.close();
            }
        });

        client.on('error', (err) => {
            console.error('Client socket error:', err);
            client.close();
        });

    } catch (e) {
        console.error(`Error processing message: ${e}`);
    }
});
