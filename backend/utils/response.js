const responseHandler = {
  success: (res, results) => {
    const json = {
      success: true,
      results,
    };
    return res.status(200).json(json);
  },
  responseErr: (res, errMsg) => {
    const json = {
      success: false,
      errMsg,
    };

    return res.status(400).json(json);
  },
  catchErr: (res, err) => {
    const json = {
      success: false,
      errMsg: err
    }
    return res.status(400).json(json);
  }
}

module.exports = responseHandler