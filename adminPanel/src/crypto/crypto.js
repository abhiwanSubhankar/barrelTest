import CryptoJS from "crypto-js";
// import { ENCRYPTION_KEY } from "../env.vars.js"; // Make sure you have the ENCRYPTION_KEY
const ENCRYPTION_KEY =
  "4d727001e0c2df9f0586ef82dd23857556950f7fc8323f0a8458f1f411369c11";
const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);

export const encryptData = (data) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
  });

  return (
    iv.toString(CryptoJS.enc.Hex) +
    ":" +
    encrypted.ciphertext.toString(CryptoJS.enc.Hex)
  );
};

export const decryptData = (text) => {
  const textParts = text.split(":");
  const iv = CryptoJS.enc.Hex.parse(textParts.shift());
  const encryptedText = CryptoJS.enc.Hex.parse(textParts.join(":"));
  const decrypted = CryptoJS.AES.decrypt(
    {
      ciphertext: encryptedText,
    },
    key,
    {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
  try {
    return JSON.parse(decryptedString);
  } catch (error) {
    throw new Error("Failed to parse JSON");
  }
};
