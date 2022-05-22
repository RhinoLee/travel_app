const responseHandler = {
  success: (res, results) => {
    const json = {
      success: true,
      results,
    };
    return res.status(200).json(json);
  },
  responseErr: (res, errorMsg, status=400) => {
    const json = {
      success: false,
      error: errorMsg,
    };

    return res.status(status).json(json);
  },
  catchErr: (res, error) => {
    console.log("catchErr", error);
    const json = {
      success: false,
      error: "資料庫存取失敗"
    }
    return res.status(500).json(json);
  }
}

module.exports = responseHandler