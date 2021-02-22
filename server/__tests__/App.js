const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const app = require("../../app");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sinon = require("sinon");
const jwt_decode = require("jwt-decode");

var clock;
before(function () {
  clock = sinon.useFakeTimers({
    now: 1483228800000,
  });
});

after(function () {
  clock.restore();
});
// Configure chai
chai.use(chaiHttp);
chai.should();

let REFRESH_TOKEN;
let AUTH_TOKEN;
const INVALID_REFRESH_TOKEN =
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";

let registerUserId;

describe("POST /api/auth/register", () => {
  it("Should return validation errors if request is invaild", (done) => {
    chai
      .request(app)
      .post("/api/auth/register")
      .set({ "content-type": "application/json" })
      .send({
        name: "Mario lucifer",
        email: "mariolucifer",
        password: "123456",
      })
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql('"email" must be a valid email');
        done();
      });
  });
  it("Able to register and return user[object]", (done) => {
    chai
      .request(app)
      .post("/api/auth/register")
      .set({ "content-type": "application/json" })
      .send({
        name: "Mario lucifer",
        email: "mariolucifer@gmail.com",
        password: "123456",
      })
      .end((err, res) => {
        if (err) throw err;
        registerUserId = res.body.user._id;
        expect(res.body.user).not.to.be.undefined;
        done();
      });
  });
  it("Should not register if email already exist", (done) => {
    chai
      .request(app)
      .post("/api/auth/register")
      .set({ "content-type": "application/json" })
      .send({
        name: "Dangerous Dave",
        email: "mariolucifer@gmail.com",
        password: "123456",
      })
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("Email already exists!");
        done();
      });
  });
  it("Should store hashed password", async () => {
    try {
      const user = await User.findOne({ _id: registerUserId });
      if (!user || !user.password) expect(true).to.be.false;
      const validPass = await bcrypt.compare("123456", user.password);
      if (!validPass) expect(true).to.be.false;
      else expect(true).to.be.true;
    } catch (error) {
      console.log(error.message);
      expect(true).to.be.false;
    }
  });
});

describe("POST /api/auth/login", () => {
  it("Able to handle invalid data", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .set({ "content-type": "application/json" })
      .send({ email: "mariolucifer", password: "123456" })
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql('"email" must be a valid email');
        done();
      });
  });
  it("Should not login if not registered", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .set({ "content-type": "application/json" })
      .send({ email: "mariolucifer@hotmail.com", password: "1234564566" })
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("Email not found!");
        done();
      });
  });
  it("Should not login if password is incorrect", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .set({ "content-type": "application/json" })
      .send({ email: "mariolucifer@gmail.com", password: "1234564566" })
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("Password is incorect!");
        done();
      });
  });
  it("Should login user, set auth/refresh tokens and return user[obeject], auth_token and refresh_token", (done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .set({ "content-type": "application/json" })
      .send({ email: "mariolucifer@gmail.com", password: "123456" })
      .end((err, res) => {
        if (err) throw err;
        console.log(res.body);
        AUTH_TOKEN = res.header["auth-token"];
        REFRESH_TOKEN = res.header["refresh-token"];
        expect(AUTH_TOKEN).not.be.undefined;
        expect(REFRESH_TOKEN).not.be.undefined;
        expect(res.header["auth-token"]).not.be.undefined;
        expect(res.header["refresh-token"]).not.be.undefined;
        expect(res.body.user).not.be.undefined;
        expect(res.body.auth_token).not.be.undefined;
        expect(res.body.refresh_token).not.be.undefined;
        done();
      });
  });
  it("Refresh token should be only valid for 30 days", () => {
    const { exp } = jwt_decode(REFRESH_TOKEN);
    const expDate = new Date(parseInt(exp) * 1000);
    var expectedExpDate = new Date();
    expectedExpDate.setDate(expectedExpDate.getDate() + 28);
    expect(expectedExpDate).to.be.lessThan(expDate);
  });
});

describe("POST api/user/change-credentials", () => {
  it("Access denied if user have no token", (done) => {
    chai
      .request(app)
      .post("/api/user/change-credentials")
      .set({ "content-type": "application/json" })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("Access denied!");
        done();
      });
  });
  it("Access denied if not invalid token", (done) => {
    chai
      .request(app)
      .post("/api/user/change-credentials")
      .set({
        "content-type": "application/json",
        "auth-token": INVALID_REFRESH_TOKEN,
      })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("jwt malformed");
        done();
      });
  });
  it("Should not be able to change credentials if old password and new password are same", (done) => {
    chai
      .request(app)
      .post("/api/user/change-credentials")
      .set({ "content-type": "application/json", "auth-token": AUTH_TOKEN })
      .send({
        name: "Mario lucifer",
        email: "mariolucifer@gmail.com",
        password: "123456",
        newPassword: "123456",
      })
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("New password is same as old one");
        done();
      });
  });
  it("Should be able to change credentials", (done) => {
    chai
      .request(app)
      .post("/api/user/change-credentials")
      .set({ "content-type": "application/json", "auth-token": AUTH_TOKEN })
      .send({
        name: "Mario lucifer",
        email: "mariolucifer@gmail.com",
        password: "123456",
        newPassword: "1234567",
      })
      .end((err, res) => {
        if (err) throw err;
        res.statusCode.should.be.eql(200);
        done();
      });
  });
});

describe("GET api/user/me", () => {
  it("Access denied if user have no token", (done) => {
    chai
      .request(app)
      .get("/api/user/me")
      .set({ "content-type": "application/json" })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("Access denied!");
        done();
      });
  });
  it("Access denied if not invalid token", (done) => {
    chai
      .request(app)
      .get("/api/user/me")
      .set({
        "content-type": "application/json",
        "auth-token": INVALID_REFRESH_TOKEN,
      })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("jwt malformed");
        done();
      });
  });
  it("Should return user if authenticated", (done) => {
    clock.tick(30000);
    chai
      .request(app)
      .get("/api/user/me")
      .set({ "content-type": "application/json", "auth-token": AUTH_TOKEN })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        expect(res.body.user._id).not.to.be.undefined;
        expect(res.body.user.name).not.to.be.undefined;
        expect(res.body.user.email).not.to.be.undefined;
        done();
      });
  });
  it("Should NOT get user if token expired after 1 minute", (done) => {
    clock.tick(60000);
    chai
      .request(app)
      .get("/api/user/me")
      .set({ "content-type": "application/json", "auth-token": AUTH_TOKEN })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("jwt expired");
        done();
      });
  });
});

describe("GET /api/auth/refresh", () => {
  it("Should set/return auth-token valid for 1min if refresh token valid", (done) => {
    chai
      .request(app)
      .get("/api/auth/refresh")
      .set({
        "content-type": "application/json",
        "refresh-token": REFRESH_TOKEN,
      })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        expect(res.header["auth-token"]).not.be.undefined;
        AUTH_TOKEN = res.header["auth-token"];
        done();
      });
  });
  it("New Auth Token should be valid for 1min ONLY", () => {
    clock.tick(66000);
    const { exp } = jwt_decode(AUTH_TOKEN);
    const expDate = new Date(parseInt(exp) * 1000);
    const currDate = new Date();
    expect(expDate).to.be.lessThan(currDate);
  });
  it("Should not generate new-auth-token if refresh token is invalid", (done) => {
    chai
      .request(app)
      .get("/api/auth/refresh")
      .set({
        "content-type": "application/json",
        "refresh-token": INVALID_REFRESH_TOKEN,
      })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("jwt malformed");
        done();
      });
  });
  it("Should not generate New auth-token without refresh token", (done) => {
    chai
      .request(app)
      .get("/api/auth/refresh")
      .set({ "content-type": "application/json" })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("Access denied!");
        done();
      });
  });
});

describe("DELETE /api/auth/logout", (done) => {
  it("Should not logout if does not have refresh-token", (done) => {
    chai
      .request(app)
      .delete("/api/auth/logout")
      .set({ "content-type": "application/json" })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("Access denied!");
        done();
      });
  });
  it("Should not logout if refresh-token is invalid", (done) => {
    chai
      .request(app)
      .delete("/api/auth/logout")
      .set({
        "content-type": "application/json",
        "refresh-token": INVALID_REFRESH_TOKEN,
      })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("jwt malformed");
        done();
      });
  });
  it("User should logged out and corresponding refresh token should be removed from database", (done) => {
    chai
      .request(app)
      .delete("/api/auth/logout")
      .set({
        "content-type": "application/json",
        "refresh-token": REFRESH_TOKEN,
      })
      .send({})
      .end((err, res) => {
        if (err) throw err;
        res.body.message.should.be.eql("Successfully logged out!");
        done();
      });
  });
});
