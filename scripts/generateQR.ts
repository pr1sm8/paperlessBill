var QRCode = require("qrcode-svg");
function generateQR(data: string) {
    let url = "http://4.tcp.ngrok.io:17237/bill/" + data;

    var qrcode = new QRCode({
        content: url,
        padding: 4,
        width: 256,
        height: 256,
        color: "#000000",
        background: "#ffffff",
        ecl: "M"
    });

    qrcode.save(data + ".svg", function (error: string) {
        if (error) throw error;

        console.log("QR Code saved!");
    });
}

export { generateQR };