export class Dnsquestion{
    name!:string;
    type!:number;
    class!:number;

    encode():Uint8Array{
        let n=4;
        let domains = this.name.split(".");
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
}