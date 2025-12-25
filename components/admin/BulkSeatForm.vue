<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Bulk Create Seats</h3>

    <p class="text-sm text-gray-500">
      Quickly create multiple seats with a naming pattern.
    </p>

    <div class="grid grid-cols-2 gap-4">
      <UiBaseInput
        id="bulk-prefix"
        v-model="form.prefix"
        label="Label Prefix"
        placeholder="e.g., A, Seat-"
        required
      />

      <UiBaseInput
        id="bulk-count"
        v-model="form.count"
        type="number"
        label="Number of Seats"
        placeholder="8"
        required
        :min="1"
        :max="50"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UiBaseInput
        id="bulk-start"
        v-model="form.start_number"
        type="number"
        label="Start Number"
        placeholder="1"
      />

      <UiBaseInput
        id="bulk-price"
        v-model="form.price"
        type="number"
        label="Price (each)"
        placeholder="200.00"
        required
      />
    </div>

    <!-- Preview -->
    <div v-if="previewLabels.length > 0" class="bg-gray-50 rounded-lg p-4">
      <p class="text-sm font-medium text-gray-700 mb-2">Preview:</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="label in previewLabels"
          :key="label"
          class="inline-flex items-center px-2 py-1 rounded bg-white border text-sm"
        >
          {{ label }}
        </span>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t">
      <UiBaseButton type="button" variant="secondary" @click="$emit('cancel')">
        Cancel
      </UiBaseButton>
      <UiBaseButton type="submit" :disabled="loading || previewLabels.length === 0">
        {{ loading ? 'Creating...' : `Create ${previewLabels.length} Seats` }}
      </UiBaseButton>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  prefix: '',
  count: 8,
  start_number: 1,
  price: ''
})

const previewLabels = computed(() => {
  if (!form.value.prefix || !form.value.count) return []

  const labels = []
  const count = Math.min(parseInt(form.value.count) || 0, 50)
  const start = parseInt(form.value.start_number) || 1

  for (let i = 0; i < count; i++) {
    labels.push(`${form.value.prefix}${start + i}`)
  }

  return labels
})

const handleSubmit = () => {
  const seats = previewLabels.value.map(label => ({
    label,
    price: parseFloat(form.value.price) || 0,
    is_active: true
  }))

  emit('submit', seats)
}
</script>
