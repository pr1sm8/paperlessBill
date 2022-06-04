import express, { Response, Request, NextFunction } from "express";
import redis from "redis";

async (req : Request , res : Response) => {
    //console.log('asdasd')
    let encodedRequestBody = await redisClient.get(req.params.session_id);
    if(encodedRequestBody == null){

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
    }else{

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
  <link rel="stylesheet" href="./style.css">

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
			<button class="custom-btn btn-5"><span>Payment Link</span></button>  			
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
  <script  src="./script.js"></script>

</body>
</html>

		`

        res.send(requestBodyObject);
    }
}


export {bill_generate}