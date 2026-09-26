<template>
  <div class="product-editor-page">
    <nav class="breadcrumb">
      <NuxtLink to="/app/admin/products">{{ t.products }}</NuxtLink>
      <span>/</span>
      <NuxtLink v-if="product" :to="`/app/admin/products/${product.slug}`">{{ product.name }}</NuxtLink>
      <span>/</span>
      <span>{{ t.edit }}</span>
    </nav>
    <h1>{{ t.editProduct }}</h1>

    <div v-if="loading" class="state">{{ t.loading }}</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <AdminProductForm v-else-if="product" :initial-data="product" @saved="handleSaved" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { getEvent } = useEvents()
const { t: createT } = useLanguage()

const translations = {
  products: { es: 'Productos', en: 'Products' },
  edit: { es: 'Editar', en: 'Edit' },
  editProduct: { es: 'Editar producto', en: 'Edit product' },
  loading: { es: 'Cargando...', en: 'Loading...' },
  saved: { es: 'Cambios guardados', en: 'Changes saved' },
  failedToLoad: { es: 'No se pudo cargar el producto', en: 'Failed to load product' }
}

const t = createT(translations)

const product = ref(null)
const loading = ref(true)
const error = ref('')

const handleSaved = ({ slug }) => {
  toast.success(t.saved)
  router.push(`/app/admin/products/${slug}`)
}

onMounted(async () => {
  try {
    const response = await getEvent(route.params.slug)
    if (response.event?.kind !== 'product') {
      // Events keep their own editor
      return router.replace(`/app/admin/events/${route.params.slug}/edit`)
    }
    product.value = response.event
  } catch (e) {
    error.value = e.message || t.failedToLoad
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.product-editor-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 80px;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: #7a7a7a;
}

.breadcrumb a {
  color: inherit;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #1a1a1a;
}

h1 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.state {
  padding: 48px 0;
  text-align: center;
  color: #7a7a7a;
}

.state.error {
  color: #c73e1d;
}
</style>
