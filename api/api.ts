const cors = require("cors");
import express, { Response, Request, NextFunction } from "express";
import { generateQR } from "../scripts/generateQR";
const axios = require('axios');
const redis = require('redis');

const port = process.env.SERVER_PORT || 4000;
const redis_host = process.env.REDIS_HOST || 'localhost';
const redis_port = process.env.REDIS_PORT || 6379;


const app = express();

const redisClient  = redis.createClient({
    host: redis_host,
    port: redis_port
});

redisClient.on('error', err => {
    console.log('Error ' + err);
});

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

app.get('/GET', (req, res) => {

    const query = req.query.sessionID!.toString();
  
    // Try fetching the result from Redis first in case we have it cached
    return redisClient.get(`wikipedia:${query}`, (err, result) => {
      // If that key exist in Redis store
      if (result) {
        const resultJSON = JSON.parse(result);
        return res.status(200).json(resultJSON);
      } else { // Key does not exist in Redis store
        // Fetch directly from Wikipedia API
        
      }
    });
  });


  
//   app.set('/SET', (req, res) => {
app.get('/getQR', (req, res) => {
    const data = req.query.data!;
    const encodedRequestBody = data.toString();
    const decodedRequestBodyString = Buffer.from(encodedRequestBody, "base64");
    const requestBodyObject = JSON.parse(decodedRequestBodyString.toString());
    //const url = generateQR(data);
    res.send(requestBodyObject);
});



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
