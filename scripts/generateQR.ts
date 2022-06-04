import qrcode from 'qrcode';
let DOMAIN : string;
function updateDomain(domain : string){
    DOMAIN = domain;
}
function generateQR(data : string){
    let url = DOMAIN + "/" + data;
    qrcode.toString(JSON.stringify(data),function(err,qrcode){
        console.log(qrcode);
    })

}

export {generateQR};