/**
 * Products (event.kind === 'product') reuse the public event pages. This wraps a
 * component's translations so keys defined in `productT` win while `isProduct`
 * is true — ticket/event wording becomes store wording without forking pages.
 *
 * @param {Object} t - result of createT(translations)
 * @param {Object} productT - result of createT(productTranslations)
 * @param {import('vue').Ref<boolean>} isProduct
 */
export const withProductLabels = (t, productT, isProduct) => {
  return new Proxy(t, {
    get(target, key) {
      if (isProduct.value && key in productT) return productT[key]
      return target[key]
    }
  })
}
