
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { uploadFileToIPFS,uploadJsonToIPFS } from './ipfs-uploader.js';
import { mint } from './nft-miner.js';
import dotenv from 'dotenv';
dotenv.config("./.env");

const app = express();
app.set('view engine','ejs');
app.set(bodyParser.urlencoded({ extended:true}));
app.use(fileUpload());
app.use(cors());

app.get('/',(req,res) => {
    res.render("home");
});

app.post('/upload', (req,res)=>{
    const title = req.body.title;//body.的title或者其他要和home里面的body的name对应
    const description = req.body.description;
   // console.log(title,description);
    //console.log(req.files);

    const file = req.files.file;
    const filename = file.name;
    const filePath = "files/"+filename;
    

    file.mv(filePath, async (err) =>{
        if(err){
            console.log(err);
            res.status(500).send("error occured");
        }

        const fileResult = await uploadFileToIPFS(filePath);
        const fileCid = fileResult.cid.toString();

        const metadata = {
            title: title,
            description: description,
            image:'http://43.129.194.130:8080/ipfs/'+fileCid
        }
        const metadataResult = await uploadJsonToIPFS(metadata);
        const metadataCid = metadataResult.cid.toString();
        console.log(metadataCid);

        const userAddress = process.env.ADDRESS;
        await mint(userAddress)

        res.json({
            message:"file uploaded successfully",
            metadata:metadata
        });
    })


});

const HOST = process.env.HOST 
const PORT = process.env.PORT

app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`)
})