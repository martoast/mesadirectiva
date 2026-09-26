<template>
  <div class="product-page">
    <nav class="breadcrumb">
      <NuxtLink to="/app/admin/products">{{ t.products }}</NuxtLink>
      <span>/</span>
      <span>{{ product?.name || '…' }}</span>
    </nav>

    <div v-if="loading" class="state">{{ t.loading }}</div>
    <div v-else-if="loadError" class="state error">{{ loadError }}</div>

    <template v-else-if="product">
      <!-- Header -->
      <header class="product-header">
        <div class="thumb" :style="product.image_url ? { backgroundImage: `url('${product.image_url}')` } : {}"></div>
        <div class="header-info">
          <div class="title-row">
            <h1>{{ product.name }}</h1>
            <span :class="['status', product.status]">{{ statusLabel }}</span>
          </div>
          <p class="meta">
            <span v-if="product.group">{{ product.group.name }}</span>
            <span> · {{ t.tiendita }}</span>
            <span v-if="product.ends_at"> · {{ t.until }} {{ formatDateTime(product.ends_at) }}</span>
          </p>
        </div>
        <div class="header-actions">
          <NuxtLink :to="`/app/admin/products/${product.slug}/edit`" class="btn-secondary">{{ t.edit }}</NuxtLink>
          <button v-if="product.status !== 'live'" class="btn-primary" :disabled="busy" @click="handlePublish">
            {{ t.publish }}
          </button>
          <button v-else class="btn-secondary" :disabled="busy" @click="handleClose">{{ t.stopSelling }}</button>
        </div>
      </header>

      <div v-if="actionError" class="alert">{{ actionError }}</div>

      <!-- Public link -->
      <div v-if="product.status === 'live'" class="link-card">
        <span class="link-label">{{ t.storeLink }}</span>
        <a :href="publicUrl" target="_blank" rel="noopener" class="link-url">{{ publicUrl }}</a>
        <button class="btn-secondary small" @click="copyLink">{{ copied ? t.copied : t.copy }}</button>
      </div>

      <!-- Stats -->
      <div class="stats">
        <div class="stat">
          <span class="stat-value">{{ product.total_tickets_sold || 0 }}</span>
          <span class="stat-label">{{ t.itemsSold }}</span>
        </div>
        <div class="stat">
          <span class="stat-value">${{ formatMoney(product.total_revenue) }}</span>
          <span class="stat-label">{{ t.revenue }}</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ ordersMeta.total }}</span>
          <span class="stat-label">{{ t.orders }}</span>
        </div>
      </div>

      <!-- Variants -->
      <section class="card">
        <div class="card-header">
          <h2>{{ t.variants }}</h2>
          <NuxtLink :to="`/app/admin/products/${product.slug}/edit`" class="card-link">{{ t.editVariants }}</NuxtLink>
        </div>
        <div v-if="variants.length === 0" class="empty-line">{{ t.noVariants }}</div>
        <table v-else class="table">
          <thead>
            <tr>
              <th>{{ t.variant }}</th>
              <th class="num">{{ t.price }}</th>
              <th class="num">{{ t.sold }}</th>
              <th class="num">{{ t.remaining }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="variant in variants" :key="variant.id" :class="!variant.is_active && 'muted'">
              <td>
                {{ variant.name }}
                <span v-if="!variant.is_active" class="tag">{{ t.paused }}</span>
                <span v-else-if="variant.is_sold_out" class="tag">{{ t.soldOut }}</span>
              </td>
              <td class="num">${{ formatMoney(variant.price) }}</td>
              <td class="num">{{ variant.quantity_sold }}</td>
              <td class="num">{{ variant.quantity === null ? '∞' : variant.available }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Pickup -->
      <section v-if="product.location?.name || product.location?.instructions" class="card">
        <h2>{{ t.pickup }}</h2>
        <p v-if="product.location?.name" class="pickup-name">{{ product.location.name }}</p>
        <p v-if="product.location?.instructions" class="pickup-text">{{ product.location.instructions }}</p>
      </section>

      <!-- Orders -->
      <section class="card">
        <div class="card-header">
          <h2>{{ t.recentOrders }}</h2>
          <NuxtLink :to="`/app/admin/events/${product.slug}/attendees`" class="card-link">{{ t.viewBuyers }}</NuxtLink>
        </div>
        <div v-if="orders.length === 0" class="empty-line">{{ t.noOrders }}</div>
        <table v-else class="table">
          <thead>
            <tr>
              <th>{{ t.order }}</th>
              <th>{{ t.customer }}</th>
              <th class="hide-mobile">{{ t.date }}</th>
              <th>{{ t.status }}</th>
              <th class="num">{{ t.total }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td class="mono">{{ order.order_number }}</td>
              <td>{{ order.customer_name }}</td>
              <td class="hide-mobile">{{ formatDateTime(order.created_at) }}</td>
              <td><span :class="['order-status', order.status]">{{ orderStatusLabel(order.status) }}</span></td>
              <td class="num">${{ formatMoney(order.total) }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Danger zone -->
      <div class="danger-zone">
        <button class="btn-danger" @click="deleteModalOpen = true">{{ t.deleteProduct }}</button>
      </div>

      <UiConfirmModal
        :is-open="deleteModalOpen"
        :title="t.deleteProduct"
        :message="t.deleteConfirm"
        :confirm-text="t.delete"
        :cancel-text="t.cancel"
        @confirm="handleDelete"
        @cancel="deleteModalOpen = false"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatDateTime } from '~/utils/dateTime'
import { translateError } from '~/utils/errorTranslations'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const toast = useToast()
const { getEvent, getEventOrders, publishEvent, closeEvent, deleteEvent } = useEvents()
const { t: createT, language } = useLanguage()

const translations = {
  products: { es: 'Productos', en: 'Products' },
  loading: { es: 'Cargando...', en: 'Loading...' },
  tiendita: { es: 'Cuenta: Tiendita', en: 'Account: Tiendita' },
  until: { es: 'disponible hasta', en: 'available until' },
  edit: { es: 'Editar', en: 'Edit' },
  publish: { es: 'Publicar', en: 'Publish' },
  stopSelling: { es: 'Cerrar venta', en: 'Stop selling' },
  live: { es: 'En venta', en: 'On sale' },
  draft: { es: 'Borrador', en: 'Draft' },
  closed: { es: 'Cerrado', en: 'Closed' },
  storeLink: { es: 'Enlace de compra', en: 'Purchase link' },
  copy: { es: 'Copiar', en: 'Copy' },
  copied: { es: 'Copiado', en: 'Copied' },
  itemsSold: { es: 'Piezas vendidas', en: 'Items sold' },
  revenue: { es: 'Ingresos', en: 'Revenue' },
  orders: { es: 'Pedidos', en: 'Orders' },
  variants: { es: 'Variantes', en: 'Variants' },
  editVariants: { es: 'Editar variantes', en: 'Edit variants' },
  noVariants: { es: 'Este producto no tiene variantes. Agrega al menos una para poder venderlo.', en: 'This product has no variants. Add at least one to sell it.' },
  variant: { es: 'Variante', en: 'Variant' },
  price: { es: 'Precio', en: 'Price' },
  sold: { es: 'Vendidos', en: 'Sold' },
  remaining: { es: 'Quedan', en: 'Left' },
  paused: { es: 'Pausada', en: 'Paused' },
  soldOut: { es: 'Agotada', en: 'Sold out' },
  pickup: { es: 'Entrega', en: 'Pickup' },
  recentOrders: { es: 'Pedidos recientes', en: 'Recent orders' },
  viewBuyers: { es: 'Ver compradores', en: 'View buyers' },
  noOrders: { es: 'Aún no hay pedidos.', en: 'No orders yet.' },
  order: { es: 'Pedido', en: 'Order' },
  customer: { es: 'Cliente', en: 'Customer' },
  date: { es: 'Fecha', en: 'Date' },
  status: { es: 'Estado', en: 'Status' },
  total: { es: 'Total', en: 'Total' },
  completed: { es: 'Pagado', en: 'Paid' },
  pending: { es: 'Pendiente', en: 'Pending' },
  failed: { es: 'Fallido', en: 'Failed' },
  refunded: { es: 'Reembolsado', en: 'Refunded' },
  deleteProduct: { es: 'Eliminar producto', en: 'Delete product' },
  deleteConfirm: { es: '¿Eliminar este producto? Esta acción no se puede deshacer.', en: 'Delete this product? This cannot be undone.' },
  delete: { es: 'Eliminar', en: 'Delete' },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  publishedToast: { es: 'Producto publicado', en: 'Product published' },
  closedToast: { es: 'Venta cerrada', en: 'Sales closed' },
  failedToLoad: { es: 'No se pudo cargar el producto', en: 'Failed to load product' }
}

const t = createT(translations)

const product = ref(null)
const orders = ref([])
const ordersMeta = ref({ total: 0 })
const loading = ref(true)
const loadError = ref('')
const actionError = ref('')
const busy = ref(false)
const copied = ref(false)
const deleteModalOpen = ref(false)

const statusLabel = computed(() => ({ live: t.live, draft: t.draft, closed: t.closed }[product.value?.status] || product.value?.status))

const variants = computed(() => {
  return [...(product.value?.ticket_tiers || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id)
})

const publicUrl = computed(() => {
  const base = config.public.siteUrl || (import.meta.client ? window.location.origin : '')
  return `${base}/app/events/${product.value?.slug}`
})

const orderStatusLabel = (status) => t[status] || status

const formatMoney = (value) => Number(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fetchProduct = async () => {
  const response = await getEvent(route.params.slug)
  if (response.event?.kind !== 'product') {
    // Events keep their own admin page
    router.replace(`/app/admin/events/${route.params.slug}`)
    return
  }
  product.value = response.event
}

const fetchOrders = async () => {
  try {
    const response = await getEventOrders(route.params.slug, { per_page: 10 })
    orders.value = response.orders || []
    ordersMeta.value = response.meta || ordersMeta.value
  } catch (e) {
    // Orders are secondary; the page still works without them
  }
}

const runAction = async (action, successMessage) => {
  busy.value = true
  actionError.value = ''
  try {
    await action(product.value.slug)
    toast.success(successMessage)
    await fetchProduct()
  } catch (e) {
    actionError.value = translateError(e.message, language.value) || e.message
  } finally {
    busy.value = false
  }
}

const handlePublish = () => runAction(publishEvent, t.publishedToast)
const handleClose = () => runAction(closeEvent, t.closedToast)

const handleDelete = async () => {
  deleteModalOpen.value = false
  try {
    await deleteEvent(product.value.slug)
    router.push('/app/admin/products')
  } catch (e) {
    actionError.value = translateError(e.message, language.value) || e.message
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(publicUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    // Clipboard blocked; the link is visible to copy by hand
  }
}

onMounted(async () => {
  try {
    await fetchProduct()
    if (product.value) await fetchOrders()
  } catch (e) {
    loadError.value = e.message || t.failedToLoad
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.product-page {
  --color-ink: #1a1a1a;
  --color-muted: #7a7a7a;
  --color-border: #e8e6e3;
  --color-success: #2d5a27;
  --color-warning: #b45309;
  --color-danger: #c73e1d;

  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 80px;
}

.breadcrumb {
  display: flex;
  gap: 8px;
  font-size: 13px;
  color: var(--color-muted);
}

.breadcrumb a {
  color: inherit;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: var(--color-ink);
}

.state {
  padding: 48px 0;
  text-align: center;
  color: var(--color-muted);
}

.state.error,
.alert {
  color: var(--color-danger);
}

.alert {
  padding: 12px 16px;
  font-size: 14px;
  background: rgba(199, 62, 29, 0.06);
  border-radius: 8px;
}

.product-header {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
}

.thumb {
  width: 72px;
  height: 72px;
  background: #f2f1ef center / cover no-repeat;
  border-radius: 12px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.title-row h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: -0.02em;
}

.meta {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--color-muted);
}

.status {
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  color: var(--color-muted);
  background: #f2f1ef;
}

.status.live {
  color: var(--color-success);
  background: rgba(45, 90, 39, 0.08);
}

.status.draft {
  color: var(--color-warning);
  background: rgba(180, 83, 9, 0.08);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
}

.btn-primary {
  color: #ffffff;
  background: var(--color-ink);
  border: none;
}

.btn-secondary {
  color: var(--color-ink);
  background: #ffffff;
  border: 1px solid var(--color-border);
}

.btn-secondary.small {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-danger {
  color: var(--color-danger);
  background: transparent;
  border: 1px solid rgba(199, 62, 29, 0.3);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.link-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.link-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-muted);
  white-space: nowrap;
}

.link-url {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  color: var(--color-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 20px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-ink);
}

.stat-label {
  font-size: 12px;
  color: var(--color-muted);
}

.card {
  padding: 20px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.card h2 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-ink);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.card-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
}

.empty-line {
  font-size: 14px;
  color: var(--color-muted);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th {
  padding: 8px 8px 8px 0;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-muted);
  border-bottom: 1px solid var(--color-border);
}

.table td {
  padding: 10px 8px 10px 0;
  color: var(--color-ink);
  border-bottom: 1px solid #f2f1ef;
}

.table .num {
  text-align: right;
}

.table tr.muted td {
  color: var(--color-muted);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
}

.tag {
  margin-left: 6px;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-muted);
  background: #f2f1ef;
  border-radius: 10px;
}

.order-status {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-muted);
}

.order-status.completed {
  color: var(--color-success);
}

.order-status.failed,
.order-status.refunded {
  color: var(--color-danger);
}

.pickup-name {
  margin: 0;
  font-weight: 600;
}

.pickup-text {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--color-muted);
  white-space: pre-line;
}

.danger-zone {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .product-header {
    grid-template-columns: 56px minmax(0, 1fr);
  }

  .thumb {
    width: 56px;
    height: 56px;
  }

  .header-actions {
    grid-column: 1 / -1;
  }

  .stats {
    grid-template-columns: 1fr 1fr;
  }

  .link-card {
    flex-wrap: wrap;
  }

  .hide-mobile {
    display: none;
  }
}
</style>
