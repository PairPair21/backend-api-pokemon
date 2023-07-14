const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const encrypted = async (data) => {
  try {
    let algo = "aes256";
    let key = "inwza007";
    let cipher = crypto.Cipher(algo, key);
    let encrypted = cipher.update(data, "utf8", "hex") + cipher.final("hex");
    return encrypted;
  } catch (error) {
    console.log(error);
  }
};

const decrypted = async (data) => {
  try {
    let algo = "aes256";
    let key = "inwza007";
    let decipher = crypto.Decipher(algo, key);
    let decrypted =
      decipher.update(data, "hex", "utf8") + decipher.final("utf8");
    return decrypted; //ตรงนี้คือข้อมูล password ที่ถูก decrypt แล้ว(password ที่เป้นภาษาคน)
  } catch (error) {
    console.log(error);
  }
};

const generatetoken = async (data) => {
  try {
    let key = "inwza007";
    let token = jwt.sign(data, key, { expiresIn: "30m" }); //เรียก jwt มาใช้่
    return token;
  } catch (error) {}
};

module.exports = {
  commonService: {
    encrypted,
    decrypted,
    generatetoken,
  },
};
