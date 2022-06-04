const cors = require("cors");
import express, { Response, Request, NextFunction } from "express";
var port = 4000;

const app = express();

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


app.get('/getQR', (req, res) => {
    const encodedRequestBody = req.query.data!.toString();
    const decodedRequestBodyString = Buffer.from(encodedRequestBody, "base64");
    const requestBodyObject = JSON.parse(decodedRequestBodyString.toString());

})

app.listen(port);
