<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ seat ? 'Edit Seat' : 'Add Seat' }}
    </h3>

    <UiBaseInput
      id="seat-label"
      v-model="form.label"
      label="Seat Label"
      placeholder="e.g., A1, B2, VIP-1"
      required
      :error="errors.label"
    />

    <UiBaseInput
      id="seat-price"
      v-model="form.price"
      type="number"
      label="Price"
      placeholder="200.00"
      required
      :error="errors.price"
    />

    <!-- Position (optional) -->
    <div class="border-t pt-4">
      <p class="text-sm font-medium text-gray-700 mb-3">Position (for layout)</p>
      <div class="grid grid-cols-2 gap-4">
        <UiBaseInput
          id="seat-position-x"
          v-model="form.position_x"
          type="number"
          label="X Position"
          placeholder="0"
        />
        <UiBaseInput
          id="seat-position-y"
          v-model="form.position_y"
          type="number"
          label="Y Position"
          placeholder="0"
        />
      </div>
    </div>

    <div class="flex items-center gap-2">
      <input
        id="seat-is-active"
        v-model="form.is_active"
        type="checkbox"
        class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      />
      <label for="seat-is-active" class="text-sm font-medium text-gray-700">
        Active
      </label>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t">
      <UiBaseButton type="button" variant="secondary" @click="$emit('cancel')">
        Cancel
      </UiBaseButton>
      <UiBaseButton type="submit" :disabled="loading">
        {{ loading ? 'Saving...' : (seat ? 'Update Seat' : 'Create Seat') }}
      </UiBaseButton>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  seat: {
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

const form = ref({
  label: '',
  price: '',
  position_x: 0,
  position_y: 0,
  is_active: true
})

const resetForm = () => {
  form.value = {
    label: '',
    price: '',
    position_x: 0,
    position_y: 0,
    is_active: true
  }
}

// Initialize form with seat data if editing
watch(() => props.seat, (newSeat) => {
  if (newSeat) {
    form.value = {
      label: newSeat.label || '',
      price: newSeat.price || '',
      position_x: newSeat.position_x || 0,
      position_y: newSeat.position_y || 0,
      is_active: newSeat.is_active !== false
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = () => {
  const data = {
    label: form.value.label,
    price: parseFloat(form.value.price) || 0,
    position_x: parseInt(form.value.position_x) || 0,
    position_y: parseInt(form.value.position_y) || 0,
    is_active: form.value.is_active
  }

  emit('submit', data)
}
</script>
