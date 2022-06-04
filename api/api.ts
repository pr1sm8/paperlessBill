const cors = require("cors");
import express, { Response, Request, NextFunction } from "express";
import { generateQR } from "../scripts/generateQR";
import crypto from "crypto";
const redis = require('redis');
const port = process.env.SERVER_PORT || 4000;
const redis_host = process.env.REDIS_HOST || 'localhost';
const redis_port = process.env.REDIS_PORT || 6379;

const app = express();
const redisClient = redis.createClient({
    host: redis_host,
    port: redis_port
});
redisClient.connect();

function requireQueryParams(params: Array<string>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const fails = [];
        for (const param of params) {
            if (!req.query[param]) {
                fails.push(param);
            }
        }
        if (fails.length > 0) {
            res.status(400).send(`${fails.join(",")} required`);
        } else {
            next();
        }
    };
}

app.get('/', requireQueryParams(["data"]), (req, res) => {
    res.send("yep");
});
app.get('/getQR', async (req, res) => {
    const data = req.query.data!.toString();
    const sessionID = crypto.createHash('sha256').update(data).digest('hex');
    redisClient.setEx(sessionID, 3000, data);
    // let hash = await redisClient.get(sessionID);
    // console.log(hash);

    const encodedRequestBody = data.toString();
    const decodedRequestBodyString = Buffer.from(encodedRequestBody, "base64");
    const requestBodyObject = JSON.parse(decodedRequestBodyString.toString());
    res.send(requestBodyObject);

})

app.get('/bill/:session_id' , (req , res) =>{
    redisClient.get(req.params.session_id, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            
            const encodedRequestBody :string = result.toString();
            const decodedRequestBodyString = Buffer.from(encodedRequestBody, "base64");
            const requestBodyObject = JSON.parse(decodedRequestBodyString.toString());
            //const url = generateQR(data);
            res.send(requestBodyObject);
        }
    });
})

app.listen(port);
