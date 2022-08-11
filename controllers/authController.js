const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const {  JWT_SIGNATURE_KEY = "SIGNATURE"} = process.env;

function isPasswordValid(password, encryptedPassword) {
  return bcrypt.compareSync(password, encryptedPassword);
}

function createToken(payload) {
  return jwt.sign(payload, JWT_SIGNATURE_KEY, {
    expiresIn: '1h'
  });
}

exports.login = async function (req, res) {
    const user = await User.findOne({
        where: {
            email: req.body.email,
        },
    });
    if (!user) {
        return res.status(401).json({
        status: "FAIL",
        data: {
            user: "UNAUTHORIZED",
            message: "Email does not exist",
            },
        });
    }

  if (!isPasswordValid(req.body.password, user.password)) {
    return res.status(401).json({
      status: "FAIL",
      data: {
        name: "UNAUTHORIZED",
        message: "Wrong password",
      },
    });
  }

  return res.status(201).json({
    status: "OK",
    data: {
      token: createToken({ id: user.id, email: user.email, role: user.role }),
    },
  });
};

exports.getAllUser = async(req,res) =>{
  try {
    const user = await User.findAll({});
    res.status(200).send({
      status : 200,
      message : "Successfull",
      data : user
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message : err.message
    })
  }
};

exports.register = async function (req, res) {
  try {
    const encryptedPassword = bcrypt.hashSync(req.body.password, 8);

    const user = await User.create({
      email: req.body.email,
      password:encryptedPassword,
      role:"user"
    });

    return res.status(201).json({
      status: "OK",
      data: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    return res.status(422).json({
      status: "FAIL",
      data: {
        name: "UNPROCESSABLE_ENTITY",
        message: "cannot register user",
      },
    });
  }
};

exports.whoami = function (req, res) {
  return res.status(200).json({
    status: "OK",
    data: req.user,
  });
};
