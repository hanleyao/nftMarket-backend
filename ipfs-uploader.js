import { create } from 'kubo-rpc-client'
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config("./.env");

// connect to ipfs daemon API server
const ipfs = create(new URL(process.env.IPFS))

 export async function uploadFileToIPFS(filePath){
    const file = fs.readFileSync(filePath);
    const result = await ipfs.add({path: filePath, content: file
    });
    console.log(result);
    return result;
}

 export async function uploadJsonToIPFS(json){
    const result = await ipfs.add(JSON.stringify(json));
    console.log(result);
    return result;
}

// uploadJsonToIPFS({name:'test'})