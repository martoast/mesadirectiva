<template>
  <div class="checkout-page">
    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>{{ t.loadingCheckout }}</p>
    </div>

    <!-- Cannot Purchase -->
    <div v-else-if="!canPurchase" class="blocked-state">
      <div class="blocked-card">
        <div class="blocked-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1>{{ t.cannotCompletePurchase }}</h1>
        <p>{{ blockedMessage }}</p>
        <NuxtLink :to="`/app/events/${route.params.slug}`" class="back-btn">{{ t.backToEvent }}</NuxtLink>
      </div>
    </div>

    <!-- Checkout Form -->
    <div v-else class="checkout-content">
      <!-- Header -->
      <header class="checkout-header">
        <NuxtLink :to="`/app/events/${route.params.slug}`" class="back-link">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ t.back }}</span>
        </NuxtLink>
        <div class="header-info">
          <h1>{{ t.checkout }}</h1>
          <p>{{ event?.name }}</p>
        </div>
      </header>

      <!-- Reservation Timer -->
      <PublicReservationTimer
        v-if="isSeatedEvent && reservationToken"
        :expires-at="reservationExpiresAt"
        @expired="handleReservationExpired"
        class="timer-banner"
      />

      <!-- Error -->
      <div v-if="error" class="error-banner">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <div class="checkout-grid">
        <!-- Form Column -->
        <div class="form-column">
          <!-- Contact Info -->
          <section class="form-section">
            <h2>{{ t.contactInformation }}</h2>
            <div class="form-fields">
              <div class="field">
                <label for="name">{{ t.fullName }} <span class="required-mark">*</span></label>
                <input id="name" v-model="form.customer_name" type="text" :placeholder="t.fullNamePlaceholder" required />
              </div>
              <div class="field">
                <label for="email">{{ t.email }} <span class="required-mark">*</span></label>
                <input
                  id="email"
                  v-model="form.customer_email"
                  type="email"
                  :placeholder="t.emailPlaceholder"
                  :class="{ 'has-error': emailTouched && !isEmailValid }"
                  @blur="emailTouched = true"
                  required
                />
                <p v-if="emailTouched && !isEmailValid" class="field-error">{{ t.invalidEmail }}</p>
                <p class="email-notice">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ t.emailNotice }}</span>
                </p>
              </div>
              <div class="field">
                <label for="phone">{{ t.phone }} <span class="required-mark">*</span></label>
                <input id="phone" v-model="form.customer_phone" type="tel" :placeholder="t.phonePlaceholder" required />
              </div>
              <div class="field">
                <label for="company">{{ t.company }} <span class="required-mark">*</span></label>
                <input id="company" v-model="form.customer_company" type="text" :placeholder="t.companyPlaceholder" required />
              </div>
            </div>
          </section>

          <!-- Ticket Tiers (General Admission) -->
          <section v-if="!isSeatedEvent && availableTiers.length > 0" class="form-section">
            <h2>{{ t.selectTickets }}</h2>

            <!-- Installment verification (parcialidades) -->
            <div v-for="tier in dependentTiers" :key="`dep-${tier.id}`" class="installment-check">
              <div class="installment-check-header">
                <strong>{{ tier.name }}</strong>
                <span>{{ t.requiresPayment }}: {{ getDependencyName(tier) }}</span>
              </div>
              <template v-if="!verifiedTiers[tier.id]">
                <p class="installment-check-hint">{{ t.verifyKeyHint }}</p>
                <div class="installment-check-row">
                  <input
                    v-model="eligibilityKeys[tier.id]"
                    type="text"
                    :placeholder="t.studentKeyPlaceholder"
                    @keyup.enter.prevent="verifyEligibility(tier)"
                  />
                  <button
                    type="button"
                    class="verify-btn"
                    :disabled="verifyingTier === tier.id || !eligibilityKeys[tier.id]?.trim()"
                    @click="verifyEligibility(tier)"
                  >
                    {{ verifyingTier === tier.id ? t.verifying : t.verify }}
                  </button>
                </div>
                <p v-if="eligibilityErrors[tier.id]" class="installment-check-error">{{ eligibilityErrors[tier.id] }}</p>
              </template>
              <p v-else class="installment-check-ok">
                ✓ {{ t.keyVerified }} ({{ verifiedTiers[tier.id] }})
              </p>
            </div>

            <PublicTicketTierSelector
              :tiers="availableTiers"
              :selections="tierSelections"
              :show-header="false"
              :locked-tiers="lockedTiers"
              @update:selections="tierSelections = $event"
            />
          </section>

          <!-- Legacy Single-Price -->
          <section v-else-if="!isSeatedEvent && availableTiers.length === 0" class="form-section">
            <h2>{{ t.tickets }}</h2>
            <div class="ticket-selector">
              <div class="ticket-info">
                <span class="ticket-name">{{ event?.name }}</span>
                <span class="ticket-price">${{ event?.price }} {{ t.each }}</span>
              </div>
              <div class="quantity-control">
                <button type="button" @click="form.tickets--" :disabled="form.tickets <= 1" class="qty-btn">−</button>
                <span class="qty-value">{{ form.tickets }}</span>
                <button type="button" @click="form.tickets++" :disabled="form.tickets >= maxTickets" class="qty-btn">+</button>
              </div>
            </div>
            <p class="available-note">{{ availability?.tickets_available }} {{ t.available }}</p>
          </section>

          <!-- Selected Seats (Seated Events) -->
          <section v-if="isSeatedEvent" class="form-section">
            <div class="section-header">
              <h2>{{ t.yourSelection }}</h2>
              <NuxtLink :to="`/app/events/${route.params.slug}/select-seats`" class="change-link">{{ t.change }}</NuxtLink>
            </div>
            <div v-if="selectedTables.length > 0 || selectedSeats.length > 0" class="selection-list">
              <div v-for="tableId in selectedTables" :key="`t-${tableId}`" class="selection-item">
                <span>{{ getTableName(tableId) }}</span>
                <span class="item-price">${{ getTablePrice(tableId) }}</span>
              </div>
              <div v-for="seatId in selectedSeats" :key="`s-${seatId}`" class="selection-item">
                <span>{{ getSeatInfo(seatId) }}</span>
                <span class="item-price">${{ getSeatPrice(seatId) }}</span>
              </div>
            </div>
            <div v-else class="no-selection">
              <p>{{ t.noSeatsSelected }}</p>
              <NuxtLink :to="`/app/events/${route.params.slug}/select-seats`" class="select-btn">{{ t.selectSeats }}</NuxtLink>
            </div>
          </section>

          <!-- Attendee Information - Tiers (student fields, per-event config) -->
          <section v-if="!isSeatedEvent && collectStudentFields && ticketEntries.length > 0" class="form-section">
            <h2>{{ t.attendeeInformation }}</h2>
            <p class="section-description">{{ t.attendeeDescription }}</p>
            <div class="attendee-list">
              <div v-for="entry in ticketEntries" :key="entry.key" class="attendee-item">
                <div class="attendee-header">
                  <span class="attendee-label">{{ entry.label }}</span>
                </div>
                <div class="attendee-fields">
                  <div class="field">
                    <label :for="`attendee-name-${entry.key}`">
                      {{ t.studentName }}<span v-if="requireStudentFields" class="required-mark"> *</span>
                    </label>
                    <input
                      :id="`attendee-name-${entry.key}`"
                      :value="getAttendeeValue(entry.key, 'name')"
                      @input="setAttendeeValue(entry.key, 'name', $event.target.value)"
                      type="text"
                      :placeholder="t.attendeeNamePlaceholder"
                      :required="requireStudentFields"
                    />
                  </div>
                  <div class="field">
                    <label :for="`attendee-key-${entry.key}`">
                      {{ t.studentKey }}<span v-if="requireStudentFields" class="required-mark"> *</span>
                    </label>
                    <input
                      :id="`attendee-key-${entry.key}`"
                      :value="getAttendeeValue(entry.key, 'key')"
                      @input="setAttendeeValue(entry.key, 'key', $event.target.value)"
                      type="text"
                      :placeholder="t.studentKeyPlaceholder"
                      :required="requireStudentFields"
                    />
                  </div>
                  <div class="field">
                    <label :for="`attendee-note-${entry.key}`">
                      {{ requireAttendeeNote ? t.note : t.noteOptional }}<span v-if="requireAttendeeNote" class="required-mark"> *</span>
                    </label>
                    <input
                      :id="`attendee-note-${entry.key}`"
                      :value="getAttendeeValue(entry.key, 'note')"
                      @input="setAttendeeValue(entry.key, 'note', $event.target.value)"
                      type="text"
                      :placeholder="t.notePlaceholder"
                      :required="requireAttendeeNote"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Attendee Information - Seated Events -->
          <section v-if="isSeatedEvent && (selectedTables.length > 0 || selectedSeats.length > 0)" class="form-section">
            <h2>{{ t.attendeeInformation }}</h2>
            <p class="section-description">{{ t.attendeeDescription }}</p>
            <div class="attendee-list">
              <!-- Tables -->
              <div v-for="tableId in selectedTables" :key="`att-t-${tableId}`" class="attendee-item">
                <div class="attendee-header">
                  <span class="attendee-label">{{ getTableName(tableId) }}</span>
                </div>
                <div class="attendee-fields">
                  <div class="field">
                    <label :for="`table-attendee-name-${tableId}`">{{ t.primaryContactName }}</label>
                    <input
                      :id="`table-attendee-name-${tableId}`"
                      :value="getTableAttendeeValue(tableId, 'name')"
                      @input="setTableAttendeeValue(tableId, 'name', $event.target.value)"
                      type="text"
                      :placeholder="t.tableHostPlaceholder"
                    />
                  </div>
                  <div class="field">
                    <label :for="`table-attendee-note-${tableId}`">{{ t.noteOptional }}</label>
                    <input
                      :id="`table-attendee-note-${tableId}`"
                      :value="getTableAttendeeValue(tableId, 'note')"
                      @input="setTableAttendeeValue(tableId, 'note', $event.target.value)"
                      type="text"
                      :placeholder="t.specialRequestsPlaceholder"
                    />
                  </div>
                </div>
              </div>
              <!-- Seats -->
              <div v-for="seatId in selectedSeats" :key="`att-s-${seatId}`" class="attendee-item">
                <div class="attendee-header">
                  <span class="attendee-label">{{ getSeatInfo(seatId) }}</span>
                </div>
                <div class="attendee-fields">
                  <div class="field">
                    <label :for="`seat-attendee-name-${seatId}`">{{ t.attendeeName }}</label>
                    <input
                      :id="`seat-attendee-name-${seatId}`"
                      :value="getSeatAttendeeValue(seatId, 'name')"
                      @input="setSeatAttendeeValue(seatId, 'name', $event.target.value)"
                      type="text"
                      :placeholder="t.attendeeNamePlaceholder"
                    />
                  </div>
                  <div class="field">
                    <label :for="`seat-attendee-note-${seatId}`">{{ t.noteOptional }}</label>
                    <input
                      :id="`seat-attendee-note-${seatId}`"
                      :value="getSeatAttendeeValue(seatId, 'note')"
                      @input="setSeatAttendeeValue(seatId, 'note', $event.target.value)"
                      type="text"
                      :placeholder="t.noteGenericPlaceholder"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Extra Items -->
          <section v-if="availableItems.length > 0" class="form-section">
            <h2>{{ t.addOns }}</h2>
            <div class="addons-list">
              <div v-for="item in availableItems" :key="item.id" class="addon-item">
                <div class="addon-info">
                  <span class="addon-name">{{ item.name }}</span>
                  <span class="addon-price">${{ item.price }}</span>
                </div>
                <div class="quantity-control small">
                  <button type="button" @click="decrementItem(item.id)" :disabled="getItemQuantity(item.id) <= 0" class="qty-btn">−</button>
                  <span class="qty-value">{{ getItemQuantity(item.id) }}</span>
                  <button type="button" @click="incrementItem(item.id)" :disabled="getItemQuantity(item.id) >= item.available_quantity" class="qty-btn">+</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Summary Column -->
        <div class="summary-column">
          <div class="summary-card">
            <h2>{{ t.orderSummary }}</h2>

            <!-- Line Items -->
            <div class="summary-items">
              <template v-if="!isSeatedEvent && hasTierSelections">
                <div v-for="(qty, tierId) in tierSelections" :key="tierId" class="summary-line">
                  <span>{{ getTierName(tierId) }} × {{ qty }}</span>
                  <span>${{ getTierLineTotal(tierId, qty) }}</span>
                </div>
              </template>
              <div v-else-if="!isSeatedEvent && availableTiers.length === 0 && form.tickets > 0" class="summary-line">
                <span>{{ t.tickets }} × {{ form.tickets }}</span>
                <span>${{ legacyTicketSubtotal.toFixed(2) }}</span>
              </div>
              <div v-for="tableId in selectedTables" :key="`sum-t-${tableId}`" class="summary-line">
                <span>{{ getTableName(tableId) }}</span>
                <span>${{ getTablePrice(tableId) }}</span>
              </div>
              <div v-for="seatId in selectedSeats" :key="`sum-s-${seatId}`" class="summary-line">
                <span>{{ getSeatLabel(seatId) }}</span>
                <span>${{ getSeatPrice(seatId) }}</span>
              </div>
              <div v-for="item in selectedItems" :key="`sum-i-${item.id}`" class="summary-line addon">
                <span>{{ item.name }} × {{ item.quantity }}</span>
                <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Total -->
            <div class="summary-total">
              <span>{{ t.total }}</span>
              <span class="total-amount">${{ orderTotal.toFixed(2) }} <span class="currency-label">MXN</span></span>
            </div>

            <!-- Submit -->
            <button
              @click="handleSubmit"
              :disabled="submitting || !isFormValid"
              class="submit-btn"
            >
              <span v-if="submitting" class="btn-loading">
                <span class="btn-spinner"></span>
                {{ t.processing }}
              </span>
              <span v-else>{{ t.proceedToPayment }}</span>
            </button>

            <p class="secure-note">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {{ t.securePayment }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { withProductLabels } from '~/utils/productLabels'

definePageMeta({
  layout: 'public'
})

const { t: createT, language } = useLanguage()

const translations = {
  // Loading and blocked states
  loadingCheckout: { es: 'Cargando pago...', en: 'Loading checkout...' },
  cannotCompletePurchase: { es: 'No se puede completar la compra', en: 'Cannot Complete Purchase' },
  backToEvent: { es: 'Volver al Evento', en: 'Back to Event' },
  back: { es: 'Volver', en: 'Back' },
  checkout: { es: 'Pago', en: 'Checkout' },

  // Blocked messages
  notAvailableForPurchase: { es: 'Este evento no está disponible para compra.', en: 'This event is not available for purchase.' },
  registrationClosed: { es: 'El registro está actualmente cerrado.', en: 'Registration is currently closed.' },
  deadlinePassed: { es: 'La fecha límite de registro ha pasado.', en: 'The registration deadline has passed.' },
  soldOut: { es: 'Este evento está agotado.', en: 'This event is sold out.' },
  notAvailable: { es: 'Este evento no está disponible.', en: 'This event is not available.' },
  salesEnded: { es: 'La venta ya terminó.', en: 'Sales have ended.' },

  // Contact Information
  contactInformation: { es: 'Información de Contacto', en: 'Contact Information' },
  fullName: { es: 'Nombre Completo', en: 'Full Name' },
  fullNamePlaceholder: { es: 'Juan Pérez', en: 'John Doe' },
  email: { es: 'Correo Electrónico', en: 'Email' },
  emailPlaceholder: { es: 'juan@ejemplo.com', en: 'john@example.com' },
  emailNotice: { es: 'Asegúrate de ingresar tu correo correctamente. Aquí recibirás tus boletos y confirmación de compra.', en: 'Make sure to enter your email correctly. You will receive your tickets and purchase confirmation here.' },
  invalidEmail: { es: 'Por favor ingresa un correo electrónico válido', en: 'Please enter a valid email address' },
  phone: { es: 'Teléfono', en: 'Phone' },
  phonePlaceholder: { es: '+52 (555) 000-0000', en: '+1 (555) 000-0000' },
  company: { es: 'Empresa / Organización', en: 'Company / Organization' },
  companyPlaceholder: { es: 'Escribe aquí cualquier dato de referencia para identificarte mejor', en: 'Write any reference data here to better identify yourself' },

  // Tickets
  selectTickets: { es: 'Seleccionar Boletos', en: 'Select Tickets' },
  tickets: { es: 'Boletos', en: 'Tickets' },
  each: { es: 'c/u', en: 'each' },
  available: { es: 'disponibles', en: 'available' },

  // Seated events
  yourSelection: { es: 'Tu Selección', en: 'Your Selection' },
  change: { es: 'Cambiar', en: 'Change' },
  noSeatsSelected: { es: 'No hay asientos seleccionados', en: 'No seats selected' },
  selectSeats: { es: 'Seleccionar Asientos', en: 'Select Seats' },

  // Attendee Information
  attendeeInformation: { es: 'Información del Asistente', en: 'Attendee Information' },
  attendeeDescription: { es: 'Para paseos o graduaciones escolares, favor de poner el nombre del alumno a quien se acreditarán los boletos. Para torneos, favor de poner el nombre del equipo.', en: 'For school trips or graduations, please enter the name of the student to whom the tickets will be credited. For tournaments, please enter the team name.' },
  attendeeName: { es: 'Nombre del Asistente', en: 'Attendee Name' },
  attendeeNamePlaceholder: { es: 'Nombre de la persona que asistirá', en: 'Name of person attending' },
  noteOptional: { es: 'Notas (opcional)', en: 'Notes (optional)' },
  note: { es: 'Notas', en: 'Notes' },
  studentName: { es: 'Nombre del alumno', en: 'Student name' },
  studentKey: { es: 'Clave del alumno', en: 'Student key' },
  studentKeyPlaceholder: { es: '(Salón + Número de lista)', en: '(Classroom + List number)' },
  requiresPayment: { es: 'Requiere', en: 'Requires' },
  verifyKeyHint: { es: 'Ingresa la clave del alumno para verificar que el pago anterior está completado.', en: 'Enter the student key to verify the previous payment is completed.' },
  verify: { es: 'Verificar', en: 'Verify' },
  verifying: { es: 'Verificando...', en: 'Verifying...' },
  keyVerified: { es: 'Clave verificada, puedes continuar', en: 'Key verified, you can continue' },
  notEligible: { es: 'Esta clave aún no tiene completado el pago requerido', en: 'This key has not completed the required payment yet' },
  verifyFailed: { es: 'No se pudo verificar. Intenta de nuevo.', en: 'Could not verify. Try again.' },
  studentFieldsRequiredError: { es: 'Completa el nombre y la clave del alumno para cada boleto.', en: 'Fill in the student name and key for every ticket.' },
  noteRequiredError: { es: 'Completa las notas para cada boleto.', en: 'Fill in the notes for every ticket.' },
  notePlaceholder: { es: '(Número de Planilla)', en: '(Planilla number)' },
  noteGenericPlaceholder: { es: 'Clave, Salón, Generación, etc.', en: 'ID, Classroom, Grade, etc.' },
  primaryContactName: { es: 'Nombre del Contacto Principal', en: 'Primary Contact Name' },
  tableHostPlaceholder: { es: 'Nombre del anfitrión de la mesa', en: 'Name of table host' },
  specialRequestsPlaceholder: { es: 'Solicitudes especiales, etc.', en: 'Special requests, etc.' },

  // Add-ons and Summary
  addOns: { es: 'Extras', en: 'Add-ons' },
  orderSummary: { es: 'Resumen del Pedido', en: 'Order Summary' },
  total: { es: 'Total', en: 'Total' },

  // Submit
  processing: { es: 'Procesando...', en: 'Processing...' },
  proceedToPayment: { es: 'Proceder al Pago', en: 'Proceed to Payment' },
  securePayment: { es: 'Pago seguro vía Stripe', en: 'Secure payment via Stripe' },

  // Errors
  reservationExpired: { es: 'Tu reservación ha expirado. Por favor selecciona tus asientos de nuevo.', en: 'Your reservation has expired. Please select your seats again.' },
  failedToLoadEvent: { es: 'Error al cargar el evento', en: 'Failed to load event' },
  failedToCreateSession: { es: 'Error al crear la sesión de pago', en: 'Failed to create checkout session' }
}

const productTranslations = {
  backToEvent: { es: 'Volver al producto', en: 'Back to product' },
  notAvailableForPurchase: { es: 'Este producto no está disponible para compra.', en: 'This product is not available for purchase.' },
  soldOut: { es: 'Este producto está agotado.', en: 'This product is sold out.' },
  notAvailable: { es: 'Este producto no está disponible.', en: 'This product is not available.' },
  salesEnded: { es: 'La venta de este producto ya terminó.', en: 'Sales for this product have ended.' },
  emailNotice: { es: 'Asegúrate de ingresar tu correo correctamente. Aquí recibirás el comprobante de tu compra.', en: 'Make sure to enter your email correctly. You will receive your purchase receipt here.' },
  selectTickets: { es: 'Elige tus artículos', en: 'Choose your items' },
  tickets: { es: 'Artículos', en: 'Items' },
  attendeeInformation: { es: 'Datos del alumno', en: 'Student information' },
  attendeeDescription: { es: 'Indica para qué alumno es cada pieza.', en: 'Tell us which student each item is for.' },
  notePlaceholder: { es: 'Talla, número o personalización', en: 'Size, number or personalization' },
  studentFieldsRequiredError: { es: 'Completa el nombre y la clave del alumno para cada pieza.', en: 'Fill in the student name and key for every item.' },
  noteRequiredError: { es: 'Completa las notas para cada pieza.', en: 'Fill in the notes for every item.' },
  failedToLoadEvent: { es: 'Error al cargar el producto', en: 'Failed to load product' }
}

// Products reuse this checkout with store wording
const isProduct = computed(() => event.value?.kind === 'product')

const t = withProductLabels(createT(translations), createT(productTranslations), isProduct)

const route = useRoute()
const router = useRouter()
const { getPublicEvent, checkAvailability } = useEvents()
const { getPublicTicketTiers, checkTierEligibility } = useTicketTiers()
const { getPublicTables } = useTables()
const { createSession } = useCheckout()

const event = ref(null)
const availability = ref(null)
const availableTiers = ref([])
const tables = ref([])
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const emailTouched = ref(false)

const form = ref({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  customer_company: '',
  tickets: 1,
  extra_items: {}
})

const tierSelections = ref({})
const selectedTables = ref([])
const selectedSeats = ref([])
const reservationToken = ref(null)
const reservationExpiresAt = ref(null)

// Attendee info for tickets
// For tiers: { 'tierId_index': { name: '', note: '' } }
// For seats: { seatId: { name: '', note: '' } }
// For tables: { tableId: { name: '', note: '' } }
const tierAttendees = ref({})
const seatAttendees = ref({})
const tableAttendees = ref({})

onMounted(async () => {
  try {
    const [eventResponse, availabilityResponse] = await Promise.all([
      getPublicEvent(route.params.slug),
      checkAvailability(route.params.slug)
    ])
    event.value = eventResponse.event
    availability.value = availabilityResponse

    if (event.value?.seating_type !== 'seated') {
      try {
        const tiersResponse = await getPublicTicketTiers(route.params.slug)
        availableTiers.value = (tiersResponse.tiers || []).filter(t => t.is_active && !t.is_hidden)

        // Override tier name for specific event
        if (route.params.slug === 'fiesta-del-60-aniversario') {
          availableTiers.value = availableTiers.value.map(t =>
            t.name === 'Boleto individual' ? { ...t, name: 'Boleto por mesa' } : t
          )
        }
      } catch (e) {
        availableTiers.value = []
      }
    }

    if (event.value?.seating_type === 'seated') {
      try {
        const tablesResponse = await getPublicTables(route.params.slug)
        tables.value = tablesResponse.tables || []
      } catch (e) {
        tables.value = []
      }

      const savedReservation = sessionStorage.getItem(`reservation_${route.params.slug}`)
      if (savedReservation) {
        const reservation = JSON.parse(savedReservation)
        reservationToken.value = reservation.token
        reservationExpiresAt.value = reservation.expires_at
        selectedTables.value = reservation.tables || []
        selectedSeats.value = reservation.seats || []
      }
    }
  } catch (e) {
    error.value = e.message || t.failedToLoadEvent
  } finally {
    loading.value = false
  }
})

const isSeatedEvent = computed(() => event.value?.seating_type === 'seated')
const canPurchase = computed(() => availability.value?.can_purchase ?? false)

// Per-event checkout field configuration (defaults keep legacy behavior)
const checkoutSettings = computed(() => event.value?.checkout_settings || {})
const collectStudentFields = computed(() => checkoutSettings.value.collect_student_fields !== false)
const requireStudentFields = computed(() => collectStudentFields.value && checkoutSettings.value.require_student_fields === true)
const requireAttendeeNote = computed(() => collectStudentFields.value && checkoutSettings.value.require_attendee_note === true)

// Sequential installments (parcialidades)
const eligibilityKeys = ref({})
const verifiedTiers = ref({})
const eligibilityErrors = ref({})
const verifyingTier = ref(null)

const dependentTiers = computed(() => availableTiers.value.filter(t => t.depends_on_tier_id))

const getDependencyName = (tier) => {
  if (tier.depends_on_tier?.name) return tier.depends_on_tier.name
  const parent = availableTiers.value.find(t => t.id === tier.depends_on_tier_id)
  return parent?.name || ''
}

// Dependent tiers stay locked in the selector until a clave is verified
const lockedTiers = computed(() => {
  const locked = {}
  for (const tier of dependentTiers.value) {
    if (!verifiedTiers.value[tier.id]) {
      locked[tier.id] = `${t.requiresPayment}: ${getDependencyName(tier)}`
    }
  }
  return locked
})

const verifyEligibility = async (tier) => {
  const key = (eligibilityKeys.value[tier.id] || '').trim()
  if (!key) return

  verifyingTier.value = tier.id
  eligibilityErrors.value = { ...eligibilityErrors.value, [tier.id]: '' }

  try {
    const res = await checkTierEligibility(route.params.slug, tier.id, key)
    if (res.eligible) {
      verifiedTiers.value = { ...verifiedTiers.value, [tier.id]: key.toUpperCase() }
    } else {
      const missing = res.missing_tiers?.map(m => m.name).join(', ')
      eligibilityErrors.value = {
        ...eligibilityErrors.value,
        [tier.id]: missing ? `${t.notEligible}: ${missing}` : t.notEligible
      }
    }
  } catch (e) {
    eligibilityErrors.value = { ...eligibilityErrors.value, [tier.id]: e.message || t.verifyFailed }
  } finally {
    verifyingTier.value = null
  }
}


// Every GA ticket entry has the required student data filled in
const attendeeFieldsValid = computed(() => {
  if (isSeatedEvent.value) return true
  if (!requireStudentFields.value && !requireAttendeeNote.value) return true
  return ticketEntries.value.every(entry => {
    const a = tierAttendees.value[entry.key] || {}
    if (requireStudentFields.value && (!a.name?.trim() || !a.key?.trim())) return false
    if (requireAttendeeNote.value && !a.note?.trim()) return false
    return true
  })
})

// Email validation
const isEmailValid = computed(() => {
  const email = form.value.customer_email.trim()
  if (!email) return false
  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
})

const blockedMessage = computed(() => {
  const messages = {
    not_live: t.notAvailableForPurchase,
    registration_closed: t.registrationClosed,
    deadline_passed: t.deadlinePassed,
    sold_out: t.soldOut,
    sales_ended: t.salesEnded
  }
  return messages[availability.value?.blocked_reason] || t.notAvailable
})

const maxTickets = computed(() => Math.min(availability.value?.tickets_available || 0, 10))
const availableItems = computed(() => (availability.value?.items || []).filter(item => item.available && item.available_quantity > 0))
const hasTierSelections = computed(() => Object.values(tierSelections.value).some(qty => qty > 0))

// Generate an array of ticket entries for attendee input
const ticketEntries = computed(() => {
  const entries = []
  Object.entries(tierSelections.value).forEach(([tierId, qty]) => {
    const tier = availableTiers.value.find(t => t.id === Number(tierId))
    for (let i = 0; i < qty; i++) {
      entries.push({
        key: `${tierId}_${i}`,
        tierId: Number(tierId),
        index: i,
        tierName: tier?.name || 'Ticket',
        label: qty > 1 ? `${tier?.name || 'Ticket'} #${i + 1}` : tier?.name || 'Ticket'
      })
    }
  })
  return entries
})

// Prefill the verified clave on this tier's attendee entries (still editable)
watch([verifiedTiers, ticketEntries], () => {
  for (const entry of ticketEntries.value) {
    const verifiedKey = verifiedTiers.value[entry.tierId]
    if (verifiedKey && !tierAttendees.value[entry.key]?.key) {
      setAttendeeValue(entry.key, 'key', verifiedKey)
    }
  }
}, { deep: true })


const legacyTicketSubtotal = computed(() => (event.value?.price || 0) * form.value.tickets)

const tierSubtotal = computed(() => {
  return Object.entries(tierSelections.value).reduce((sum, [tierId, qty]) => {
    const tier = availableTiers.value.find(t => t.id === Number(tierId))
    return sum + (tier ? tier.price * qty : 0)
  }, 0)
})

const seatedSubtotal = computed(() => {
  let total = 0
  for (const tableId of selectedTables.value) {
    const table = tables.value.find(t => t.id === tableId)
    if (table) total += table.price || 0
  }
  for (const seatId of selectedSeats.value) {
    for (const table of tables.value) {
      if (table.seats) {
        const seat = table.seats.find(s => s.id === seatId)
        if (seat) { total += seat.price || 0; break }
      }
    }
  }
  return total
})

const selectedItems = computed(() => {
  return availableItems.value
    .filter(item => form.value.extra_items[item.id] > 0)
    .map(item => ({ ...item, quantity: form.value.extra_items[item.id] }))
})

const itemsSubtotal = computed(() => selectedItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0))

const orderTotal = computed(() => {
  if (isSeatedEvent.value) return seatedSubtotal.value + itemsSubtotal.value
  if (availableTiers.value.length > 0) return tierSubtotal.value + itemsSubtotal.value
  return legacyTicketSubtotal.value + itemsSubtotal.value
})

const isFormValid = computed(() => {
  const hasContactInfo = form.value.customer_name.trim() && isEmailValid.value && form.value.customer_phone.trim() && form.value.customer_company.trim()
  if (isSeatedEvent.value) return hasContactInfo && (selectedTables.value.length > 0 || selectedSeats.value.length > 0)
  // Tiered events require a real tier selection; the legacy single-price
  // path only applies to events with no tiers at all
  if (availableTiers.value.length > 0) return hasContactInfo && hasTierSelections.value && attendeeFieldsValid.value
  return hasContactInfo && form.value.tickets > 0
})

const getTierName = (tierId) => availableTiers.value.find(t => t.id === Number(tierId))?.name || 'Ticket'
const getTierLineTotal = (tierId, qty) => {
  const tier = availableTiers.value.find(t => t.id === Number(tierId))
  return tier ? (tier.price * qty).toFixed(2) : '0.00'
}
const getTableName = (tableId) => tables.value.find(t => t.id === tableId)?.name || ''
const getTablePrice = (tableId) => Number(tables.value.find(t => t.id === tableId)?.price || 0).toFixed(2)
const getSeatInfo = (seatId) => {
  for (const table of tables.value) {
    if (table.seats) {
      const seat = table.seats.find(s => s.id === seatId)
      if (seat) return `${table.name} - ${seat.label}`
    }
  }
  return ''
}
const getSeatLabel = (seatId) => getSeatInfo(seatId)
const getSeatPrice = (seatId) => {
  for (const table of tables.value) {
    if (table.seats) {
      const seat = table.seats.find(s => s.id === seatId)
      if (seat) return Number(seat.price).toFixed(2)
    }
  }
  return '0.00'
}
const getItemQuantity = (itemId) => form.value.extra_items[itemId] || 0
const incrementItem = (itemId) => {
  const item = availableItems.value.find(i => i.id === itemId)
  const current = form.value.extra_items[itemId] || 0
  if (current < item.available_quantity) form.value.extra_items[itemId] = current + 1
}
const decrementItem = (itemId) => {
  const current = form.value.extra_items[itemId] || 0
  if (current > 0) form.value.extra_items[itemId] = current - 1
}

// Attendee helper functions for tiers
const getAttendeeValue = (key, field) => {
  return tierAttendees.value[key]?.[field] || ''
}
const setAttendeeValue = (key, field, value) => {
  if (!tierAttendees.value[key]) {
    tierAttendees.value[key] = { name: '', note: '', key: '' }
  }
  tierAttendees.value[key][field] = value
}

// Attendee helper functions for tables
const getTableAttendeeValue = (tableId, field) => {
  return tableAttendees.value[tableId]?.[field] || ''
}
const setTableAttendeeValue = (tableId, field, value) => {
  if (!tableAttendees.value[tableId]) {
    tableAttendees.value[tableId] = { name: '', note: '' }
  }
  tableAttendees.value[tableId][field] = value
}

// Attendee helper functions for seats
const getSeatAttendeeValue = (seatId, field) => {
  return seatAttendees.value[seatId]?.[field] || ''
}
const setSeatAttendeeValue = (seatId, field, value) => {
  if (!seatAttendees.value[seatId]) {
    seatAttendees.value[seatId] = { name: '', note: '' }
  }
  seatAttendees.value[seatId][field] = value
}

const handleReservationExpired = () => {
  error.value = t.reservationExpired
  sessionStorage.removeItem(`reservation_${route.params.slug}`)
  selectedTables.value = []
  selectedSeats.value = []
  reservationToken.value = null
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  submitting.value = true
  error.value = ''

  try {
    const extra_items = Object.entries(form.value.extra_items)
      .filter(([_, quantity]) => quantity > 0)
      .map(([item_id, quantity]) => ({ item_id: parseInt(item_id), quantity }))

    const checkoutData = {
      event_slug: route.params.slug,
      customer_name: form.value.customer_name,
      customer_email: form.value.customer_email,
      customer_phone: form.value.customer_phone,
      customer_company: form.value.customer_company || null,
      extra_items
    }

    if (isSeatedEvent.value) {
      // Build tables with attendee info
      checkoutData.tables = selectedTables.value.map(tableId => ({
        id: tableId,
        attendee_name: tableAttendees.value[tableId]?.name || null,
        attendee_note: tableAttendees.value[tableId]?.note || null
      }))
      // Build seats with attendee info
      checkoutData.seats = selectedSeats.value.map(seatId => ({
        id: seatId,
        attendee_name: seatAttendees.value[seatId]?.name || null,
        attendee_note: seatAttendees.value[seatId]?.note || null
      }))
      checkoutData.reservation_token = reservationToken.value
    } else if (hasTierSelections.value) {
      // Build tiers with attendee info for each ticket
      checkoutData.tiers = Object.entries(tierSelections.value)
        .filter(([_, qty]) => qty > 0)
        .map(([tier_id, quantity]) => {
          // Collect attendees for this tier
          const attendees = []
          for (let i = 0; i < quantity; i++) {
            const entryKey = `${tier_id}_${i}`
            attendees.push({
              name: tierAttendees.value[entryKey]?.name || null,
              note: tierAttendees.value[entryKey]?.note || null,
              key: tierAttendees.value[entryKey]?.key || null
            })
          }
          return {
            tier_id: parseInt(tier_id),
            quantity,
            attendees
          }
        })
    } else {
      checkoutData.tickets = form.value.tickets
    }

    const response = await createSession(checkoutData)
    if (isSeatedEvent.value) sessionStorage.removeItem(`reservation_${route.params.slug}`)
    if (response.checkout_url) window.location.href = response.checkout_url
  } catch (e) {
    error.value = e.message || t.failedToCreateSession
    submitting.value = false
    // The banner lives at the top; on a phone the user is at the bottom
    await nextTick()
    document.querySelector('.error-banner')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

.checkout-page {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --color-text: #1a1a1a;
  --color-text-light: #666;
  --color-text-muted: #999;
  --color-bg: #fff;
  --color-bg-alt: #f8f8f8;
  --color-border: #eee;
  --color-primary: #2563eb;
  --color-success: #10b981;
  --color-error: #ef4444;
  --radius: 12px;

  font-family: var(--font-body);
  background: var(--color-bg-alt);
  min-height: 100vh;
}

/* Loading */
.loading-state {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Blocked State */
.blocked-state {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.blocked-card {
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 40px;
  text-align: center;
  max-width: 400px;
}

.blocked-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blocked-icon svg {
  width: 32px;
  height: 32px;
  color: var(--color-error);
}

.blocked-card h1 {
  font-family: var(--font-heading);
  font-size: 24px;
  margin-bottom: 8px;
}

.blocked-card p {
  color: var(--color-text-light);
  margin-bottom: 24px;
}

.back-btn {
  display: inline-block;
  padding: 12px 24px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
}

/* Checkout Content */
.checkout-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
.checkout-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: var(--color-bg);
  border-radius: 8px;
  text-decoration: none;
  color: var(--color-text-light);
  font-size: 14px;
  font-weight: 500;
}

.back-link svg {
  width: 16px;
  height: 16px;
}

.header-info h1 {
  font-family: var(--font-heading);
  font-size: 24px;
  color: var(--color-text);
}

.header-info p {
  font-size: 14px;
  color: var(--color-text-light);
}

/* Timer Banner */
.timer-banner {
  margin-bottom: 20px;
}

/* Error Banner */
.error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius);
  color: var(--color-error);
  margin-bottom: 20px;
}

.error-banner svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Grid */
.checkout-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Form Sections */
.form-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 24px;
}

.form-section h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  margin-bottom: 0;
}

.change-link {
  font-size: 14px;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 6px;
}

.required-mark {
  color: #dc2626;
}

.currency-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-light, #666);
}

/* Installment (parcialidades) verification */
.installment-check {
  border: 1px solid var(--color-border, #eee);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 12px;
  background: #fafafa;
}

.installment-check-header {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  align-items: baseline;
  font-size: 14px;
}

.installment-check-header span {
  font-size: 12px;
  color: #b45309;
}

.installment-check-hint {
  font-size: 12px;
  color: #666;
  margin: 6px 0 8px;
}

.installment-check-row {
  display: flex;
  gap: 8px;
}

.installment-check-row input {
  flex: 1;
  min-width: 0;
}

.verify-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #1a1a1a;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}

.verify-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.installment-check-error {
  margin-top: 8px;
  font-size: 12px;
  color: #dc2626;
}

.installment-check-ok {
  margin-top: 6px;
  font-size: 13px;
  color: #059669;
  font-weight: 500;
}

.optional-label {
  font-weight: 400;
  color: var(--color-text-muted);
}

.field input {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  transition: border-color 0.2s;
}

.field input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.field input.has-error {
  border-color: var(--color-error);
}

.field input.has-error:focus {
  border-color: var(--color-error);
}

.field-error {
  font-size: 12px;
  color: var(--color-error);
  margin-top: 6px;
}

.email-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  font-size: 12px;
  color: #1e40af;
  line-height: 1.4;
}

.email-notice svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Ticket Selector */
.ticket-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--color-bg-alt);
  border-radius: 8px;
}

.ticket-info {
  display: flex;
  flex-direction: column;
}

.ticket-name {
  font-weight: 500;
  color: var(--color-text);
}

.ticket-price {
  font-size: 14px;
  color: var(--color-text-light);
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-control.small {
  gap: 8px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.qty-btn:hover:not(:disabled) {
  border-color: var(--color-text-muted);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  font-size: 16px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.available-note {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 12px;
}

/* Selection List */
.selection-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selection-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-bg-alt);
  border-radius: 8px;
}

.item-price {
  font-weight: 600;
  color: var(--color-primary);
}

.no-selection {
  text-align: center;
  padding: 24px;
  color: var(--color-text-muted);
}

.select-btn {
  display: inline-block;
  margin-top: 12px;
  padding: 10px 20px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
}

/* Attendee Information */
.section-description {
  font-size: 14px;
  color: var(--color-text-light);
  margin-bottom: 20px;
  line-height: 1.5;
}

.attendee-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.attendee-item {
  padding: 16px;
  background: var(--color-bg-alt);
  border-radius: 8px;
}

.attendee-header {
  margin-bottom: 12px;
}

.attendee-label {
  font-weight: 600;
  color: var(--color-text);
  font-size: 14px;
}

.attendee-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attendee-fields .field input {
  background: var(--color-bg);
}

@media (min-width: 768px) {
  .attendee-fields {
    flex-direction: row;
    gap: 16px;
  }

  .attendee-fields .field {
    flex: 1;
  }
}

/* Addons */
.addons-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.addon-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.addon-item:last-child {
  border-bottom: none;
}

.addon-info {
  display: flex;
  flex-direction: column;
}

.addon-name {
  font-weight: 500;
}

.addon-price {
  font-size: 14px;
  color: var(--color-text-light);
}

/* Summary */
.summary-column {
  position: sticky;
  top: 80px;
}

.summary-card {
  background: var(--color-bg);
  border-radius: var(--radius);
  padding: 24px;
}

.summary-card h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 16px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.summary-line.addon {
  color: var(--color-text-light);
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.summary-total span:first-child {
  font-weight: 600;
}

.total-amount {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: var(--color-success);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #059669;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.secure-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.secure-note svg {
  width: 14px;
  height: 14px;
}

/* Desktop */
@media (min-width: 768px) {
  .checkout-content {
    padding: 40px;
  }

  .checkout-header {
    margin-bottom: 32px;
  }

  .header-info h1 {
    font-size: 32px;
  }

  .checkout-grid {
    flex-direction: row;
    align-items: flex-start;
  }

  .form-column {
    flex: 1;
  }

  .summary-column {
    width: 340px;
    flex-shrink: 0;
  }
}
</style>
