const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const _ = require("lodash");
const User = require("../models/User");
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
const userInfo = async (req, res) => {
  let information = await User.find();
  if (information) {
    return res.status(StatusCodes.OK).json(information);
  }
  return res.status(StatusCodes.BAD_REQUEST).json("not found");
};
const updateUser = async (req, res) => {
  let information = req.body;
  console.log(information);
  res.json("success")
};
module.exports = {
  createUser,
  userInfo,
  updateUser
};
