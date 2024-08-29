export class Dnsanswer{
    name!:string;
    type!:number;
    class!:number;
    ttl!:number;
    data!:string
}

export function writeAnswers(answers:Dnsanswer[]):Buffer{
    return Buffer.concat(answers.map((a)=>{
        const buffer=Buffer.alloc(10);

        const s=a.name.split('.').map((e)=>`${String.fromCharCode(e.length)}${e}`).join('');

        buffer.writeInt16BE(a.type);
        buffer.writeInt16BE(a.class,2);
        buffer.writeInt32BE(a.ttl,4);
        buffer.writeInt16BE(a.data.length,8);

        return Buffer.concat([Buffer.from(s+'\0','binary'),buffer,Buffer.from(a.data+'\0','binary')]);
    }));
}