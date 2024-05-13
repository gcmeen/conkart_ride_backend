const url = req => `${req.protocol}://${req.get('host')}`;

exports.trimParams = (req, res, next) => {
  console.log("==========================================================================");
  console.log('API : ', `${url(req)}${req.url}`);

  for (const i in req.body) {
    if (typeof req.body[i] === 'string') {
      req.body[i] = req.body[i].trim();
    }
  }

  for (const i in req.query) {
    if (typeof req.query[i] === 'string') {
      req.query[i] = req.query[i].trim();
    }
  }

  console.log('req.method : ', req.method);
  console.log('req.body : ', req.body);
  console.log('req.query : ', req.query);
  console.log("==========================================================================");
  next();
};

exports.handleError = async (err, req, res, next) => {
  if (!err) {
    return next();
  }
  const errorResponse = Object.assign({
    stack: process.env.NODE_ENV=== 'local' ||process.env.NODE_ENV=== 'development'?  err.stack : '',
    message: err?.message ? err?.message  : err
  }, err.output && err.output.payload ? err.output.payload : err);
  console.log('Error stack :: ');
  console.log(err.stack);

  const statusCode = err.output && err.output.statusCode ? err.output.statusCode : 500;
  return res.status(statusCode).json(errorResponse);
};
