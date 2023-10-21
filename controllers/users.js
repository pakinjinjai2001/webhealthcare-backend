const userModel = require("../schemas/users");
const { passwordHashing, passwordCompare } = require("../configs/hash");
const { createJWT } = require("../configs/jsonwebtoken");
const { createProfile } = require("./profile_patient");

const login = async (req, res) => {
  const { email, password } = req.body; //email,password

  const existUser = await userModel.findOne({ email: email });

  if (!existUser) {
    return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
  }

  const correctPassword = await passwordCompare(password, existUser.password);

  if (!correctPassword) {
    return res.status(401).json({ message: "อีเมล์หรือรหัสผ่านไม่ถูกต้อง" });
  }

  const accessPayload = {
    principal: existUser._id, //64654sadawd213sad+-
    role: existUser.role, //2001
    kind: "access",
  };

  const accessToken = createJWT(accessPayload);

  return res
    .status(200)
    .json({ message: "เข้าสู่ระบบสำเร็จ", accessToken: accessToken });
};
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (role != undefined) {
      return res.status(400).json({ message: "เกิดข้อผิดพลาด" });
    }

    const existsUser = await userModel.findOne({ email: email });

    if (existsUser) {
      return res.status(400).json({ message: "มีผู้ใช้งานอยู่ในระบบ" });
    }

    const passwordHash = await passwordHashing(password);

    const user = await userModel.create({
      email: email,
      password: passwordHash,
    });
    await createProfile(user._id);
    return res.status(201).json({ message: "สร้างรหัสผ่านสำเร็จ", user: user });
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  login,
  register,
};
