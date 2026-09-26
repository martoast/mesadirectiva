<!-- components/admin/ProductForm.vue -->
<!-- Create/edit a store product. Products are events with kind = 'product':
     variants are ticket tiers, money always goes to the Tiendita Stripe account. -->
<template>
  <form class="product-form" @submit.prevent>
    <!-- Payment account notice -->
    <div class="account-notice">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <span>{{ t.accountNotice }}</span>
    </div>

    <!-- Product -->
    <section class="form-card">
      <h2 class="card-title">{{ t.productSection }}</h2>

      <div class="field">
        <label>{{ t.productName }} <span class="required">*</span></label>
        <input
          ref="nameInputRef"
          v-model="form.name"
          type="text"
          class="input-lg"
          :placeholder="t.productNamePlaceholder"
          maxlength="255"
        />
      </div>

      <div class="field">
        <label>{{ t.group }} <span class="required">*</span></label>
        <select v-model="form.group_id">
          <option value="">{{ t.selectGroup }}</option>
          <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
        </select>
      </div>

      <div class="field">
        <label>{{ t.image }} <span class="optional">({{ t.optional }})</span></label>
        <AdminEventImageUpload
          v-model="pendingImageFile"
          :existing-url="existingImageUrl"
          @clear="existingImageUrl = ''"
        />
      </div>

      <div class="field">
        <label>{{ t.description }} <span class="optional">({{ t.optional }})</span></label>
        <AdminRichTextEditor v-model="form.description" :placeholder="t.descriptionPlaceholder" />
      </div>
    </section>

    <!-- Variants -->
    <section class="form-card">
      <h2 class="card-title">{{ t.variantsSection }}</h2>
      <p class="card-hint">{{ t.variantsHint }}</p>

      <div class="variant-head">
        <span>{{ t.variantName }}</span>
        <span>{{ t.price }}</span>
        <span>{{ t.stock }}</span>
        <span></span>
      </div>

      <div
        v-for="(variant, index) in variants"
        :key="variant.key"
        :class="['variant-row', !variant.is_active && 'inactive']"
      >
        <input
          v-model="variant.name"
          type="text"
          class="variant-name"
          :placeholder="t.variantNamePlaceholder"
          :aria-label="t.variantName"
          maxlength="255"
        />
        <div class="price-input">
          <span>$</span>
          <input
            v-model="variant.price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            :aria-label="t.price"
          />
        </div>
        <input
          v-model="variant.quantity"
          type="number"
          min="1"
          step="1"
          class="variant-stock"
          :placeholder="t.unlimited"
          :aria-label="t.stock"
        />
        <div class="variant-actions">
          <button
            v-if="variant.quantity_sold > 0"
            type="button"
            class="toggle-active"
            :title="variant.is_active ? t.pauseVariant : t.resumeVariant"
            @click="variant.is_active = !variant.is_active"
          >
            {{ variant.is_active ? t.pause : t.resume }}
          </button>
          <button
            v-else
            type="button"
            class="remove-btn"
            :disabled="variants.length === 1"
            :title="t.removeVariant"
            @click="removeVariant(index)"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <span v-if="variant.quantity_sold > 0" class="variant-sold">
          {{ variant.quantity_sold }} {{ t.sold }}{{ variant.is_active ? '' : ` · ${t.paused}` }}
        </span>
      </div>

      <button type="button" class="add-variant" @click="addVariant()">+ {{ t.addVariant }}</button>
    </section>

    <!-- Availability -->
    <section class="form-card">
      <h2 class="card-title">{{ t.availabilitySection }}</h2>

      <div class="field">
        <label>{{ t.availableUntil }} <span class="optional">({{ t.optional }})</span></label>
        <input v-model="form.ends_at" type="datetime-local" />
        <span class="field-hint">{{ t.availableUntilHint }}</span>
      </div>

      <div class="settings-list">
        <label class="setting-item">
          <input v-model="form.show_remaining" type="checkbox" />
          <span class="setting-content">
            <strong>{{ t.showRemaining }}</strong>
            <span>{{ t.showRemainingDesc }}</span>
          </span>
        </label>
        <label class="setting-item">
          <input v-model="form.is_private" type="checkbox" />
          <span class="setting-content">
            <strong>{{ t.privateProduct }}</strong>
            <span>{{ t.privateProductDesc }}</span>
          </span>
        </label>
      </div>
    </section>

    <!-- Pickup -->
    <section class="form-card">
      <h2 class="card-title">{{ t.pickupSection }}</h2>

      <div class="field">
        <label>{{ t.pickupLocation }} <span class="optional">({{ t.optional }})</span></label>
        <input v-model="form.pickup_location" type="text" :placeholder="t.pickupLocationPlaceholder" maxlength="255" />
      </div>

      <div class="field">
        <label>{{ t.pickupInstructions }} <span class="optional">({{ t.optional }})</span></label>
        <textarea
          v-model="form.pickup_instructions"
          rows="3"
          :placeholder="t.pickupInstructionsPlaceholder"
          maxlength="1000"
        ></textarea>
        <span class="field-hint">{{ t.pickupInstructionsHint }}</span>
      </div>
    </section>

    <!-- Buyer fields -->
    <section class="form-card">
      <h2 class="card-title">{{ t.buyerSection }}</h2>
      <div class="settings-list">
        <label class="setting-item">
          <input v-model="form.checkout_settings.collect_student_fields" type="checkbox" />
          <span class="setting-content">
            <strong>{{ t.collectStudentFields }}</strong>
            <span>{{ t.collectStudentFieldsDesc }}</span>
          </span>
        </label>
        <label v-if="form.checkout_settings.collect_student_fields" class="setting-item">
          <input v-model="form.checkout_settings.require_student_fields" type="checkbox" />
          <span class="setting-content">
            <strong>{{ t.requireStudentFields }}</strong>
            <span>{{ t.requireStudentFieldsDesc }}</span>
          </span>
        </label>
        <label v-if="form.checkout_settings.collect_student_fields" class="setting-item">
          <input v-model="form.checkout_settings.require_attendee_note" type="checkbox" />
          <span class="setting-content">
            <strong>{{ t.requireNote }}</strong>
            <span>{{ t.requireNoteDesc }}</span>
          </span>
        </label>
      </div>
    </section>

    <!-- Error -->
    <div v-if="error" class="form-error">{{ error }}</div>

    <!-- Actions -->
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
    <p v-if="!isValid" class="missing-hint">{{ t.missingHint }}</p>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { isoToLocal, localToISO } from '~/utils/dateTime'
import { translateError } from '~/utils/errorTranslations'

const { t: createT, language } = useLanguage()

const translations = {
  accountNotice: { es: 'Los pagos de productos se depositan en la cuenta de Stripe de la Tiendita.', en: 'Product payments go to the Tiendita Stripe account.' },
  productSection: { es: 'Producto', en: 'Product' },
  productName: { es: 'Nombre del producto', en: 'Product name' },
  productNamePlaceholder: { es: 'Ej. Playera de entrenamiento', en: 'e.g. Training shirt' },
  group: { es: 'Grupo', en: 'Group' },
  selectGroup: { es: 'Selecciona un grupo', en: 'Select a group' },
  image: { es: 'Foto del producto', en: 'Product photo' },
  description: { es: 'Descripción', en: 'Description' },
  descriptionPlaceholder: { es: 'Materiales, tallas, colores, cuidados...', en: 'Materials, sizes, colors, care...' },
  optional: { es: 'opcional', en: 'optional' },
  variantsSection: { es: 'Variantes y precios', en: 'Variants & prices' },
  variantsHint: { es: 'Agrega una fila por cada opción que se puede comprar (talla, color, modelo). Deja existencias vacío si no hay límite.', en: 'Add one row per option buyers can choose (size, color, model). Leave stock empty for unlimited.' },
  variantName: { es: 'Variante', en: 'Variant' },
  variantNamePlaceholder: { es: 'Ej. Talla M · Azul', en: 'e.g. Size M · Blue' },
  price: { es: 'Precio', en: 'Price' },
  stock: { es: 'Existencias', en: 'Stock' },
  unlimited: { es: 'Sin límite', en: 'Unlimited' },
  addVariant: { es: 'Agregar variante', en: 'Add variant' },
  removeVariant: { es: 'Quitar variante', en: 'Remove variant' },
  sold: { es: 'vendidos', en: 'sold' },
  pause: { es: 'Pausar', en: 'Pause' },
  resume: { es: 'Reactivar', en: 'Resume' },
  paused: { es: 'pausada', en: 'paused' },
  pauseVariant: { es: 'Ya tiene ventas: se puede pausar pero no eliminar', en: 'Has sales: can be paused but not deleted' },
  resumeVariant: { es: 'Volver a vender esta variante', en: 'Sell this variant again' },
  availabilitySection: { es: 'Disponibilidad', en: 'Availability' },
  availableUntil: { es: 'Disponible hasta', en: 'Available until' },
  availableUntilHint: { es: 'Después de esta fecha el producto deja de venderse. Déjalo vacío para venderlo sin fecha límite.', en: 'After this date the product stops selling. Leave empty to sell with no end date.' },
  showRemaining: { es: 'Mostrar existencias restantes', en: 'Show remaining stock' },
  showRemainingDesc: { es: 'Los compradores ven cuántas piezas quedan', en: 'Buyers see how many are left' },
  privateProduct: { es: 'Producto privado', en: 'Private product' },
  privateProductDesc: { es: 'No aparece en la tienda; solo con el enlace directo', en: 'Hidden from the store; only reachable by direct link' },
  pickupSection: { es: 'Entrega', en: 'Pickup' },
  pickupLocation: { es: 'Lugar de entrega', en: 'Pickup location' },
  pickupLocationPlaceholder: { es: 'Ej. Oficina de la Mesa Directiva', en: 'e.g. Board office' },
  pickupInstructions: { es: 'Instrucciones de entrega', en: 'Pickup instructions' },
  pickupInstructionsPlaceholder: { es: 'Ej. Se entrega a partir del 15 de octubre en horario de salida.', en: 'e.g. Available for pickup from October 15 at dismissal time.' },
  pickupInstructionsHint: { es: 'Se incluyen en el comprobante que recibe el comprador por correo.', en: 'Included in the receipt the buyer gets by email.' },
  buyerSection: { es: 'Datos del comprador', en: 'Buyer information' },
  collectStudentFields: { es: 'Pedir datos del alumno', en: 'Collect student info' },
  collectStudentFieldsDesc: { es: 'Nombre y clave del alumno por cada pieza', en: 'Student name and key for each item' },
  requireStudentFields: { es: 'Nombre y clave obligatorios', en: 'Require name and key' },
  requireStudentFieldsDesc: { es: 'El comprador debe llenarlos para pagar', en: 'Buyer must fill them in to pay' },
  requireNote: { es: 'Notas obligatorias', en: 'Require notes' },
  requireNoteDesc: { es: 'Útil para pedir talla, número o personalización', en: 'Useful for size, number or personalization' },
  saveDraft: { es: 'Guardar borrador', en: 'Save draft' },
  publish: { es: 'Publicar producto', en: 'Publish product' },
  saveChanges: { es: 'Guardar cambios', en: 'Save changes' },
  saving: { es: 'Guardando...', en: 'Saving...' },
  missingHint: { es: 'Completa nombre, grupo y al menos una variante con nombre y precio.', en: 'Fill in name, group and at least one variant with a name and price.' },
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

const { getGroups } = useGroups()
const { createEvent, updateEvent, uploadEventImage, publishEvent } = useEvents()
const { createTicketTier, updateTicketTier, deleteTicketTier } = useTicketTiers()

const isEdit = computed(() => !!props.initialData)

const groups = ref([])
const submitting = ref(false)
const error = ref('')
const nameInputRef = ref(null)
const pendingImageFile = ref(null)
const existingImageUrl = ref('')
const savedSlug = ref(props.initialData?.slug || '')
const removedVariantIds = ref([])

let variantKey = 0
const newVariant = (data = {}) => ({
  key: ++variantKey,
  id: data.id || null,
  name: data.name || '',
  price: data.price ?? '',
  quantity: data.quantity ?? '',
  quantity_sold: data.quantity_sold || 0,
  is_active: data.is_active !== false
})

const variants = ref([newVariant()])

const form = reactive({
  name: '',
  group_id: '',
  description: '',
  ends_at: '',
  show_remaining: false,
  is_private: false,
  pickup_location: '',
  pickup_instructions: '',
  checkout_settings: {
    collect_student_fields: true,
    require_student_fields: false,
    require_attendee_note: false
  }
})

const isValidVariant = (v) => v.name.trim() && v.price !== '' && Number(v.price) >= 0

const isValid = computed(() => {
  return form.name.trim() && form.group_id && variants.value.length > 0 && variants.value.every(isValidVariant)
})

const addVariant = () => {
  variants.value.push(newVariant())
}

const removeVariant = (index) => {
  const [removed] = variants.value.splice(index, 1)
  if (removed?.id) removedVariantIds.value.push(removed.id)
}

const productPayload = () => ({
  name: form.name.trim(),
  group_id: form.group_id,
  description: form.description || null,
  ends_at: form.ends_at ? localToISO(form.ends_at) : null,
  location_type: 'venue',
  location: {
    name: form.pickup_location.trim() || null,
    instructions: form.pickup_instructions.trim() || null
  },
  show_remaining: form.show_remaining,
  is_private: form.is_private,
  checkout_settings: { ...form.checkout_settings }
})

const variantPayload = (v, index) => ({
  name: v.name.trim(),
  price: Number(v.price),
  quantity: v.quantity === '' || v.quantity === null ? null : Number(v.quantity),
  sort_order: index,
  is_active: v.is_active
})

const syncVariants = async (slug) => {
  for (const id of removedVariantIds.value) {
    await deleteTicketTier(slug, id)
  }
  removedVariantIds.value = []

  for (const [index, variant] of variants.value.entries()) {
    const payload = variantPayload(variant, index)
    if (variant.id) {
      await updateTicketTier(slug, variant.id, payload)
    } else {
      const response = await createTicketTier(slug, payload)
      variant.id = response.tier?.id || null
    }
  }
}

const submit = async (publish) => {
  if (!isValid.value) return
  submitting.value = true
  error.value = ''

  try {
    let slug = savedSlug.value
    if (slug) {
      const payload = productPayload()
      // Photo removed in the uploader and not replaced
      if (props.initialData?.image_url && !existingImageUrl.value && !pendingImageFile.value) {
        payload.image = null
      }
      await updateEvent(slug, payload)
    } else {
      const response = await createEvent({ ...productPayload(), kind: 'product' })
      slug = response.event.slug
      savedSlug.value = slug
    }

    if (pendingImageFile.value instanceof File) {
      const response = await uploadEventImage(slug, pendingImageFile.value)
      existingImageUrl.value = response.url || existingImageUrl.value
      pendingImageFile.value = null
    }

    await syncVariants(slug)

    let published = false
    if (publish) {
      await publishEvent(slug)
      published = true
    }

    emit('saved', { slug, published })
  } catch (e) {
    error.value = translateError(e.message, language.value) || t.failedToSave
  } finally {
    submitting.value = false
  }
}

const loadInitialData = () => {
  const data = props.initialData
  if (!data) return

  form.name = data.name || ''
  form.group_id = data.group_id || data.group?.id || ''
  form.description = data.description || ''
  form.ends_at = data.ends_at ? isoToLocal(data.ends_at) : ''
  form.show_remaining = !!data.show_remaining
  form.is_private = !!data.is_private
  form.pickup_location = data.location?.name || ''
  form.pickup_instructions = data.location?.instructions || ''
  form.checkout_settings = {
    collect_student_fields: data.checkout_settings?.collect_student_fields !== false,
    require_student_fields: data.checkout_settings?.require_student_fields === true,
    require_attendee_note: data.checkout_settings?.require_attendee_note === true
  }
  existingImageUrl.value = data.image_url || ''

  const tiers = [...(data.ticket_tiers || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id)
  variants.value = tiers.length ? tiers.map(newVariant) : [newVariant()]
}

onMounted(async () => {
  try {
    const response = await getGroups()
    groups.value = response.groups || []
  } catch (e) {
    // Group list failure surfaces as an empty select
  }

  loadInitialData()

  if (!isEdit.value) {
    await nextTick()
    nameInputRef.value?.focus()
  }
})
</script>

<style scoped>
.product-form {
  --color-primary: #1a1a1a;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-bg-subtle: #f9fafb;
  --color-error: #c73e1d;
  --radius: 12px;

  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 720px;
}

.account-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  font-size: 14px;
  color: #264653;
  background: rgba(38, 70, 83, 0.06);
  border: 1px solid rgba(38, 70, 83, 0.15);
  border-radius: var(--radius);
}

.account-notice svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.card-hint {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: -8px 0 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.required {
  color: var(--color-error);
}

.optional {
  font-weight: 400;
  color: var(--color-text-muted);
}

.field-hint {
  font-size: 12px;
  color: var(--color-text-muted);
}

input[type='text'],
input[type='number'],
input[type='datetime-local'],
select,
textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 15px;
  color: var(--color-text);
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-family: inherit;
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
  font-size: 18px !important;
  font-weight: 600;
}

/* Variants */
.variant-head,
.variant-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 110px 110px 72px;
  gap: 8px;
  align-items: center;
}

.variant-head span {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.variant-row.inactive input {
  color: var(--color-text-muted);
  background: var(--color-bg-subtle);
}

.price-input {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding-left: 10px;
  background: #ffffff;
}

.price-input span {
  color: var(--color-text-muted);
  font-size: 14px;
}

.price-input input {
  border: none;
  padding-left: 4px;
}

.price-input input:focus {
  box-shadow: none;
}

.variant-actions {
  display: flex;
  justify-content: flex-end;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
}

.remove-btn:hover:not(:disabled) {
  color: var(--color-error);
  border-color: var(--color-error);
}

.remove-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.remove-btn svg {
  width: 16px;
  height: 16px;
}

.toggle-active {
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
}

.variant-sold {
  grid-column: 1 / -1;
  margin-top: -4px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.add-variant {
  align-self: flex-start;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
}

/* Settings */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
}

.setting-item input {
  margin-top: 3px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.setting-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.setting-content strong {
  font-size: 14px;
  color: var(--color-text);
}

.setting-content span {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* Actions */
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

.missing-hint {
  margin: -8px 0 0;
  text-align: right;
  font-size: 12px;
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .form-card {
    padding: 16px;
  }

  .variant-head {
    display: none;
  }

  .variant-row {
    grid-template-columns: 1fr 1fr 44px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--color-border);
  }

  .variant-name {
    grid-column: 1 / -1;
  }

  .variant-actions {
    grid-column: 3;
    grid-row: 2;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
