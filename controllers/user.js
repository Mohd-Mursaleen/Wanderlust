const Users = require("../models/user.js");

module.exports.userLogin = async (req, res) => {
  try {
    let { username } = req.body;
    req.flash("success", `${username} logged in!`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Error during login:", err);
    req.flash("error", "Failed to log in");
    res.redirect("/login"); // Redirect to login page on error
  }
};

module.exports.loginPage = async (req, res) => {
  try {
    await res.render("user/login.ejs");
  } catch (err) {
    console.error("Error rendering login page:", err);
    req.flash("error", "Failed to render login page");
    res.redirect("/login"); // Redirect to login page on error
  }
};

module.exports.signupPage = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.userLogout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out!");
    res.redirect("/listings");
  });
};

module.exports.userRegister = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new Users({
      email: email,
      username: username,
    });

    // Register the user with the provided username, email, and password
    let registeredUser = await Users.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        throw err;
      }
      req.flash("success", "User Registered!");
      res.redirect("/listings");
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    req.flash("error", err.message || "Failed to register user");
    res.redirect("/signup"); // Redirect to signup page on error
  }
};
