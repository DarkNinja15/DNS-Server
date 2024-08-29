export interface  Dnsheader{
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

export function decodeHeader(buffer:Buffer):Dnsheader{
    let packet_id=buffer.readInt16BE(0);
    let flags=buffer.readInt16BE(2);

    // flag = 0000 0001 1000 0000
    // flag = 0 0000 0 0 1 1 000 0000

    let query_response_indicator=!!(flags & 0x8000);
    let opcode=((flags<<11) & 0x0f);
    let authoritative_answer=!!(flags & 0x0400);
    let truncation=!!(flags & 0x0200);
    let recursion_desired=!!(flags & 0x0100);
    let recursion_available=!!(flags & 0x0080);
    let reserved=((flags>>4) & 0x07);
    let response_code=(flags & 0x0f);

    let question_count=buffer.readInt16BE(4);
    let answer_record_count=buffer.readInt16BE(6);
    let authority_record_count=buffer.readInt16BE(8);
    let additional_record_count=buffer.readInt16BE(10);


    return {
        packet_id,
        query_response_indicator,
        opcode,
        authoritative_answer,
        truncation,
        recursion_desired,
        recursion_available,
        reserved,
        response_code,
        question_count,
        answer_record_count,
        authority_record_count,
        additional_record_count
    };
}