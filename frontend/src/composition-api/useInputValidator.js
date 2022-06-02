import { reactive } from "vue"
import { isEmpty, isEmail, isRepeatCorrect, isImageFormat, isSizeUnderLimit } from "@/utils/inputValidation"

const errors = reactive({})

export default function useInputValidator() {
  const validateInit = () => {
    console.log("validateInit");
    for (let key in errors) {
      console.log("delete errors[key]", errors);
      delete errors[key];
      console.log("delete2 errors[key]", errors);
    }
  }

  const validateAccountInput = ({ inputName, inputKey, value }) => {
    errors[inputKey] = isEmpty(inputName, value) ? isEmpty(inputName, value) : isEmail(inputName, value);
  }

  const validatePasswordInput = ({ inputName, inputKey, value }) => {
    errors[inputKey] = isEmpty(inputName, value)
  }

  const validatePasswordIRepeatnput = ({ inputName, inputKey, value }, password) => {
    errors[inputKey] = isEmpty(inputName, value) ? isEmpty(inputName, value) : isRepeatCorrect(inputName, value, password)
  }

  const validateRequiredInput = ({ inputName, inputKey, value }) => {
    errors[inputKey] = isEmpty(inputName, value)
  }

  const validateSingeImageInput = ({ inputName, inputKey, value }) => {
    if (isEmpty(inputName, value)) return errors[inputKey] = isEmpty(inputName, value)
    if (isImageFormat(inputName, value)) return errors[inputKey] = isImageFormat(inputName, value)
    if (isSizeUnderLimit(inputName, value)) return errors[inputKey] = isSizeUnderLimit(inputName, value)

    errors[inputKey] = ""
  }

  return { errors, validateInit, validateAccountInput, validatePasswordInput, validateRequiredInput, validatePasswordIRepeatnput, validateSingeImageInput }
}