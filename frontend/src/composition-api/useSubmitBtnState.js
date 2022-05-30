import { computed } from "vue"

export default function useSubmitBtnState(params, errors, canBeEmptyKeys=[]) {
  const isSubmitBtnDisabled = computed(() => {
    let disabled = true;
    for (let prop in params) {
      // 如果有指定哪些欄位不驗證
      const idx = canBeEmptyKeys.findIndex(key => key === prop)
      // console.log(prop, params[prop], idx);
      // 驗證 params 參數（所有欄位）
      if (!params[prop] && idx < 0 || errors[prop]) {
        disabled = true;
        break;
      }
      disabled = false;
    }
    return disabled;
  })

  return { isSubmitBtnDisabled }
}