<!-- components/admin/ProductForm.vue -->
<!-- Create/edit a Cafetería product (food, promo items, uniforms). A product is an
     event with kind = 'product'; its price, quantity and currency live on one ticket tier. -->
<template>
  <form class="product-form" @submit.prevent>
    <p class="account-notice">{{ t.accountNotice }}</p>

    <section class="form-card">
      <div class="field">
        <label>{{ t.product }} <span class="required">*</span></label>
        <input
          ref="nameInputRef"
          v-model="form.name"
          type="text"
          class="input-lg"
          :placeholder="t.productPlaceholder"
          maxlength="255"
        />
      </div>

      <div class="field">
        <label>{{ t.description }}</label>
        <textarea v-model="form.description" rows="4" :placeholder="t.descriptionPlaceholder"></textarea>
      </div>

      <div class="field-row">
        <div class="field">
          <label>{{ t.quantity }}</label>
          <input v-model="form.quantity" type="number" min="1" step="1" :placeholder="t.unlimited" />
          <span v-if="soldCount > 0" class="field-hint">{{ soldCount }} {{ t.sold }}</span>
        </div>

        <div class="field">
          <label>{{ t.price }} <span class="required">*</span></label>
          <input v-model="form.price" type="number" min="0" step="0.01" placeholder="0.00" />
        </div>

        <div class="field">
          <label>{{ t.currency }} <span class="required">*</span></label>
          <select v-model="form.currency">
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>
    </section>

    <div v-if="error" class="form-error">{{ error }}</div>

    <div class="form-actions">
      <template v-if="isEdit">
        <button type="button" class="btn-primary" :disabled="!isValid || submitting" @click="submit(false)">
          {{ submitting ? t.saving : t.saveChanges }}
        </button>
      </template>
      <template v-else>
        <button type="button" class="btn-secondary" :disabled="!isValid || submitting" @click="submit(false)">
          {{ t.saveDraft }}
        </button>
        <button type="button" class="btn-primary" :disabled="!isValid || submitting" @click="submit(true)">
          {{ submitting ? t.saving : t.publish }}
        </button>
      </template>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { translateError } from '~/utils/errorTranslations'

const { t: createT, language } = useLanguage()

const translations = {
  accountNotice: { es: 'Los pagos se depositan en la cuenta de Cafetería.', en: 'Payments go to the Cafetería account.' },
  product: { es: 'Producto', en: 'Product' },
  productPlaceholder: { es: 'Ej. Playera de uniforme', en: 'e.g. Uniform shirt' },
  description: { es: 'Descripción', en: 'Description' },
  descriptionPlaceholder: { es: 'Tallas, colores, contenido...', en: 'Sizes, colors, contents...' },
  quantity: { es: 'Cantidad', en: 'Quantity' },
  unlimited: { es: 'Sin límite', en: 'Unlimited' },
  sold: { es: 'vendidos', en: 'sold' },
  price: { es: 'Precio', en: 'Price' },
  currency: { es: 'Moneda', en: 'Currency' },
  saveDraft: { es: 'Guardar borrador', en: 'Save draft' },
  publish: { es: 'Publicar producto', en: 'Publish product' },
  saveChanges: { es: 'Guardar cambios', en: 'Save changes' },
  saving: { es: 'Guardando...', en: 'Saving...' },
  failedToSave: { es: 'No se pudo guardar el producto', en: 'Failed to save product' }
}

const t = createT(translations)

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['saved'])

const { createEvent, updateEvent, publishEvent } = useEvents()
const { createTicketTier, updateTicketTier } = useTicketTiers()

const isEdit = computed(() => !!props.initialData)

const submitting = ref(false)
const error = ref('')
const nameInputRef = ref(null)
const savedSlug = ref(props.initialData?.slug || '')
const tierId = ref(null)
const soldCount = ref(0)

const form = reactive({
  name: '',
  description: '',
  quantity: '',
  price: '',
  currency: 'MXN'
})

const isValid = computed(() => form.name.trim() && form.price !== '' && Number(form.price) >= 0)

const tierPayload = () => ({
  name: form.name.trim(),
  price: Number(form.price),
  currency: form.currency,
  quantity: form.quantity === '' || form.quantity === null ? null : Number(form.quantity)
})

const submit = async (publish) => {
  if (!isValid.value) return
  submitting.value = true
  error.value = ''

  try {
    const productData = {
      name: form.name.trim(),
      description: form.description.trim() || null
    }

    let slug = savedSlug.value
    if (slug) {
      await updateEvent(slug, productData)
    } else {
      const response = await createEvent({ ...productData, kind: 'product' })
      slug = response.event.slug
      savedSlug.value = slug
    }

    if (tierId.value) {
      await updateTicketTier(slug, tierId.value, tierPayload())
    } else {
      const response = await createTicketTier(slug, tierPayload())
      tierId.value = response.tier?.id || null
    }

    if (publish) {
      await publishEvent(slug)
    }

    emit('saved', { slug, published: publish })
  } catch (e) {
    error.value = translateError(e.message, language.value) || t.failedToSave
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const data = props.initialData
  if (data) {
    const tier = [...(data.ticket_tiers || [])].sort((a, b) => a.id - b.id)[0]
    form.name = data.name || ''
    form.description = data.description || ''
    if (tier) {
      tierId.value = tier.id
      soldCount.value = tier.quantity_sold || 0
      form.quantity = tier.quantity ?? ''
      form.price = tier.price ?? ''
      form.currency = tier.currency || 'MXN'
    }
    return
  }

  await nextTick()
  nameInputRef.value?.focus()
})
</script>

<style scoped>
.product-form {
  --color-primary: #1a1a1a;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-error: #c73e1d;

  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
}

.account-notice {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-muted);
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr 120px;
  gap: 12px;
}

.field label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.required {
  color: var(--color-error);
}

.field-hint {
  font-size: 12px;
  color: var(--color-text-muted);
}

input,
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 15px;
  font-family: inherit;
  color: var(--color-text);
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-sizing: border-box;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.08);
}

.input-lg {
  font-size: 18px;
  font-weight: 600;
}

.form-error {
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-error);
  background: rgba(199, 62, 29, 0.06);
  border-radius: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
}

.btn-primary {
  color: #ffffff;
  background: var(--color-primary);
  border: none;
}

.btn-secondary {
  color: var(--color-text);
  background: #ffffff;
  border: 1px solid var(--color-border);
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .form-card {
    padding: 16px;
  }

  .field-row {
    grid-template-columns: 1fr 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
