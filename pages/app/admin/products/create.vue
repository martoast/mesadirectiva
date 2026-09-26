<template>
  <div class="product-editor-page">
    <nav class="breadcrumb">
      <NuxtLink to="/app/admin/products">{{ t.products }}</NuxtLink>
      <span>/</span>
      <span>{{ t.newProduct }}</span>
    </nav>
    <h1>{{ t.newProduct }}</h1>

    <AdminProductForm @saved="handleSaved" />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const router = useRouter()
const toast = useToast()
const { t: createT } = useLanguage()

const translations = {
  products: { es: 'Productos', en: 'Products' },
  newProduct: { es: 'Nuevo producto', en: 'New product' },
  published: { es: 'Producto publicado', en: 'Product published' },
  draftSaved: { es: 'Borrador guardado', en: 'Draft saved' }
}

const t = createT(translations)

const handleSaved = ({ slug, published }) => {
  toast.success(published ? t.published : t.draftSaved)
  router.push(`/app/admin/products/${slug}`)
}
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
</style>
