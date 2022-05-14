import { reactive } from "vue"
import { isEmpty, isEmail, isRepeatCorrect } from "@/utils/inputValidation"

const errors = reactive({})

export default function useInputValidator() {
  const validateAccountInput = ({ inputName, inputKey, value }) => {
    errors[inputKey] = isEmpty(inputName, value) ? isEmpty(inputName, value) : isEmail(inputName, value);
  }

  const validatePasswordInput = ({ inputName, inputKey, value }) => {
    errors[inputKey] = isEmpty(inputName, value)
  }

  const validatePasswordIRepeatnput = ({ inputName, inputKey, value }, password) => {
    // if (!password) errors[inputKey] = ""
    errors[inputKey] = isEmpty(inputName, value) ? isEmpty(inputName, value) : isRepeatCorrect(inputName, value, password)
  }

  return { errors, validateAccountInput, validatePasswordInput, validatePasswordIRepeatnput }
}