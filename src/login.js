const pool = require("../db/pool");
const common = require("./common/common");

const exec = async (req, res) => {
  let responseData = {};
  let client = await pool.connect();

  try {
    let data = req.body; //username, password

    let sql = `SELECT * FROM public.user WHERE user_name = $1`;
    let param = [data.userName];
    let responseUser = await pool.query(sql, param);

    if (responseUser.rowCount < 1) {
      responseData.success = false;
      responseData.data = "user not found";
    } else if (!responseUser.rowCount < 1) {
      let decryptedPwd = await common.commonService.decrypted(
        responseUser.rows[0].password
      );
      if (decryptedPwd == data.password) {
        let tokenObj = { user_id: responseUser.rows[0].user_uuid };
        responseData.success = true;
        responseData.data = responseUser.rows.map((i) => ({
          id: i.user_uuid,
          firstName: i.first_name,
          lastName: i.last_name,
          userName: i.user_name,
        }));

        responseData._token = await common.commonService.generatetoken(
          tokenObj
        );
        console.log(responseData._token);
      } else {
        responseData.success = false;
        responseData.data = "password invallid";
      }
    }
  } catch (error) {
    console.log(error);
    responseData.success = false;
  } finally {
    client.release();
  }

  res.status(200).send(responseData);
  return res.end();
};

module.exports = exec;
