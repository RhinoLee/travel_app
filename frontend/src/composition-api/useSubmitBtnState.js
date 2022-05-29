import { computed } from "vue"

export default function useSubmitBtnState(params, errors) {
  const isSubmitBtnDisabled = computed(() => {
    let disabled = true;
    for (let prop in params) {
      if (!params[prop] || errors[prop]) {
        disabled = true;
        break;
      }
      disabled = false;
    }
    return disabled;
  })

  return { isSubmitBtnDisabled }
}