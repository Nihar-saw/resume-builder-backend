import QRCode from "qrcode";

export const generateQRCode = async (url) => {
  try {
    return await QRCode.toDataURL(url);
  } catch (error) {
    console.error("QR Code Generation Error:", error.message);
    return "";
  }
};