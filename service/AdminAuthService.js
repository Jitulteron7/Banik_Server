const jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");
class adminAuthService {
  constructor({ AdminModel, MailService }) {
    this.AdminModel = AdminModel;
    this.MailService = MailService;
  }

  _toJSON(admin) {
    const adminObj = admin.toObject();
    return adminObj;
  }

  _checkResetToken(id, token) {
    const secret = process.env.JWT_SECRET + id;
    const payload = jwt.verify(token, secret);
  }
  async checkAuthToken(token) {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      err.name = "Unauthorized";
      throw err;
    }
    return decoded;
  }

  _generateForgotPasswordToken(user) {
    const secret = process.env.JWT_SECRET + user._id;
    const payload = {
      email: user.email,
      id: user._id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1hr" });
    return token;
  }

  async _generateAuthToken(admin) {
    const token = jwt.sign(
      { _id: admin._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    return token;
  }

  async register(fname, lname, email, password) {
    const admin = await this.AdminModel.create({
      fname,
      lname,
      email,
      password,
    });

    const token = await this._generateAuthToken(admin);
    admin.password = undefined;
    return { admin: this._toJSON(admin), token };
  }

  async login(email, password) {
    const admin = await this.AdminModel.findOne({ email });
    console.log(admin,"admin login")
    if (!admin) {
      const err = new Error("Unable To Login");
      err.statusCode = 401;
      err.name = "Unauthorized";
      throw err;
    }

    const isMatched = await bcrypt.compare(password, admin.password);

    if (!isMatched) {
      const err = new Error("Unable To Login");
      err.statusCode = 401;
      err.name = "Unauthorized";
      throw err;
    }
    const token = await this._generateAuthToken(admin);
    admin.password = undefined;
    return { admin: this._toJSON(admin), token };
  }

  async logout() {
    const message = "logout successfully";
    return message;
  }

  async forgotpassword(email) {
    const user = await this._UserModel.findOne({ email });

    if (!user) {
      const err = new Error("Enter email once again");
      err.statusCode = 404;
      err.name = "NoEmail";
      throw err;
    }
    const token = this._generateForgotPasswordToken(user);
    await this._MailService.sendForgotPasswordMail(user, token);
  }

  async resetpassword(id, token, password) {
    const user = await this._UserModel.findById(id);
    if (!user) {
      const err = new Error("No Such User");
      err.statusCode = 404;
      err.name = "NotFound";
      throw err;
    }
    this._checkResetToken(user._id, token);
    user.password = password;
    await user.save();
    return this._toJSON(user);
  }
}

module.exports = adminAuthService;
// ohuRRgYGHsxcphBF