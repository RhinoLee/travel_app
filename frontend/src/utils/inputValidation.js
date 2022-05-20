const isEmpty = (inputName, inputVal) => {
  return !inputVal ? `${inputName}欄位必填` : "";
}

const isEmail = (inputName, inputVal) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !re.test(inputVal) ? `${inputName}格式不正確` : "";
}

const isRepeatCorrect = (inputName, inputVal, originVal) => {
  return inputVal !== originVal ? `${inputName}與密碼不符` : "";
}

const isImageFormat = (inputName, inputVal) => {
  const format = /\/(jpg|jpeg|png)$/
  if (!inputVal.type.match(/\/(jpg|jpeg|png)$/)) return `${inputName}格式須為 jpg, jpeg, png`
  else return ""
}

const isSizeUnderLimit = (inputName, inputVal, size = 5) => {
  const limit = size * 1024 * 1024
  return inputVal.size > limit ? `${inputName}須小於 5 MB` : "";
}

export { isEmpty, isEmail, isRepeatCorrect, isImageFormat, isSizeUnderLimit }