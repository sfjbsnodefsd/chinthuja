const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;
const User = require("./User");
const jwt = require("jsonwebtoken");
app.use(express.json());
const csvFile=require("csvtojson");
const cors = require("cors");
app.use(cors());
mongoose.connect(
  "mongodb://localhost:27017/auth-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`auth service DB  Connected`);
  }
);

csvFile().fromFile("./login.csv").then(async (response) => {
  for (var x = 0; x < response.length; x++) {
  const email = await User.findOne({ email: response[x].email });
  if (email) 
  continue;
  const credential= new User({
  name: response[x].name,
 email: response[x].email,
  password: response[x].password,
 
 
  });
credential.save(); 
  }
  
  })
  
// register
app.post("/auth/reg", async (req, res) => {
  const { name , email, password} = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ success: 0, message: "User already exists" });
  } else {
    const newUser = new User({
      name,
      email,
      password,
   
    });
    newUser.save();
    return res.json(newUser);
  }
});

// login

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: 0, message: "User dose not exist" });
  } else {
    if (password !== user.password) {
      return res.json({ success: 0, message: "Incorrect password" });
    }
    const payload = {
      email,
      name: user.name,
    };
    jwt.sign(payload, "secret", (err, token) => {
      if (err) console.log(err);
      else {
        return res.json({ token: token });
      }
    });
  }
});


app.listen(PORT, () => {
  console.log(`Auth service at ${PORT}`);
});