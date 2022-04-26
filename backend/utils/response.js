const responseHandler = {
  success: (res, results) => {
    const json = {
      success: true,
      results,
    };
    return res.status(200).json(json);
  },
  responseErr: (res, error) => {
    const json = {
      success: false,
      error,
    };

    return res.status(400).json(json);
  },
  catchErr: (res, error) => {
    const json = {
      success: false,
      error,
    }
    return res.status(400).json(json);
  }
}

module.exports = responseHandler