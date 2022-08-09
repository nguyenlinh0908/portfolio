const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const otpGenerator = require("otp-generator");
const _ = require("lodash");
const mailer = require("../libs/mailer");

const User = require("../models/User");
const Otp = require("../models/Otp");

const userInfo = async (req, res) => {
  let information = await User.findOne({}).select("-password");
  if (information) {
    return res.status(StatusCodes.OK).json(information);
  }
  return res.status(StatusCodes.BAD_REQUEST).json("not found");
};
const contact = async (req, res) => {
  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  let isCreated = await Otp.create({
    otp: OTP,
  });
  // await mailer(OTP);
  if (isCreated) {
    return res.status(StatusCodes.CREATED).json(isCreated);
  }
  return res.status(StatusCodes.CONFLICT).json("create OTP fail");
};
const login = async (req, res) => {
  let { email, password } = req.body;
  try {
    let userOfMail = await User.findOne({ email: email });
    let verifyPass = await userOfMail.comparePassword(password);
    if (verifyPass) {
      let tokenJWT = userOfMail.createJWT();
      return res.status(StatusCodes.OK).json({ token: tokenJWT });
    } else {
      console.log("note verify");
    }
  } catch (error) {
    return res.status(StatusCodes.CONFLICT).json(error);
  }
  return res.status(StatusCodes.UNAUTHORIZED).json("Login fail");
};
// admins
const dashboard = async (req, res) => {
  let userSes = req.session.user;
  if (userSes) {
    res.send(userSes);
  } else {
    res.json(userSes);
  }
};
const createUser = async (req, res) => {
  let information = req.body;
  const mustNotEmpty = [
    "avatar",
    "name",
    "email",
    "phone",
    "address",
    "summary",
    "password",
    "description",
  ];
  let isEmpty = false;
  mustNotEmpty.forEach((checker) => {
    if (information[checker] == "") {
      isEmpty = checker;
      return;
    }
  });
  if (!isEmpty) {
    const standard = {
      avatar: information["avatar"],
      name: information["name"],
      email: information["email"],
      work: information["work"],
      phone: information["phone"],
      address: information["address"],
      summary: information["summary"],
      password: information["password"],
      description: information["description"],
    };
    try {
      let isCreated = await User.create(standard);
      if (isCreated) {
        return res.status(StatusCodes.CREATED).json(isCreated);
      }
    } catch (error) {
      return res.status(StatusCodes.CONFLICT).json(error);
    }
  } else {
    return res.status(StatusCodes.CONFLICT).json(`Provide ${isEmpty}`);
  }
};
const updateUser = async (req, res) => {
  let information = req.body;
  let id = information["_id"];
  let standard = _.omit(information, ["_id", "avatar", "cv"]);
  let isUpdate = await User.findOneAndUpdate({ _id: id }, standard);
  if (isUpdate) {
    return res.status(StatusCodes.K).json(isUpdate);
  } else {
    return res.status(StatusCodes.CONFLICT).json("update fail");
  }
};
const updateFile = async (req, res) => {
  let { cv, avatar } = req.locals;
  let updatePath = {};
  if (cv) {
    updatePath = { ...updatePath, cv: cv };
  }
  if (avatar) {
    updatePath = { ...updatePath, avatar: avatar };
  }

  let isUpload = await User.findOneAndUpdate({}, updatePath);
  if (isUpload) {
    console.log(isUpload);
  }
  res.json("upload");
};
module.exports = {
  userInfo,
  contact,
  login,
  dashboard,
  updateUser,
  updateFile,
  createUser,
};
