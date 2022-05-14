const isEmpty = (inputName, inputVal) => {
  return inputVal === "" ? `請填寫${inputName}` : "";
}

const isEmail = (inputName, inputVal) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !re.test(inputVal) ? `${inputName}格式不正確` : "";
}

export { isEmpty, isEmail }