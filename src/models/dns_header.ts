export class Dnsheader{
    packet_id!: number;
    query_response_indicator!: boolean;
    opcode!: number;
    authoritative_answer!: boolean;
    truncation!: boolean;
    recursion_desired!: boolean;
    recursion_available!: boolean;
    reserved!: number;
    response_code!: number;
    question_count!: number;
    answer_record_count!: number;
    authority_record_count!: number;
    additional_record_count!: number;

    encode():Uint8Array{
        const byteArray=new Uint8Array(12);
        let low_byte=this.packet_id & 0xff;
        let high_byte=(this.packet_id >> 8) & 0xff;

        byteArray[0]=low_byte;
        byteArray[1]=high_byte;

        let byte=0;
        if(this.query_response_indicator){
            byte |= 0b10000000;
        }
        byte |= (this.opcode << 3);
        if(this.authoritative_answer)
            byte |= 0b00000100;
        if(this.truncation)
            byte |= 0b00000010;
        if(this.recursion_desired)
            byte |= 0b00000001;

        byteArray[2]=byte;

        byte=0;
        if(this.recursion_available)
            byte |= 0b10000000;
        byte |= (this.reserved << 4);
        byte |= this.response_code;

        byteArray[3]=byte;

        low_byte=this.question_count & 0xff;
        high_byte=(this.question_count >> 8) & 0xff;

        byteArray[4]=low_byte;
        byteArray[5]=high_byte;

        low_byte=this.answer_record_count & 0xff;
        high_byte=(this.answer_record_count >> 8) & 0xff;

        byteArray[6]=low_byte;
        byteArray[7]=high_byte;

        low_byte=this.authority_record_count & 0xff;
        high_byte=(this.authority_record_count >> 8) & 0xff;

        byteArray[8]=low_byte;
        byteArray[9]=high_byte;

        low_byte=this.additional_record_count & 0xff;
        high_byte=(this.additional_record_count >> 8) & 0xff;

        byteArray[8]=low_byte;
        byteArray[9]=high_byte;

        return byteArray;
    }
}