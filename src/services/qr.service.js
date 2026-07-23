import QRCode from "qrcode";

export const generateQRCode = async(url)=>{

return await QRCode.toDataURL(url);

}