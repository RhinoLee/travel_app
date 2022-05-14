import { reactive } from "vue"
import { isEmpty, isEmail } from "@/utils/inputValidation"

const errors = reactive({})

export default function useInputValidator() {
  const validateAccountInput = ({ inputName, inputKey, value }) => {
    errors[inputKey] = isEmpty(inputName, value) ? isEmpty(inputName, value) : isEmail(inputName, value);
  }

  const validatePasswordInput = ({ inputName, inputKey, value }) => {
    errors[inputKey] = isEmpty(inputName, value) ? isEmpty(inputName, value) : "";
  }

  return { errors, validateAccountInput, validatePasswordInput }
}