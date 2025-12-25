<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ tier ? 'Edit Ticket Tier' : 'Add Ticket Tier' }}
    </h3>

    <UiBaseInput
      id="tier-name"
      v-model="form.name"
      label="Tier Name"
      placeholder="e.g., General, VIP, Premium"
      required
      :error="errors.name"
    />

    <UiBaseTextarea
      id="tier-description"
      v-model="form.description"
      label="Description"
      placeholder="Describe what's included with this tier"
      :rows="2"
    />

    <div class="grid grid-cols-2 gap-4">
      <UiBaseInput
        id="tier-price"
        v-model="form.price"
        type="number"
        label="Price"
        placeholder="100.00"
        required
        :error="errors.price"
      />

      <UiBaseInput
        id="tier-max-quantity"
        v-model="form.max_quantity"
        type="number"
        label="Max Quantity"
        placeholder="Leave empty for unlimited"
        :error="errors.max_quantity"
      />
    </div>

    <!-- Early Bird Section -->
    <div class="border-t pt-4 mt-4">
      <div class="flex items-center gap-2 mb-3">
        <input
          id="enable-early-bird"
          v-model="enableEarlyBird"
          type="checkbox"
          class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label for="enable-early-bird" class="text-sm font-medium text-gray-700">
          Enable Early Bird Pricing
        </label>
      </div>

      <div v-if="enableEarlyBird" class="grid grid-cols-2 gap-4 mt-3">
        <UiBaseInput
          id="tier-early-bird-price"
          v-model="form.early_bird_price"
          type="number"
          label="Early Bird Price"
          placeholder="80.00"
          :error="errors.early_bird_price"
        />

        <UiBaseInput
          id="tier-early-bird-deadline"
          v-model="form.early_bird_deadline"
          type="datetime-local"
          label="Early Bird Deadline"
          :error="errors.early_bird_deadline"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UiBaseInput
        id="tier-sort-order"
        v-model="form.sort_order"
        type="number"
        label="Sort Order"
        placeholder="1"
      />

      <div class="flex items-center gap-2 pt-6">
        <input
          id="tier-is-active"
          v-model="form.is_active"
          type="checkbox"
          class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label for="tier-is-active" class="text-sm font-medium text-gray-700">
          Active
        </label>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t">
      <UiBaseButton type="button" variant="secondary" @click="$emit('cancel')">
        Cancel
      </UiBaseButton>
      <UiBaseButton type="submit" :disabled="loading">
        {{ loading ? 'Saving...' : (tier ? 'Update Tier' : 'Create Tier') }}
      </UiBaseButton>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  tier: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const enableEarlyBird = ref(false)

const form = ref({
  name: '',
  description: '',
  price: '',
  early_bird_price: '',
  early_bird_deadline: '',
  max_quantity: '',
  sort_order: 1,
  is_active: true
})

const formatDatetimeLocal = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toISOString().slice(0, 16)
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    price: '',
    early_bird_price: '',
    early_bird_deadline: '',
    max_quantity: '',
    sort_order: 1,
    is_active: true
  }
  enableEarlyBird.value = false
}

// Initialize form with tier data if editing
watch(() => props.tier, (newTier) => {
  if (newTier) {
    form.value = {
      name: newTier.name || '',
      description: newTier.description || '',
      price: newTier.price || '',
      early_bird_price: newTier.early_bird_price || '',
      early_bird_deadline: newTier.early_bird_deadline ? formatDatetimeLocal(newTier.early_bird_deadline) : '',
      max_quantity: newTier.max_quantity || '',
      sort_order: newTier.sort_order || 1,
      is_active: newTier.is_active !== false
    }
    enableEarlyBird.value = !!(newTier.early_bird_price || newTier.early_bird_deadline)
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = () => {
  const data = {
    name: form.value.name,
    description: form.value.description || null,
    price: parseFloat(form.value.price) || 0,
    max_quantity: form.value.max_quantity ? parseInt(form.value.max_quantity) : null,
    sort_order: parseInt(form.value.sort_order) || 1,
    is_active: form.value.is_active
  }

  if (enableEarlyBird.value) {
    data.early_bird_price = form.value.early_bird_price ? parseFloat(form.value.early_bird_price) : null
    data.early_bird_deadline = form.value.early_bird_deadline || null
  } else {
    data.early_bird_price = null
    data.early_bird_deadline = null
  }

  emit('submit', data)
}
</script>
