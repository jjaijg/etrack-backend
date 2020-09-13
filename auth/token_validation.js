const { verify } = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    console.log(token);
    if (token) {
      token = token.slice(7);
      console.log(token);

      verify(token, "qwe123", (err, decoded) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Invalid token",
          });
        } else {
          req.user = decoded.result;
          console.log(req.user);
          next();
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Not Authorised!",
      });
    }
  },
};
