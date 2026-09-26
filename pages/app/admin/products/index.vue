<template>
  <div class="products-page">
    <header class="page-header">
      <div>
        <div class="title-row">
          <h1>{{ t.title }}</h1>
          <span class="count">{{ meta.total }}</span>
        </div>
        <p class="subtitle">{{ t.subtitle }}</p>
      </div>
      <NuxtLink to="/app/admin/products/create" class="btn-create">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        <span>{{ t.newProduct }}</span>
      </NuxtLink>
    </header>

    <div class="filters">
      <button
        v-for="option in statusOptions"
        :key="option.value"
        :class="['pill', filterStatus === option.value && 'active']"
        @click="filterStatus = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <div v-if="loading" class="state">{{ t.loading }}</div>

    <div v-else-if="error" class="state error">
      <p>{{ error }}</p>
      <button class="btn-secondary" @click="fetchProducts">{{ t.tryAgain }}</button>
    </div>

    <div v-else-if="products.length === 0" class="empty">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <h3>{{ t.emptyTitle }}</h3>
      <p>{{ t.emptyDescription }}</p>
      <NuxtLink to="/app/admin/products/create" class="btn-create show">{{ t.createFirst }}</NuxtLink>
    </div>

    <div v-else class="product-list">
      <NuxtLink
        v-for="product in products"
        :key="product.id"
        :to="`/app/admin/products/${product.slug}`"
        class="product-row"
      >
        <div class="thumb" :style="product.image_url ? { backgroundImage: `url('${product.image_url}')` } : {}">
          <svg v-if="!product.image_url" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div class="info">
          <span class="name">{{ product.name }}</span>
        </div>
        <span :class="['status', product.status]">{{ statusLabel(product.status) }}</span>
        <div class="figures">
          <span class="figure"><strong>{{ product.total_tickets_sold || 0 }}</strong> {{ t.sold }}</span>
          <span class="figure"><strong>${{ formatMoney(product.total_revenue) }}</strong></span>
        </div>
      </NuxtLink>

      <div v-if="meta.last_page > 1" class="pagination">
        <button class="btn-secondary" :disabled="currentPage === 1" @click="currentPage--">‹</button>
        <span>{{ currentPage }} / {{ meta.last_page }}</span>
        <button class="btn-secondary" :disabled="currentPage === meta.last_page" @click="currentPage++">›</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { getEvents } = useEvents()
const { t: createT } = useLanguage()

const translations = {
  title: { es: 'Productos', en: 'Products' },
  subtitle: { es: 'Alimentos, artículos promocionales y uniformes que se venden a través de Cafetería.', en: 'Food, promotional items and uniforms sold through Cafetería.' },
  newProduct: { es: 'Nuevo producto', en: 'New product' },
  all: { es: 'Todos', en: 'All' },
  live: { es: 'En venta', en: 'On sale' },
  draft: { es: 'Borrador', en: 'Draft' },
  closed: { es: 'Cerrado', en: 'Closed' },
  loading: { es: 'Cargando productos...', en: 'Loading products...' },
  tryAgain: { es: 'Intentar de nuevo', en: 'Try again' },
  emptyTitle: { es: 'Sin productos aún', en: 'No products yet' },
  emptyDescription: { es: 'Crea un producto para venderlo en la tienda: uniformes, playeras, termos...', en: 'Create a product to sell in the store: uniforms, shirts, bottles...' },
  createFirst: { es: 'Crear primer producto', en: 'Create first product' },
  sold: { es: 'vendidos', en: 'sold' },
  failedToLoad: { es: 'No se pudieron cargar los productos', en: 'Failed to load products' }
}

const t = createT(translations)

const statusOptions = computed(() => [
  { value: '', label: t.all },
  { value: 'live', label: t.live },
  { value: 'draft', label: t.draft },
  { value: 'closed', label: t.closed }
])

const statusLabel = (status) => ({ live: t.live, draft: t.draft, closed: t.closed }[status] || status)

const formatMoney = (value) => Number(value || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const products = ref([])
const loading = ref(true)
const error = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const meta = ref({ current_page: 1, last_page: 1, total: 0 })

const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = { kind: 'product', per_page: 20, page: currentPage.value }
    if (filterStatus.value) params.status = filterStatus.value
    const response = await getEvents(params)
    products.value = response.events || []
    meta.value = response.meta || meta.value
  } catch (e) {
    error.value = e.message || t.failedToLoad
  } finally {
    loading.value = false
  }
}

watch(filterStatus, () => {
  currentPage.value = 1
  fetchProducts()
})

watch(currentPage, fetchProducts)

onMounted(fetchProducts)
</script>

<style scoped>
.products-page {
  --color-ink: #1a1a1a;
  --color-muted: #7a7a7a;
  --color-border: #e8e6e3;
  --color-success: #2d5a27;
  --color-warning: #b45309;

  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 80px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.title-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.title-row h1 {
  font-size: 30px;
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  margin: 0;
}

.count {
  padding: 2px 10px;
  font-size: 14px;
  color: var(--color-muted);
  background: #f2f1ef;
  border-radius: 20px;
}

.subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--color-muted);
}

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: var(--color-ink);
  border-radius: 10px;
  text-decoration: none;
  white-space: nowrap;
}

.btn-create svg {
  width: 18px;
  height: 18px;
}

.btn-secondary {
  padding: 8px 14px;
  font-size: 14px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
}

.btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pill {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink);
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  cursor: pointer;
}

.pill.active {
  color: #ffffff;
  background: var(--color-ink);
  border-color: var(--color-ink);
}

.state {
  padding: 48px 0;
  text-align: center;
  color: var(--color-muted);
}

.state.error {
  color: #c73e1d;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 64px 16px;
  text-align: center;
  background: #ffffff;
  border: 1px dashed var(--color-border);
  border-radius: 12px;
}

.empty svg {
  width: 48px;
  height: 48px;
  color: var(--color-muted);
}

.empty h3 {
  margin: 8px 0 0;
  font-size: 18px;
  color: var(--color-ink);
}

.empty p {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--color-muted);
}

.product-list {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.product-row {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid #f2f1ef;
}

.product-row:hover {
  background: rgba(26, 26, 26, 0.02);
}

.thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: #f2f1ef center / cover no-repeat;
  border-radius: 8px;
}

.thumb svg {
  width: 24px;
  height: 24px;
  color: var(--color-muted);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta {
  font-size: 13px;
  color: var(--color-muted);
}

.status {
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  background: #f2f1ef;
  color: var(--color-muted);
}

.status.live {
  color: var(--color-success);
  background: rgba(45, 90, 39, 0.08);
}

.status.draft {
  color: var(--color-warning);
  background: rgba(180, 83, 9, 0.08);
}

.figures {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  min-width: 90px;
}

.figure {
  font-size: 13px;
  color: var(--color-muted);
}

.figure strong {
  color: var(--color-ink);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 12px;
  font-size: 14px;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
  }

  .product-row {
    grid-template-columns: 48px minmax(0, 1fr) auto;
    padding: 12px 16px;
    gap: 12px;
  }

  .thumb {
    width: 48px;
    height: 48px;
  }

  .figures {
    display: none;
  }
}
</style>
