const cors = require("cors");
import express, { Response, Request, NextFunction } from "express";
import { generateQR } from "../scripts/generateQR";
import crypto from "crypto";
import { bill_generate } from "./bill_generate";
const redis = require('redis');
const port = process.env.SERVER_PORT || 4000;
const redis_host = process.env.REDIS_HOST || 'localhost';
const redis_port = process.env.REDIS_PORT || 6379;

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

const app = express();

app.use(express.static('public'));


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

app.get('/bill/:session_id', async (req: Request, res: Response) => {
    //console.log('asdasd')
    let encodedRequestBody = await redisClient.get(req.params.session_id);
    if (encodedRequestBody == null) {

        res.send(`<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="utf-8">
            <title>Error</title>
        </head>
        
        <body>
            <pre>requested bill doesn't exist</pre>
        </body>
        
        </html>`)
    } else {

        //const encodedRequestBody :string = result.toString();
        const decodedRequestBodyString = Buffer.from(encodedRequestBody, "base64");
        
        const requestBodyObject = JSON.parse(decodedRequestBodyString.toString());
        //const url = generateQR(data);

        let page = `
		<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Starbucks Invoice</title>
  <link rel="stylesheet" href="http://localhost:4000/invoice_page/style.css">

  <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet">

</head>
<body>
<!-- partial:index.partial.html -->
<html>
	<head>
		<meta charset="utf-8">
		<title>Invoice</title>
		<link rel="stylesheet" href="style.css">
		<link rel="license" href="https://www.opensource.org/licenses/mit-license/">
		<script src="script.js"></script>
	</head>
	<body>
		<header>
			<h1>Invoice</h1>
			<address contenteditable>
				<p>Starbucks Coffee</p>
				<p>KBR Park Jubilee hills(Film nagar)</p>
				<p>070328 65068</p>
			</address>
			<!-- <span><img alt="" src="http://www.jonathantneal.com/examples/invoice/logo.png"><input type="file" accept="image/*"></span> -->
		</header>
		<article>
			<h1>Recipient</h1>
			<address contenteditable>
				<p>Starbucks<br>Invoice</p>
			</address>
			<table class="meta">
				<tr>
					<th><span contenteditable>Invoice</span></th>
					<td><span contenteditable>${requestBodyObject.orderNumber}</span></td>
				</tr>
				<tr>
					<th><span contenteditable>Date</span></th>
					<td><span contenteditable>${requestBodyObject.orderDate}</span></td>
				</tr>
				<tr>
					<th><span contenteditable>Time Stamp</span></th>
					<td><span id="prefix" contenteditable>'lorem ipsum'</span><span></span></td>
				</tr>
			</table>
			<table class="inventory">
				<thead>
					<tr>
						<th><span contenteditable>Item</span></th>
						<th><span contenteditable>Expiry</span></th>
						<th><span contenteditable>Price</span></th>
						<th><span contenteditable>Quantity</span></th>
						<th><span contenteditable>Price</span></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<!-- <td><a class="cut">-</a><span contenteditable>Front End Consultation</span></td> -->
						<td><span contenteditable>${requestBodyObject.products.productName}</span></td>
						<td><span contenteditable>${requestBodyObject.products.productExpiry}</span></td>
						<td><span data-prefix>$</span><span contenteditable>${requestBodyObject.products.productPrice}</span></td>
						<td><span contenteditable>${requestBodyObject.products.productQuantity}</span></td>
						<td><span data-prefix>$</span><span>${Number(requestBodyObject.products.productQuantity) * Number(requestBodyObject.products.productPrice)}</span></td>
					</tr>
				</tbody>
			</table>
			<!-- <a class="add">+</a> -->
			<table class="balance">
				<tr>
					<th><span contenteditable>Total Items</span></th>
					<td><span data-prefix>$</span><span>600.00</span></td>
				</tr>
				<tr>
					<th><span contenteditable>Total Price</span></th>
					<td><span data-prefix>$</span><span contenteditable>0.00</span></td>
				</tr>
				<tr>
					<th><span contenteditable>Balance Due</span></th>
					<td><span data-prefix>$</span><span>600.00</span></td>
				</tr>
			</table>
		</article><br><br>
		<div class="frame">
			<button class="custom-btn btn-5" onClick=""><span>Payment Link</span></button>  			
		</div>
		<br><br><br><br><br><br><br>
		<aside>
			<h1><span contenteditable>Additional Notes</span></h1>
			<div contenteditable>
				<span>This is a computer generated invoice. Please do visit our store</span>
				
			</div>
		</aside>


	</body>
</html>
<!-- partial -->
  <script  src="http://localhost:4000/invoice_page/script.js"></script>
  <script type="application/javascript" crossorigin="anonymous" src="https://securegw.paytm.in/merchantpgpui/checkoutjs/merchants/DXBfuu25296246458637.js" onload="onScriptLoad();"> </script>
  <script>
  function onScriptLoad(){
      var config = {
        "root": "",
        "flow": "DEFAULT",
        "data": {
        "orderId": "", /* update order id */
        "token": "", /* update token value */
        "tokenType": "TXN_TOKEN",
        "amount": "" /* update amount */
        },
        "handler": {
          "notifyMerchant": function(eventName,data){
            console.log("notifyMerchant handler function called");
            console.log("eventName => ",eventName);
            console.log("data => ",data);
          } 
        }
      };

      if(window.Paytm && window.Paytm.CheckoutJS){
          window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
              // initialze configuration using init method 
              window.Paytm.CheckoutJS.init(config).then(function onSuccess() {
                  // after successfully updating configuration, invoke JS Checkout
                  window.Paytm.CheckoutJS.invoke();
              }).catch(function onError(error){
                  console.log("error => ",error);
              });
          });
      } 
  }
</script>
</body>
</html>

		`

        res.send(page);
    }
})
console.log('server started')
app.listen(port);
