<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="handleBackdropClick"
    >
      <div
        class="bg-white rounded-xl shadow-modal p-6 max-w-sm w-full mx-4"
        @click.stop
      >
        <h3 class="text-xl font-bold text-gray-900 mb-2">
          {{ title }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ message }}
        </p>
        <div class="flex gap-3 justify-end">
          <BaseButton
            variant="secondary"
            @click="$emit('cancel')"
          >
            {{ cancelText }}
          </BaseButton>
          <BaseButton
            variant="danger"
            @click="$emit('confirm')"
          >
            {{ confirmText }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import BaseButton from '../ui/BaseButton.vue'
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleBackdropClick = () => {
  if (closeOnBackdrop) {
    emit('cancel')
  }
}
</script>
