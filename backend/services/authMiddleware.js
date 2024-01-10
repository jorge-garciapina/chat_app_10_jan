const authMiddleware = async (req, res, next) => {
  // console.log("REQUEST: ", req.rawHeaders);
  console.log("REQUEST: ", req.headers.authorization);
  next();

  // console.log("RESPONSE: ", res);
};

module.exports = authMiddleware;
