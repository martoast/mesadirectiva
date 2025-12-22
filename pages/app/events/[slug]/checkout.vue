<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-24">
        <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading checkout...</p>
      </div>

      <!-- Cannot Purchase State -->
      <div v-else-if="!canPurchase" class="text-center py-24">
        <div class="bg-white rounded-xl shadow-card p-8 max-w-md mx-auto">
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Cannot Complete Purchase</h1>
          <p class="text-gray-600 mb-6">{{ blockedMessage }}</p>
          <NuxtLink
            :to="`/app/events/${route.params.slug}`"
            class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Back to Event
          </NuxtLink>
        </div>
      </div>

      <!-- Checkout Form -->
      <div v-else>
        <!-- Header -->
        <div class="mb-8">
          <NuxtLink
            :to="`/app/events/${route.params.slug}`"
            class="text-primary-600 hover:text-primary-700 text-sm mb-4 inline-block"
          >
            Back to Event
          </NuxtLink>
          <h1 class="text-3xl font-bold text-gray-900">Checkout</h1>
          <p class="text-gray-600 mt-1">{{ event?.name }}</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Form Section -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {{ error }}
            </div>

            <!-- Customer Information -->
            <div class="bg-white rounded-xl shadow-card p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div class="space-y-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    v-model="form.customer_name"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    v-model="form.customer_email"
                    type="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    v-model="form.customer_phone"
                    type="tel"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            <!-- Tickets -->
            <div class="bg-white rounded-xl shadow-card p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Tickets</h2>
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">{{ event?.name }} - Ticket</p>
                  <p class="text-sm text-gray-600">${{ event?.price }} each</p>
                </div>
                <div class="flex items-center gap-3">
                  <button
                    @click="decrementTickets"
                    :disabled="form.tickets <= 1"
                    class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span class="text-xl font-bold w-8 text-center">{{ form.tickets }}</span>
                  <button
                    @click="incrementTickets"
                    :disabled="form.tickets >= maxTickets"
                    class="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                {{ availability?.tickets_available }} tickets available
              </p>
            </div>

            <!-- Extra Items -->
            <div v-if="availableItems.length > 0" class="bg-white rounded-xl shadow-card p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Add-ons (Optional)</h2>
              <div class="space-y-4">
                <div
                  v-for="item in availableItems"
                  :key="item.id"
                  class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p class="font-medium text-gray-900">{{ item.name }}</p>
                    <p class="text-sm text-gray-600">${{ item.price }} each</p>
                    <p class="text-xs text-gray-500">{{ item.available_quantity }} available</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <button
                      @click="decrementItem(item.id)"
                      :disabled="getItemQuantity(item.id) <= 0"
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span class="text-lg font-bold w-6 text-center">{{ getItemQuantity(item.id) }}</span>
                    <button
                      @click="incrementItem(item.id)"
                      :disabled="getItemQuantity(item.id) >= item.available_quantity"
                      class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-card p-6 sticky top-24">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <!-- Line Items -->
              <div class="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Tickets x {{ form.tickets }}</span>
                  <span class="font-medium text-gray-900">${{ ticketSubtotal.toFixed(2) }}</span>
                </div>
                <div
                  v-for="item in selectedItems"
                  :key="item.id"
                  class="flex justify-between text-sm"
                >
                  <span class="text-gray-600">{{ item.name }} x {{ item.quantity }}</span>
                  <span class="font-medium text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>

              <!-- Total -->
              <div class="flex justify-between mb-6">
                <span class="text-lg font-bold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-primary-600">${{ orderTotal.toFixed(2) }}</span>
              </div>

              <!-- Submit Button -->
              <button
                @click="handleSubmit"
                :disabled="submitting || !isFormValid"
                class="w-full py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="submitting" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>Proceed to Payment</span>
              </button>

              <p class="text-xs text-gray-500 text-center mt-4">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'public',
  middleware: ['auth']
})

const route = useRoute()
const { getPublicEvent, checkAvailability } = useEvents()
const { createCheckoutSession } = useCheckout()

const event = ref(null)
const availability = ref(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

const form = ref({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  tickets: 1,
  extra_items: {}
})

// Load event and availability
onMounted(async () => {
  try {
    const [eventResponse, availabilityResponse] = await Promise.all([
      getPublicEvent(route.params.slug),
      checkAvailability(route.params.slug)
    ])

    event.value = eventResponse.event
    availability.value = availabilityResponse
  } catch (e) {
    error.value = e.message || 'Failed to load event'
  } finally {
    loading.value = false
  }
})

// Computed properties
const canPurchase = computed(() => availability.value?.can_purchase ?? false)

const blockedMessage = computed(() => {
  const messages = {
    not_live: 'This event is not available for purchase.',
    registration_closed: 'Registration for this event is currently closed.',
    deadline_passed: 'The registration deadline has passed.',
    sold_out: 'This event is sold out.'
  }
  return messages[availability.value?.blocked_reason] || 'This event is not available for purchase.'
})

const maxTickets = computed(() => {
  return Math.min(availability.value?.tickets_available || 0, 10)
})

const availableItems = computed(() => {
  return (availability.value?.items || []).filter(item => item.available && item.available_quantity > 0)
})

const ticketSubtotal = computed(() => {
  return (event.value?.price || 0) * form.value.tickets
})

const selectedItems = computed(() => {
  return availableItems.value
    .filter(item => form.value.extra_items[item.id] > 0)
    .map(item => ({
      ...item,
      quantity: form.value.extra_items[item.id]
    }))
})

const itemsSubtotal = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const orderTotal = computed(() => {
  return ticketSubtotal.value + itemsSubtotal.value
})

const isFormValid = computed(() => {
  return form.value.customer_name.trim() &&
    form.value.customer_email.trim() &&
    form.value.customer_phone.trim() &&
    form.value.tickets > 0
})

// Methods
const incrementTickets = () => {
  if (form.value.tickets < maxTickets.value) {
    form.value.tickets++
  }
}

const decrementTickets = () => {
  if (form.value.tickets > 1) {
    form.value.tickets--
  }
}

const getItemQuantity = (itemId) => {
  return form.value.extra_items[itemId] || 0
}

const incrementItem = (itemId) => {
  const item = availableItems.value.find(i => i.id === itemId)
  const current = form.value.extra_items[itemId] || 0
  if (current < item.available_quantity) {
    form.value.extra_items[itemId] = current + 1
  }
}

const decrementItem = (itemId) => {
  const current = form.value.extra_items[itemId] || 0
  if (current > 0) {
    form.value.extra_items[itemId] = current - 1
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  submitting.value = true
  error.value = ''

  try {
    // Build extra_items array
    const extra_items = Object.entries(form.value.extra_items)
      .filter(([_, quantity]) => quantity > 0)
      .map(([item_id, quantity]) => ({ item_id: parseInt(item_id), quantity }))

    const response = await createCheckoutSession({
      event_slug: route.params.slug,
      customer_name: form.value.customer_name,
      customer_email: form.value.customer_email,
      customer_phone: form.value.customer_phone,
      tickets: form.value.tickets,
      extra_items
    })

    // Redirect to Stripe checkout
    if (response.checkout_url) {
      window.location.href = response.checkout_url
    }
  } catch (e) {
    error.value = e.message || 'Failed to create checkout session'
    submitting.value = false
  }
}
</script>
