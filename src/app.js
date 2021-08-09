require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3330;
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const FriendsList = require("./schema/model");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const staticPath = path.join(__dirname, "../public");
const tampletesPath = path.join(__dirname, "../tampletes/views");
const partialsPath = path.join(__dirname, "../tampletes/partial");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", tampletesPath);
hbs.registerPartials(partialsPath);

app.post("/contact", async (req, res) => {
  try {
    const password = req.body.password;
    const rePassword = req.body.rePassword;

    if (password === rePassword) {
      const user = new FriendsList({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        rePassword: req.body.rePassword,
      });

      const token = await user.genarateToken();

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      });

      const currntuser = await user.save();
      res.status(201).render("login");
    } else {
      res.status(201).send("password are not same");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const checkuser = await FriendsList.findOne({ username: username });

    const isMatch = await bcrypt.compare(password, checkuser.password);

    const token = await checkuser.genarateToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 30000),
      httpOnly: true,
    });

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.status(300).send("pass not match");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/secret", auth, (req, res) => {
  res.render("secret");
});

app.get("/services", (req, res) => {
  res.render("services");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", auth, async (req, res) => {
  try {
    // req.varUser.tokens = req.varUser.tokens.filter((curr) => {
    //   return curr.token !== req.token;
    // });

    req.varUser.tokens = [];

    res.clearCookie("jwt");
    await req.varUser.save();
    res.render("login");
  } catch (error) {
    res.send(error);
  }
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("*", (req, res) => {
  res.send("there is nothing");
});

app.listen(port, () => {
  console.log("server created");
});
