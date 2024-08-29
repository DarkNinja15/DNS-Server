export interface Dnsquestion{
    domainName:string;
    type:number;
    question_class:number;
}

export function decodeQuestion(buffer:Buffer):Dnsquestion{
    const domainBuff=buffer.subarray(0,buffer.length-5);
    const remBuff=buffer.subarray(buffer.length-4,buffer.length);

    console.log(domainBuff);
    console.log(remBuff);
    
    
    let domainName='';
    let offset=0;

    while(offset<domainBuff.length){
        const length=domainBuff.readUint8(offset);
        offset++;
        domainName+=domainBuff.toString('ascii',offset,offset+length)+'.';
        offset+=length;
    }

    domainName=domainName.slice(0,-1);


    let type=remBuff.readInt16BE(0);
    let question_class=remBuff.readInt16BE(2);

    return {
        domainName,
        type,
        question_class
    };
};

export function encode(question:Dnsquestion):Uint8Array{
    let n=4;
    let domains = question.domainName.split(".");
    domains.forEach((d)=>n+=(d.length+1));
    const byteArray=new Uint8Array(n+1); // +1 for the 0 terminating character
    


    let offset=0;
    let nextIdx=-1;
    for(let i=0;i<domains.length;i++){
        byteArray[offset]=domains[i].length;
        offset++;
        for(let j=0;j<domains[i].length;j++){
            byteArray[j+offset]=domains[i].charCodeAt(j);
            nextIdx=j+offset+1;
        }
        offset+=domains[i].length;
    }
    

    byteArray[nextIdx]=0; // end of domain

    byteArray[nextIdx+1]=0x00;
    byteArray[nextIdx+2]=0x01;

    byteArray[nextIdx+3]=0x00;
    byteArray[nextIdx+4]=0x01;

    console.log("question_byte_array",byteArray);

    return byteArray;
}

export function writeQuestions(questions: Dnsquestion[]):Buffer{
    return Buffer.concat(questions.map((q)=>{
        const typeandclass=Buffer.alloc(4);
        const s=q.domainName.split('.').map((e)=>`${String.fromCharCode(e.length)}${e}`).join('');
        typeandclass.writeInt16BE(q.type);
        typeandclass.writeInt16BE(q.question_class,2);
        return Buffer.concat([Buffer.from(s+'\0','binary'),typeandclass]);
    }));
}