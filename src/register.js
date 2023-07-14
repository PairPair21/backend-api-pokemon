const pool = require("../db/pool");
const { uuid } = require("uuidv4");
const common = require("./common/common");

const exec = async (req, res) => {
  let client = await pool.connect(); //ตรงนี้ต้องมาเปิด transition เพื่อล็อคให้มันทำงานทีละ section จะได้ไม่เกิดข้อมูลทับซ้อน ตรงนี้คือ connect ไปที่ database
  await client.query("BEGIN"); //คำสั่งในการเปิด transition
  let responseData = {};

  try {
    let data = req.body;
    console.log(data, "<<<<< body");

    let sqlUser = `SELECT * FROM public.user WHERE user_name = $1`; //เช็คว่าเคยมีคนสร้าง user นี้มาแล้วหรือยัง $1 มันจะใช้ค่าจาก data.userName เขียนแบบนี้เพื่อความปลอดภัยกันคนพิเรน
    let paramUser = [data.userName];
    let responseUser = await pool.query(sqlUser, paramUser); //ตรงนี้คือส่วนของ response
    // console.log(responseUser); //คือที่ยาวๆ ตั้งแต่ส่วนของ result ถ้ามีคือ rowCount ของมันจะมากกว่า 0

    if (responseUser.rowCount > 0) {
      responseData.success = false;
      responseData.data = "user duplicate";
    } else {
      let user_uuid = uuid();
      let encryptedPwd = await common.commonService.encrypted(data.password);
      let sql = `INSERT INTO public."user"
            (user_uuid, first_name, last_name, user_name, "password", create_date, create_by)
            VALUES($1, $2, $3, $4, $5, now(), $6);`;

      let param = [
        user_uuid,
        data.firstName,
        data.lastName,
        data.userName,
        encryptedPwd,
        user_uuid,
      ];
      let response = await pool.query(sql, param);
      console.log(response);
      responseData.success = true;
      client.query("COMMIT"); //ตรงนี้คือ commit transition
    }
  } catch (error) {
    console.log(error);
    client.query("ROLLBACK");
    responseData.success = false;
  } finally {
    client.release(); //ปิด transition
  }

  res.status(200).send(responseData);
  return res.end(); //จบกระบวนการ
};

module.exports = exec;
