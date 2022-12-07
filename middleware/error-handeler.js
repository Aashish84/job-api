const errorHandeler = (err, req, res, next) => {
  let customError = {
    status: 500,
    msg: err || "something went wrong",
  };

  // console.log(err.name);
  // console.log(err);

  if (err.name === "CastError") {
    customError.msg = err.message;
    customError.status = 400;
  }

  // for schema validation
  // required - enum
  if (err.name === "ValidationError") {
    // console.log(err);
    let errors = [];
    Object.keys(err.errors).forEach((key) => {
      errors.push({
        message: err.errors[key].properties.message,
        param: err.errors[key].properties.path,
      });
    });
    customError.msg = errors;
    customError.status = 400; //bad request
  }

  //   unique:true - duplicate error
  if (err.code == 11000) {
    // console.log(err);
    // customError.msg = err;
    let tmp = Object.entries({ ...err.keyValue });
    customError.msg = {
      message: `duplicate ${tmp[0][0]} : ${tmp[0][1]}`,
      param: tmp[0][0],
    };
    customError.status = 400;
  }

  res.status(customError.status).send({ msg: customError.msg });
};

module.exports = errorHandeler;
