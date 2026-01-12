<template>
  <div class="min-h-screen bg-paper font-outfit">
    <!-- Loading -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="w-8 h-8 border-3 border-washi-300 border-t-indigo rounded-full animate-spin"></div>
    </div>

    <!-- Not Seated Event -->
    <div v-else-if="!isSeatedEvent" class="min-h-screen flex items-center justify-center p-6">
      <div class="bg-white rounded-2xl p-10 text-center max-w-sm shadow-card">
        <div class="w-14 h-14 mx-auto mb-4 bg-indigo/10 rounded-full flex items-center justify-center">
          <svg class="w-7 h-7 text-indigo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h1 class="text-xl font-semibold text-ink mb-2">{{ t.notSeatedEvent }}</h1>
        <p class="text-ink-muted mb-6">{{ t.usesGeneralAdmission }}</p>
        <NuxtLink :to="`/app/events/${route.params.slug}/checkout`" class="inline-block px-8 py-3 bg-ink text-white font-medium rounded-xl hover:bg-ink/90 transition-colors">
          {{ t.goToCheckout }}
        </NuxtLink>
      </div>
    </div>

    <!-- Cannot Purchase -->
    <div v-else-if="!canPurchase" class="min-h-screen flex items-center justify-center p-6">
      <div class="bg-white rounded-2xl p-10 text-center max-w-sm shadow-card">
        <div class="w-14 h-14 mx-auto mb-4 bg-gold/10 rounded-full flex items-center justify-center">
          <svg class="w-7 h-7 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h1 class="text-xl font-semibold text-ink mb-2">{{ t.cannotPurchase }}</h1>
        <p class="text-ink-muted mb-6">{{ blockedMessage }}</p>
        <NuxtLink :to="`/app/events/${route.params.slug}`" class="inline-block px-8 py-3 bg-ink text-white font-medium rounded-xl hover:bg-ink/90 transition-colors">
          {{ t.backToEvent }}
        </NuxtLink>
      </div>
    </div>

    <!-- Main Interface -->
    <template v-else>
      <!-- Welcome Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showWelcome" class="fixed inset-0 bg-ink/50 flex items-end sm:items-center justify-center z-[200] p-0 sm:p-6" @click.self="showWelcome = false">
            <div class="bg-white rounded-t-3xl sm:rounded-3xl p-8 w-full max-w-md text-center">
              <div class="w-16 h-16 mx-auto mb-4 bg-sage/10 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-ink mb-2">{{ t.welcomeTitle }}</h2>
              <p class="text-ink-muted mb-6">{{ t.welcomeText }}</p>
              <div class="space-y-3 mb-8">
                <div class="flex items-center gap-3 p-4 bg-paper rounded-xl text-left">
                  <span class="w-7 h-7 bg-ink text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <span class="text-sm text-ink">{{ t.step1 }}</span>
                </div>
                <div class="flex items-center gap-3 p-4 bg-paper rounded-xl text-left">
                  <span class="w-7 h-7 bg-ink text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <span class="text-sm text-ink">{{ t.step2 }}</span>
                </div>
              </div>
              <button @click="showWelcome = false" class="w-full py-4 bg-ink text-white text-lg font-semibold rounded-xl hover:bg-ink/90 transition-colors">
                {{ t.gotIt }}
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Seat Selection Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="activeTable && !activeTable.sell_as_whole" class="fixed inset-0 bg-ink/50 flex items-end sm:items-center justify-center z-[200] p-0 sm:p-6" @click.self="closeModal">
            <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] sm:max-h-[80vh] flex flex-col">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-5 border-b border-washi-300">
                <div>
                  <h3 class="text-xl font-bold text-ink">{{ activeTable.name }}</h3>
                  <p class="text-sm text-ink-muted">{{ t.selectSeatsModal }}</p>
                </div>
                <button @click="closeModal" class="w-10 h-10 flex items-center justify-center bg-paper hover:bg-washi-300 rounded-full text-ink-muted transition-colors">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <!-- Seats Grid -->
              <div class="flex-1 overflow-y-auto p-5">
                <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <button
                    v-for="seat in activeTable.seats"
                    :key="seat.id"
                    :class="[
                      'relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all',
                      seat.status === 'sold'
                        ? 'bg-washi-200 border-washi-300 opacity-50 cursor-not-allowed'
                        : isSeatSelected(seat.id)
                          ? 'bg-indigo border-indigo text-white'
                          : 'bg-paper border-washi-300 hover:border-sage cursor-pointer'
                    ]"
                    :disabled="seat.status === 'sold'"
                    @click="toggleSeat(seat)"
                  >
                    <span :class="['text-sm font-semibold', isSeatSelected(seat.id) ? 'text-white' : 'text-ink']">{{ seat.label }}</span>
                    <span :class="['text-xs mt-1', isSeatSelected(seat.id) ? 'text-white/80' : 'text-ink-muted']">${{ formatPrice(seat.price) }}</span>
                    <span v-if="isSeatSelected(seat.id)" class="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                      <svg class="w-3 h-3 text-indigo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <path d="M5 13l4 4L19 7"/>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="p-5 border-t border-washi-300 bg-paper-warm">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-ink-muted">{{ getTableSelectedCount(activeTable) }} {{ t.seatsSelected }}</span>
                  <span class="text-xl font-bold text-ink">${{ getTableSelectedTotal(activeTable) }}</span>
                </div>
                <button @click="closeModal" class="w-full py-4 bg-ink text-white text-lg font-semibold rounded-xl hover:bg-ink/90 transition-colors">
                  {{ t.done }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Cart Drawer -->
      <Teleport to="body">
        <Transition name="drawer">
          <div v-if="showCart" class="fixed inset-0 bg-ink/50 z-[200]" @click.self="showCart = false">
            <div class="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-modal flex flex-col">
              <!-- Drawer Header -->
              <div class="flex items-center justify-between p-5 border-b border-washi-300">
                <h3 class="text-xl font-bold text-ink">{{ t.yourCart }}</h3>
                <button @click="showCart = false" class="w-10 h-10 flex items-center justify-center bg-paper hover:bg-washi-300 rounded-full text-ink-muted transition-colors">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <!-- Cart Empty -->
              <div v-if="!hasSelections" class="flex-1 flex flex-col items-center justify-center p-10 text-ink-light">
                <svg class="w-12 h-12 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <p>{{ t.cartEmpty }}</p>
              </div>

              <!-- Cart Items -->
              <div v-else class="flex-1 overflow-y-auto p-5 space-y-3">
                <!-- Tables -->
                <div v-for="tableId in selectedTables" :key="'t-' + tableId" class="flex items-center gap-4 p-4 bg-paper rounded-xl">
                  <div class="flex-1 min-w-0">
                    <span class="block text-xs font-semibold text-ink-light uppercase tracking-wide mb-1">{{ t.table }}</span>
                    <span class="block text-base font-semibold text-ink">{{ getTableName(tableId) }}</span>
                    <span class="text-sm text-ink-muted">{{ getTableCapacity(tableId) }} {{ t.guests }}</span>
                  </div>
                  <span class="text-base font-semibold text-sage">${{ getTablePrice(tableId) }}</span>
                  <button @click="removeTable(tableId)" class="w-9 h-9 flex items-center justify-center text-ink-light hover:text-coral hover:bg-coral/10 rounded-lg transition-colors">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>

                <!-- Seats -->
                <div v-for="seatId in selectedSeats" :key="'s-' + seatId" class="flex items-center gap-4 p-4 bg-paper rounded-xl">
                  <div class="flex-1 min-w-0">
                    <span class="block text-xs font-semibold text-ink-light uppercase tracking-wide mb-1">{{ t.seat }}</span>
                    <span class="block text-base font-semibold text-ink">{{ getSeatLabel(seatId) }}</span>
                    <span class="text-sm text-ink-muted">{{ getSeatTableName(seatId) }}</span>
                  </div>
                  <span class="text-base font-semibold text-sage">${{ getSeatPrice(seatId) }}</span>
                  <button @click="removeSeat(seatId)" class="w-9 h-9 flex items-center justify-center text-ink-light hover:text-coral hover:bg-coral/10 rounded-lg transition-colors">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Cart Footer -->
              <div v-if="hasSelections" class="p-5 border-t border-washi-300 bg-paper-warm">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-ink">{{ t.total }}</span>
                  <span class="text-3xl font-bold text-ink">${{ totalPrice.toFixed(2) }}</span>
                </div>
                <p class="text-sm text-ink-light mb-4">{{ holdNoticeText }}</p>
                <div class="flex gap-3">
                  <button @click="clearCart" :disabled="reserving || clearing" class="flex-shrink-0 px-4 py-4 border border-washi-400 text-ink-muted font-medium rounded-xl hover:bg-washi-200 transition-colors disabled:opacity-50">
                    {{ clearing ? t.clearing : t.startOver }}
                  </button>
                  <button @click="handleCheckout" :disabled="reserving || clearing" class="flex-1 py-4 bg-sage text-white text-lg font-semibold rounded-xl hover:bg-sage-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                    <span v-if="reserving" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {{ reserving ? t.reserving : t.checkout }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Header -->
      <header class="sticky top-0 z-10 bg-white border-b border-washi-300">
        <div class="flex items-center gap-3 px-4 py-3">
          <NuxtLink :to="`/app/events/${route.params.slug}`" class="w-10 h-10 flex items-center justify-center text-ink hover:bg-paper rounded-lg transition-colors">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 19l-7-7 7-7"/>
            </svg>
          </NuxtLink>
          <div class="flex-1 min-w-0">
            <h1 class="text-lg font-semibold text-ink">{{ t.selectSeats }}</h1>
            <p v-if="event?.name" class="text-sm text-ink-muted truncate">{{ event.name }}</p>
          </div>
          <button @click="showWelcome = true" class="w-10 h-10 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-paper rounded-lg transition-colors">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Error Banner -->
      <div v-if="error" class="px-4 py-3 bg-coral/10 text-coral flex items-center justify-between">
        <span class="text-sm">{{ error }}</span>
        <button @click="error = ''" class="text-xl font-bold">&times;</button>
      </div>

      <!-- Floor Plan Canvas -->
      <div class="flex-1 overflow-hidden relative">
        <!-- Canvas (full height now) -->
        <div
          ref="canvasRef"
          class="h-[calc(100vh-120px)] overflow-hidden bg-paper-warm cursor-grab active:cursor-grabbing"
          @wheel.prevent="handleWheel"
          @mousedown="startPan"
          @mousemove="doPan"
          @mouseup="endPan"
          @mouseleave="endPan"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="endPan"
        >
          <div
            class="relative transition-transform duration-100 origin-top-left"
            :style="{
              width: '1600px',
              height: '1200px',
              transform: `translate(${panX}px, ${panY}px) scale(${zoom})`
            }"
          >
            <!-- Grid -->
            <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(circle, #D6D3D1 1px, transparent 1px); background-size: 25px 25px;"></div>

            <!-- Stage (centered above tables) -->
            <div
              class="absolute top-6 w-[500px] h-20 bg-gradient-to-b from-washi-300 to-washi-400 rounded-b-[100px] flex items-center justify-center shadow-sm border border-washi-500"
              :style="{ left: `${stageCenter}px`, transform: 'translateX(-50%)' }"
            >
              <span class="text-sm font-bold tracking-widest text-ink-muted">{{ t.stage }}</span>
            </div>

            <!-- Tables (Positioned) -->
            <div
              v-for="table in tables"
              :key="table.id"
              class="absolute"
              :style="{
                left: `${table.position_x || 100}px`,
                top: `${(table.position_y || 150) + 100}px`
              }"
            >
              <!-- Table with visual seats (individual seat sales) -->
              <template v-if="!table.sell_as_whole && table.seats?.length">
                <div class="relative" :style="{ width: `${getTableSize(table)}px`, height: `${getTableSize(table)}px` }">
                  <!-- Seats arranged in circle around table -->
                  <button
                    v-for="(seat, idx) in table.seats"
                    :key="seat.id"
                    :class="[
                      'absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-150',
                      seat.status === 'sold'
                        ? 'bg-washi-300 border-washi-400 text-washi-500 cursor-not-allowed'
                        : isSeatSelected(seat.id)
                          ? 'bg-indigo border-indigo text-white shadow-lg scale-110'
                          : 'bg-white border-sage text-sage hover:bg-sage hover:text-white hover:scale-110 cursor-pointer'
                    ]"
                    :style="getSeatPosition(table, idx)"
                    :disabled="seat.status === 'sold'"
                    @click.stop="toggleSeat(seat)"
                    :title="`${seat.label} - $${formatPrice(seat.price)}`"
                  >
                    {{ getSeatDisplayLabel(seat, idx) }}
                  </button>

                  <!-- Center table circle -->
                  <div
                    class="absolute bg-white border-2 border-washi-300 rounded-full shadow-card flex flex-col items-center justify-center"
                    :style="getTableCenterStyle(table)"
                  >
                    <span class="text-xs font-semibold text-ink">{{ table.name }}</span>
                    <span class="text-[10px] text-ink-muted">{{ getAvailableSeatsCount(table) }}/{{ table.seats.length }}</span>
                  </div>
                </div>
              </template>

              <!-- Whole table purchase - Premium unified visualization -->
              <template v-else>
                <button
                  :class="[
                    'group relative transition-all duration-300 ease-out',
                    isTableSoldOut(table)
                      ? 'opacity-40 cursor-not-allowed'
                      : 'cursor-pointer'
                  ]"
                  :style="{ width: `${getWholeTableSize(table)}px`, height: `${getWholeTableSize(table)}px` }"
                  @click="handleTableClick(table)"
                  :disabled="isTableSoldOut(table)"
                >
                  <!-- Outer glow ring (appears on hover/selected) -->
                  <div
                    :class="[
                      'absolute inset-0 rounded-full transition-all duration-300',
                      isTableInCart(table)
                        ? 'bg-indigo/20 scale-110'
                        : 'bg-transparent group-hover:bg-sage/10 group-hover:scale-105'
                    ]"
                  ></div>

                  <!-- Seat indicators - unified ring of dots -->
                  <div class="absolute inset-0">
                    <div
                      v-for="n in (table.capacity || 8)"
                      :key="n"
                      :class="[
                        'absolute w-4 h-4 rounded-full border-2 transition-all duration-300',
                        isTableSoldOut(table)
                          ? 'bg-washi-200 border-washi-300'
                          : isTableInCart(table)
                            ? 'bg-indigo/30 border-indigo'
                            : 'bg-paper border-washi-400 group-hover:border-sage group-hover:bg-sage/20'
                      ]"
                      :style="getWholeTableSeatPosition(table, n - 1)"
                    ></div>
                  </div>

                  <!-- Connecting ring -->
                  <div
                    :class="[
                      'absolute rounded-full border-2 border-dashed transition-all duration-300',
                      isTableSoldOut(table)
                        ? 'border-washi-300'
                        : isTableInCart(table)
                          ? 'border-indigo/40'
                          : 'border-washi-300 group-hover:border-sage/50'
                    ]"
                    :style="getConnectingRingStyle(table)"
                  ></div>

                  <!-- Center table surface -->
                  <div
                    :class="[
                      'absolute rounded-full shadow-card flex flex-col items-center justify-center transition-all duration-300 border-2',
                      isTableSoldOut(table)
                        ? 'bg-washi-100 border-washi-300'
                        : isTableInCart(table)
                          ? 'bg-white border-indigo shadow-lg'
                          : 'bg-white border-washi-300 group-hover:border-sage group-hover:shadow-md'
                    ]"
                    :style="getWholeTableCenterStyle(table)"
                  >
                    <span :class="['text-xs font-semibold', isTableInCart(table) ? 'text-indigo' : 'text-ink']">
                      {{ table.name }}
                    </span>
                    <span class="text-[10px] text-ink-muted mt-0.5">
                      {{ table.capacity }} {{ t.guests }}
                    </span>
                    <span :class="['text-sm font-bold mt-1', isTableInCart(table) ? 'text-indigo' : 'text-sage']">
                      ${{ formatPrice(table.price) }}
                    </span>
                  </div>

                  <!-- Selected checkmark -->
                  <div
                    v-if="isTableInCart(table)"
                    class="absolute -top-1 -right-1 w-7 h-7 bg-indigo rounded-full flex items-center justify-center shadow-lg z-10"
                  >
                    <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>

                  <!-- "Full Table" label -->
                  <div
                    v-if="!isTableSoldOut(table)"
                    :class="[
                      'absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300',
                      isTableInCart(table)
                        ? 'bg-indigo text-white'
                        : 'bg-washi-200 text-ink-muted group-hover:bg-sage group-hover:text-white'
                    ]"
                  >
                    {{ t.fullTable || 'Full Table' }}
                  </div>
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- Floating Zoom Controls (bottom-left) -->
        <div class="absolute bottom-4 left-4 flex flex-col gap-1 z-10">
          <button @click="zoomIn" class="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur rounded-lg shadow-card text-ink hover:bg-white transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
          <button @click="zoomOut" class="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur rounded-lg shadow-card text-ink hover:bg-white transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"/>
            </svg>
          </button>
          <button @click="fitToView" class="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur rounded-lg shadow-card text-ink hover:bg-white transition-colors mt-1">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
        </div>

        <!-- Floating Legend (top-right) -->
        <div class="absolute top-4 right-4 flex items-center gap-4 px-4 py-2 bg-white/90 backdrop-blur rounded-full shadow-card z-10">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-sage"></span>
            <span class="text-xs text-ink-muted">{{ t.available }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo"></span>
            <span class="text-xs text-ink-muted">{{ t.inCart }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-washi-400"></span>
            <span class="text-xs text-ink-muted">{{ t.sold }}</span>
          </div>
        </div>
      </div>

      <!-- Floating Cart Button -->
      <Transition name="slide-up">
        <button
          v-if="hasSelections"
          @click="showCart = true"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-ink text-white rounded-full shadow-modal hover:bg-ink/90 transition-colors"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span class="bg-indigo px-2 py-0.5 rounded-md text-sm font-semibold">{{ totalItems }}</span>
          <span class="text-lg font-bold">${{ totalPrice.toFixed(2) }}</span>
        </button>
      </Transition>

      <!-- Hint for empty state -->
      <div v-if="!hasSelections" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-ink/80 text-white text-sm rounded-full animate-pulse">
        {{ t.tapToStart }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

definePageMeta({
  layout: 'public'
})

const { t: createT } = useLanguage()

const translations = {
  notSeatedEvent: { es: 'Este evento no tiene asientos asignados', en: 'This event does not have assigned seating' },
  usesGeneralAdmission: { es: 'Puedes comprar boletos directamente.', en: 'You can purchase tickets directly.' },
  goToCheckout: { es: 'Comprar Boletos', en: 'Buy Tickets' },
  cannotPurchase: { es: 'Compra no disponible', en: 'Purchase Unavailable' },
  backToEvent: { es: 'Volver al Evento', en: 'Back to Event' },
  notAvailableForPurchase: { es: 'Este evento no está disponible para compra.', en: 'This event is not available for purchase.' },
  registrationClosed: { es: 'El registro está cerrado.', en: 'Registration is closed.' },
  deadlinePassed: { es: 'La fecha límite ha pasado.', en: 'The deadline has passed.' },
  soldOut: { es: 'Agotado.', en: 'Sold out.' },
  notAvailable: { es: 'No disponible.', en: 'Not available.' },
  welcomeTitle: { es: 'Selecciona tus lugares', en: 'Select your seats' },
  welcomeText: { es: 'Es muy fácil:', en: 'It\'s super easy:' },
  step1: { es: 'Toca una mesa para ver los asientos', en: 'Tap a table to see available seats' },
  step2: { es: 'Selecciona y agrégalos al carrito', en: 'Select seats and add to cart' },
  gotIt: { es: 'Entendido', en: 'Got it' },
  selectSeats: { es: 'Elige tus lugares', en: 'Choose your seats' },
  selectSeatsModal: { es: 'Selecciona los asientos que deseas', en: 'Select the seats you want' },
  available: { es: 'Disponible', en: 'Available' },
  inCart: { es: 'En carrito', en: 'In cart' },
  sold: { es: 'Vendido', en: 'Sold' },
  stage: { es: 'ESCENARIO', en: 'STAGE' },
  guests: { es: 'personas', en: 'guests' },
  table: { es: 'Mesa', en: 'Table' },
  seat: { es: 'Asiento', en: 'Seat' },
  seatsSelected: { es: 'seleccionados', en: 'selected' },
  done: { es: 'Listo', en: 'Done' },
  yourCart: { es: 'Tu carrito', en: 'Your cart' },
  cartEmpty: { es: 'Tu carrito está vacío', en: 'Your cart is empty' },
  total: { es: 'Total', en: 'Total' },
  holdNotice: { es: 'Tu selección se reservará por {minutes} minutos al continuar.', en: 'Your selection will be held for {minutes} minutes.' },
  checkout: { es: 'Continuar al pago', en: 'Continue to payment' },
  reserving: { es: 'Reservando...', en: 'Reserving...' },
  tapToStart: { es: 'Toca una mesa para comenzar', en: 'Tap a table to get started' },
  failedToReserve: { es: 'No se pudo reservar. Intenta de nuevo.', en: 'Could not reserve. Please try again.' },
  startOver: { es: 'Empezar de nuevo', en: 'Start over' },
  clearing: { es: 'Limpiando...', en: 'Clearing...' },
  fullTable: { es: 'Mesa completa', en: 'Full Table' }
}

const t = createT(translations)

const route = useRoute()
const router = useRouter()
const { getPublicEvent, checkAvailability } = useEvents()
const { getPublicTables } = useTables()
const { createReservation, releaseReservation } = useReservations()

// Data
const event = ref(null)
const availability = ref(null)
const tables = ref([])
const loading = ref(true)
const reserving = ref(false)
const clearing = ref(false)
const error = ref('')

// UI State
const showWelcome = ref(false)
const showCart = ref(false)
const activeTable = ref(null)

// Selection State
const selectedTables = ref([])
const selectedSeats = ref([])
const existingReservationToken = ref(null)

// Canvas State
const canvasRef = ref(null)
const zoom = ref(0.7)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const panStartX = ref(0)
const panStartY = ref(0)
const lastPanX = ref(0)
const lastPanY = ref(0)

// Load data
onMounted(async () => {
  try {
    const [eventRes, availRes] = await Promise.all([
      getPublicEvent(route.params.slug),
      checkAvailability(route.params.slug)
    ])

    event.value = eventRes.event
    availability.value = availRes

    if (event.value?.seating_type === 'seated') {
      const tablesRes = await getPublicTables(route.params.slug)
      tables.value = tablesRes.tables || []

      // Restore selection from existing reservation (if user came back from checkout)
      const reservationKey = `reservation_${route.params.slug}`
      const savedReservation = sessionStorage.getItem(reservationKey)
      if (savedReservation) {
        try {
          const reservation = JSON.parse(savedReservation)
          // Check if reservation is still valid (not expired)
          const expiresAt = new Date(reservation.expires_at).getTime()
          const now = Date.now()
          if (expiresAt > now) {
            // Restore selections and track token
            selectedTables.value = reservation.tables || []
            selectedSeats.value = reservation.seats || []
            existingReservationToken.value = reservation.token
          } else {
            // Reservation expired, clear it
            sessionStorage.removeItem(reservationKey)
          }
        } catch (e) {
          // Invalid JSON, clear it
          sessionStorage.removeItem(reservationKey)
        }
      }

      // Show welcome on first visit
      const welcomeKey = `seats_welcome_${route.params.slug}`
      if (!sessionStorage.getItem(welcomeKey)) {
        showWelcome.value = true
        sessionStorage.setItem(welcomeKey, 'true')
      }

      await nextTick()
      fitToView()
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

// Computed
const isSeatedEvent = computed(() => event.value?.seating_type === 'seated')
const canPurchase = computed(() => availability.value?.can_purchase ?? false)

const blockedMessage = computed(() => {
  const messages = {
    not_live: t.notAvailableForPurchase,
    registration_closed: t.registrationClosed,
    deadline_passed: t.deadlinePassed,
    sold_out: t.soldOut
  }
  return messages[availability.value?.blocked_reason] || t.notAvailable
})

const holdNoticeText = computed(() => {
  const minutes = event.value?.reservation_minutes || 15
  return t.holdNotice.replace('{minutes}', minutes)
})

// Calculate stage center based on tables positions
const stageCenter = computed(() => {
  if (tables.value.length === 0) return 800 // default
  let minX = Infinity, maxX = 0
  tables.value.forEach(table => {
    const x = table.position_x || 100
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x + 144)
  })
  return (minX + maxX) / 2
})

const hasSelections = computed(() => selectedTables.value.length > 0 || selectedSeats.value.length > 0)
const totalItems = computed(() => selectedTables.value.length + selectedSeats.value.length)

const totalPrice = computed(() => {
  let total = 0
  for (const tableId of selectedTables.value) {
    const table = tables.value.find(t => t.id === tableId)
    if (table) total += Number(table.price) || 0
  }
  for (const seatId of selectedSeats.value) {
    for (const table of tables.value) {
      const seat = table.seats?.find(s => s.id === seatId)
      if (seat) { total += Number(seat.price) || 0; break }
    }
  }
  return total
})

// Zoom & Pan
const zoomIn = () => { zoom.value = Math.min(1.5, zoom.value + 0.15) }
const zoomOut = () => { zoom.value = Math.max(0.3, zoom.value - 0.15) }

const fitToView = () => {
  if (!canvasRef.value || tables.value.length === 0) return
  const viewport = canvasRef.value.getBoundingClientRect()

  // Step 1: Find the actual extent of all content
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

  // Get table bounds (account for visual seat arrangement size)
  tables.value.forEach(table => {
    const x = table.position_x || 100
    const y = (table.position_y || 150) + 100
    // Use dynamic size based on table type
    let size
    if (!table.sell_as_whole && table.seats?.length) {
      size = getTableSize(table) // individual seats table
    } else {
      size = getWholeTableSize(table) // whole table purchase
    }
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x + size)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y + size)
  })

  // Include stage (at top, centered on tables)
  const stageCenterX = (minX + maxX) / 2
  minX = Math.min(minX, stageCenterX - 250)
  maxX = Math.max(maxX, stageCenterX + 250)
  minY = Math.min(minY, 24)
  maxY = Math.max(maxY, 104)

  // Step 2: Calculate content center
  const contentCenterX = (minX + maxX) / 2
  const contentCenterY = (minY + maxY) / 2
  const contentWidth = maxX - minX
  const contentHeight = maxY - minY

  // Step 3: Calculate zoom to fit with padding
  const paddedWidth = contentWidth + 100
  const paddedHeight = contentHeight + 100
  const fitZoom = Math.min(viewport.width / paddedWidth, viewport.height / paddedHeight)
  zoom.value = Math.max(0.3, Math.min(1.2, fitZoom))

  // Step 4: Pan so content center appears at viewport center
  // Formula: contentCenter * zoom + pan = viewportCenter
  panX.value = (viewport.width / 2) - (contentCenterX * zoom.value)
  panY.value = (viewport.height / 2) - (contentCenterY * zoom.value)
}

const handleWheel = (e) => {
  const delta = e.deltaY > 0 ? -0.08 : 0.08
  zoom.value = Math.max(0.3, Math.min(1.5, zoom.value + delta))
}

const startPan = (e) => {
  if (e.target.closest('button')) return
  isPanning.value = true
  panStartX.value = e.clientX
  panStartY.value = e.clientY
  lastPanX.value = panX.value
  lastPanY.value = panY.value
}

const doPan = (e) => {
  if (!isPanning.value) return
  panX.value = lastPanX.value + (e.clientX - panStartX.value)
  panY.value = lastPanY.value + (e.clientY - panStartY.value)
}

const endPan = () => { isPanning.value = false }

const handleTouchStart = (e) => {
  if (e.touches.length === 1 && !e.target.closest('button')) {
    isPanning.value = true
    panStartX.value = e.touches[0].clientX
    panStartY.value = e.touches[0].clientY
    lastPanX.value = panX.value
    lastPanY.value = panY.value
  }
}

const handleTouchMove = (e) => {
  if (!isPanning.value || e.touches.length !== 1) return
  panX.value = lastPanX.value + (e.touches[0].clientX - panStartX.value)
  panY.value = lastPanY.value + (e.touches[0].clientY - panStartY.value)
}

// Helpers
const formatPrice = (price) => Number(price || 0).toFixed(2)
const getAvailableSeatsCount = (table) => table.seats?.filter(s => s.status === 'available').length || 0
const isTableSoldOut = (table) => table.sell_as_whole ? table.status === 'sold' : table.seats?.every(s => s.status === 'sold') ?? false

// Visual seat arrangement helpers
const getTableSize = (table) => {
  const seatCount = table.seats?.length || 6
  // Base size + extra space per seat
  return Math.max(120, 60 + seatCount * 15)
}

const getSeatPosition = (table, idx) => {
  const seatCount = table.seats?.length || 6
  const tableSize = getTableSize(table)
  const radius = (tableSize / 2) - 4 // seats on the edge
  const angle = (idx / seatCount) * 2 * Math.PI - Math.PI / 2 // start from top
  const x = (tableSize / 2) + radius * Math.cos(angle) - 16 // 16 = half of seat width (32/2)
  const y = (tableSize / 2) + radius * Math.sin(angle) - 16
  return { left: `${x}px`, top: `${y}px` }
}

const getTableCenterStyle = (table) => {
  const tableSize = getTableSize(table)
  const centerSize = tableSize * 0.55 // center table is 55% of total size
  const offset = (tableSize - centerSize) / 2
  return {
    width: `${centerSize}px`,
    height: `${centerSize}px`,
    left: `${offset}px`,
    top: `${offset}px`
  }
}

const getSeatDisplayLabel = (seat, idx) => {
  return seat.label || `${idx + 1}`
}

// Whole table visualization helpers
const getWholeTableSize = (table) => {
  const capacity = table.capacity || 8
  // Elegant sizing: base 120px + 8px per guest, max 180px
  return Math.min(180, Math.max(120, 80 + capacity * 10))
}

const getWholeTableSeatPosition = (table, idx) => {
  const capacity = table.capacity || 8
  const size = getWholeTableSize(table)
  const radius = (size / 2) - 10 // seats slightly inside edge
  const angle = (idx / capacity) * 2 * Math.PI - Math.PI / 2 // start from top
  const x = (size / 2) + radius * Math.cos(angle) - 8 // 8 = half of seat indicator (16/2)
  const y = (size / 2) + radius * Math.sin(angle) - 8
  return { left: `${x}px`, top: `${y}px` }
}

const getConnectingRingStyle = (table) => {
  const size = getWholeTableSize(table)
  const ringSize = size - 24 // slightly inside the seats
  const offset = (size - ringSize) / 2
  return {
    width: `${ringSize}px`,
    height: `${ringSize}px`,
    left: `${offset}px`,
    top: `${offset}px`
  }
}

const getWholeTableCenterStyle = (table) => {
  const size = getWholeTableSize(table)
  const centerSize = size * 0.5 // center is 50% of total
  const offset = (size - centerSize) / 2
  return {
    width: `${centerSize}px`,
    height: `${centerSize}px`,
    left: `${offset}px`,
    top: `${offset}px`
  }
}

const isTableInCart = (table) => {
  if (table.sell_as_whole) return selectedTables.value.includes(table.id)
  return table.seats?.some(s => selectedSeats.value.includes(s.id)) ?? false
}

const isSeatSelected = (seatId) => selectedSeats.value.includes(seatId)

const handleTableClick = (table) => {
  if (isTableSoldOut(table)) return
  if (table.sell_as_whole) {
    if (selectedTables.value.includes(table.id)) {
      selectedTables.value = selectedTables.value.filter(id => id !== table.id)
    } else {
      selectedTables.value = [...selectedTables.value, table.id]
    }
  } else {
    activeTable.value = table
  }
}

const toggleSeat = (seat) => {
  if (seat.status === 'sold') return
  if (selectedSeats.value.includes(seat.id)) {
    selectedSeats.value = selectedSeats.value.filter(id => id !== seat.id)
  } else {
    selectedSeats.value = [...selectedSeats.value, seat.id]
  }
}

const closeModal = () => { activeTable.value = null }

const getTableSelectedCount = (table) => table?.seats?.filter(s => selectedSeats.value.includes(s.id)).length || 0

const getTableSelectedTotal = (table) => {
  if (!table?.seats) return '0.00'
  let total = 0
  for (const seat of table.seats) {
    if (selectedSeats.value.includes(seat.id)) total += Number(seat.price) || 0
  }
  return total.toFixed(2)
}

const getTableName = (tableId) => tables.value.find(t => t.id === tableId)?.name || ''
const getTablePrice = (tableId) => formatPrice(tables.value.find(t => t.id === tableId)?.price)
const getTableCapacity = (tableId) => tables.value.find(t => t.id === tableId)?.capacity || 0

const getSeatLabel = (seatId) => {
  for (const table of tables.value) {
    const seat = table.seats?.find(s => s.id === seatId)
    if (seat) return seat.label
  }
  return ''
}

const getSeatTableName = (seatId) => {
  for (const table of tables.value) {
    if (table.seats?.find(s => s.id === seatId)) return table.name
  }
  return ''
}

const getSeatPrice = (seatId) => {
  for (const table of tables.value) {
    const seat = table.seats?.find(s => s.id === seatId)
    if (seat) return formatPrice(seat.price)
  }
  return '0.00'
}

const removeTable = (tableId) => { selectedTables.value = selectedTables.value.filter(id => id !== tableId) }
const removeSeat = (seatId) => { selectedSeats.value = selectedSeats.value.filter(id => id !== seatId) }

// Clear cart and release any existing reservation
const clearCart = async () => {
  clearing.value = true
  const reservationKey = `reservation_${route.params.slug}`

  // Release existing reservation on server
  if (existingReservationToken.value) {
    try {
      await releaseReservation(route.params.slug, existingReservationToken.value)
    } catch (e) {
      // Ignore errors - reservation may have already expired
    }
  }

  // Clear local state
  selectedTables.value = []
  selectedSeats.value = []
  existingReservationToken.value = null
  sessionStorage.removeItem(reservationKey)
  showCart.value = false

  // Refresh tables to get updated availability
  try {
    const tablesRes = await getPublicTables(route.params.slug)
    tables.value = tablesRes.tables || []
  } catch (e) {
    // Ignore
  }

  clearing.value = false
}

const handleCheckout = async () => {
  reserving.value = true
  error.value = ''
  try {
    // Release existing reservation first (if any)
    if (existingReservationToken.value) {
      try {
        await releaseReservation(route.params.slug, existingReservationToken.value)
      } catch (e) {
        // Ignore - may have already expired
      }
      existingReservationToken.value = null
    }

    const response = await createReservation(route.params.slug, {
      tables: selectedTables.value,
      seats: selectedSeats.value
    })
    sessionStorage.setItem(`reservation_${route.params.slug}`, JSON.stringify({
      token: response.reservation.token,
      expires_at: response.reservation.expires_at,
      tables: selectedTables.value,
      seats: selectedSeats.value
    }))
    router.push(`/app/events/${route.params.slug}/checkout`)
  } catch (e) {
    error.value = e.message || t.failedToReserve
    reserving.value = false
  }
}
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active > div, .modal-leave-active > div {
  transition: transform 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div {
  transform: translateY(100%);
}
.modal-leave-to > div {
  transform: translateY(100%);
}
@media (min-width: 640px) {
  .modal-enter-from > div, .modal-leave-to > div {
    transform: translateY(20px) scale(0.95);
  }
}

/* Drawer transitions */
.drawer-enter-active, .drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-active > div, .drawer-leave-active > div {
  transition: transform 0.3s ease;
}
.drawer-enter-from, .drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from > div, .drawer-leave-to > div {
  transform: translateX(100%);
}

/* Slide up */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
