<template>
  <div class="floor-plan-page">
    <!-- Minimal Header -->
    <header class="editor-header">
      <div class="header-left">
        <NuxtLink :to="`/app/admin/events/${route.params.slug}`" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </NuxtLink>
        <div class="header-info">
          <h1>{{ event?.name || t.floorPlan }}</h1>
        </div>
      </div>

      <div class="header-center">
        <div class="stats-row">
          <div class="stat">
            <span class="stat-value">{{ tables.length }}</span>
            <span class="stat-label">{{ t.tables }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">{{ totalSeats }}</span>
            <span class="stat-label">{{ t.seats }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat accent">
            <span class="stat-value">{{ availableSeats }}</span>
            <span class="stat-label">{{ t.available }}</span>
          </div>
        </div>
      </div>

      <div class="header-right">
        <button @click="openCreateTable" class="header-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>{{ t.addTable }}</span>
        </button>
        <button
          @click="saveAllPositions"
          :disabled="savingPositions || !hasUnsavedChanges"
          :class="['header-btn primary', { active: hasUnsavedChanges }]"
        >
          <svg v-if="!savingPositions" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 13l4 4L19 7"/>
          </svg>
          <span v-else class="spinner"></span>
          <span>{{ savingPositions ? t.saving : t.saveLayout }}</span>
        </button>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="state-view">
      <div class="loader-zen">
        <div class="loader-circle"></div>
      </div>
      <p class="state-text">{{ t.loadingFloorPlan }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-view">
      <div class="state-icon error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v4M12 16h.01"/>
        </svg>
      </div>
      <p class="state-text">{{ error }}</p>
      <button @click="fetchData" class="state-btn">{{ t.tryAgain }}</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="tables.length === 0 && !selectedTable" class="state-view empty">
      <div class="empty-visual">
        <div class="zen-circle"></div>
        <div class="zen-lines">
          <span></span><span></span><span></span>
        </div>
      </div>
      <h2 class="empty-title">{{ t.noTablesYet }}</h2>
      <p class="state-text">{{ t.createTablesDesc }}</p>
      <button @click="openCreateTable" class="state-btn primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        {{ t.addFirstTable }}
      </button>
    </div>

    <!-- Editor Canvas -->
    <div v-else class="editor-area">
      <!-- Floating Toolbar -->
      <div class="toolbar">
        <button @click="zoomIn" :disabled="zoom >= 2" :title="t.zoomIn" class="tool-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
          </svg>
        </button>
        <span class="zoom-display">{{ Math.round(zoom * 100) }}%</span>
        <button @click="zoomOut" :disabled="zoom <= 0.3" :title="t.zoomOut" class="tool-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35M8 11h6"/>
          </svg>
        </button>
        <div class="tool-sep"></div>
        <button @click="fitToView" :title="t.fitToView" class="tool-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </button>
        <button @click="toggleFullscreen" :title="isFullscreen ? t.exitFullscreen : t.fullscreen" class="tool-btn">
          <svg v-if="!isFullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
        </button>
        <div class="tool-sep"></div>
        <button
          @click="gridSnap = !gridSnap"
          :class="['tool-btn', { active: gridSnap }]"
          :title="t.snapToGrid"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </button>
      </div>

      <!-- Canvas Area -->
      <div
        ref="canvasContainer"
        class="canvas"
        :class="{ 'panning': isPanning, 'dragging': draggingTable, 'panel-open': selectedTable }"
        @mousedown="startPan"
        @mousemove="onPan"
        @mouseup="endPan"
        @mouseleave="endPan"
        @wheel.prevent="onWheel"
      >
        <div
          class="canvas-world"
          :style="{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          }"
        >
          <!-- Subtle Grid -->
          <div class="grid-pattern"></div>

          <!-- Stage Element -->
          <div class="stage-element">
            <div class="stage-inner">
              <span class="stage-label">{{ t.stage }}</span>
            </div>
          </div>

          <!-- Table Cards -->
          <div
            v-for="table in tables"
            :key="table.id"
            :class="[
              'table-card',
              { 'whole-table': table.sell_as_whole },
              { 'is-dragging': draggingTable?.id === table.id },
              { 'is-selected': selectedTable?.id === table.id },
              { 'is-sold': table.status === 'sold' }
            ]"
            :style="{
              left: `${table.position_x}px`,
              top: `${table.position_y}px`
            }"
            @mousedown.stop="startDrag($event, table)"
          >
            <div class="table-header">
              <span class="table-name">{{ table.name }}</span>
            </div>

            <div class="table-body">
              <template v-if="table.sell_as_whole">
                <div class="whole-table-info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>{{ table.capacity }}</span>
                </div>
              </template>
              <template v-else>
                <div class="seats-preview">
                  <div
                    v-for="seat in table.seats?.slice(0, 8)"
                    :key="seat.id"
                    :class="['seat-pip', seat.status]"
                  ></div>
                  <div v-if="(table.seats?.length || 0) > 8" class="seats-overflow">
                    +{{ table.seats.length - 8 }}
                  </div>
                </div>
              </template>
            </div>

            <div class="table-footer">
              <span class="table-price">${{ formatPrice(table.price) }}</span>
              <span class="table-seats">{{ table.seats?.length || table.capacity }} {{ t.seatsLabel }}</span>
            </div>
          </div>
        </div>

        <!-- Drag Position Tooltip -->
        <Transition name="tooltip">
          <div v-if="draggingTable" class="drag-tooltip">
            {{ Math.round(draggingTable.position_x) }}, {{ Math.round(draggingTable.position_y) }}
          </div>
        </Transition>

        <!-- Welcome Overlay -->
        <Transition name="overlay">
          <div v-if="showInstructions" class="welcome-overlay" @click="showInstructions = false">
            <div class="welcome-card">
              <div class="welcome-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              </div>
              <h3>{{ t.quickControls }}</h3>
              <div class="controls-list">
                <div class="control-item">
                  <kbd>{{ t.scroll }}</kbd>
                  <span>{{ t.scrollZoom }}</span>
                </div>
                <div class="control-item">
                  <kbd>{{ t.dragCanvas }}</kbd>
                  <span>{{ t.panAround }}</span>
                </div>
                <div class="control-item">
                  <kbd>{{ t.clickTable }}</kbd>
                  <span>{{ t.openDetails }}</span>
                </div>
              </div>
              <button class="welcome-btn" @click.stop="showInstructions = false">{{ t.gotIt }}</button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Side Panel -->
      <Transition name="panel">
        <aside v-if="selectedTable" class="side-panel font-outfit">
          <div class="flex items-center justify-between px-6 py-5 border-b border-washi-300">
            <h2 class="text-lg font-semibold text-ink">{{ isCreatingTable ? t.newTable : selectedTable.name }}</h2>
            <button @click="closePanel" class="w-9 h-9 flex items-center justify-center rounded-lg text-ink-muted hover:bg-paper-warm hover:text-ink transition-all">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Tabs -->
          <div v-if="!isCreatingTable" class="flex px-6 border-b border-washi-300">
            <button
              :class="[
                'flex items-center gap-1.5 py-3.5 mr-6 text-sm font-medium border-b-2 transition-all',
                panelTab === 'info'
                  ? 'text-indigo border-indigo'
                  : 'text-ink-muted border-transparent hover:text-ink'
              ]"
              @click="panelTab = 'info'"
            >
              {{ t.tableInfo }}
            </button>
            <button
              v-if="!selectedTable.sell_as_whole"
              :class="[
                'flex items-center gap-1.5 py-3.5 mr-6 text-sm font-medium border-b-2 transition-all',
                panelTab === 'seats'
                  ? 'text-indigo border-indigo'
                  : 'text-ink-muted border-transparent hover:text-ink'
              ]"
              @click="panelTab = 'seats'"
            >
              {{ t.seats }}
              <span :class="[
                'text-xs px-1.5 py-0.5 rounded-full',
                panelTab === 'seats' ? 'bg-sage/10 text-sage-dark' : 'bg-washi-300 text-ink-muted'
              ]">{{ selectedTable.seats?.length || 0 }}</span>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <!-- Table Form -->
            <div v-if="isCreatingTable || panelTab === 'info'">
              <form @submit.prevent="handleTableSubmit" class="space-y-5">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-ink-muted">{{ t.tableName }}</label>
                  <input
                    v-model="tableForm.name"
                    type="text"
                    :placeholder="t.tableNamePlaceholder"
                    required
                    class="w-full px-4 py-3 text-ink bg-paper-warm border border-washi-300 rounded-lg focus:outline-none focus:bg-white focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all placeholder:text-ink-light"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-ink-muted">{{ t.capacity }}</label>
                    <input
                      v-model="tableForm.capacity"
                      type="number"
                      min="1"
                      placeholder="8"
                      required
                      class="w-full px-4 py-3 text-ink bg-paper-warm border border-washi-300 rounded-lg focus:outline-none focus:bg-white focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all placeholder:text-ink-light"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-ink-muted">{{ t.price }}</label>
                    <input
                      v-model="tableForm.price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      class="w-full px-4 py-3 text-ink bg-paper-warm border border-washi-300 rounded-lg focus:outline-none focus:bg-white focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all placeholder:text-ink-light"
                    />
                  </div>
                </div>

                <label class="flex gap-4 p-4 bg-paper-warm border border-washi-300 rounded-lg cursor-pointer hover:border-washi-400 transition-colors">
                  <input
                    id="sell-whole"
                    v-model="tableForm.sell_as_whole"
                    type="checkbox"
                    class="w-5 h-5 mt-0.5 accent-indigo rounded cursor-pointer"
                  />
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-ink">{{ t.sellAsWhole }}</span>
                    <span class="text-sm text-ink-muted leading-snug">
                      {{ tableForm.sell_as_whole ? t.sellAsWholeDesc : t.sellIndividualDesc }}
                    </span>
                  </div>
                </label>

                <label class="flex gap-4 p-4 bg-paper-warm border border-washi-300 rounded-lg cursor-pointer hover:border-washi-400 transition-colors">
                  <input
                    id="is-active"
                    v-model="tableForm.is_active"
                    type="checkbox"
                    class="w-5 h-5 mt-0.5 accent-indigo rounded cursor-pointer"
                  />
                  <div class="flex flex-col gap-1">
                    <span class="text-sm font-medium text-ink">{{ t.active }}</span>
                    <span class="text-sm text-ink-muted leading-snug">{{ t.activeDesc }}</span>
                  </div>
                </label>

                <div class="flex gap-3 pt-2">
                  <button
                    type="submit"
                    :disabled="tableFormLoading"
                    class="flex-1 px-5 py-3 text-sm font-medium text-white bg-sage hover:bg-sage-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
                  >
                    {{ tableFormLoading ? t.saving : (isCreatingTable ? t.createTable : t.saveChanges) }}
                  </button>
                  <button
                    v-if="!isCreatingTable"
                    type="button"
                    class="px-5 py-3 text-sm font-medium text-danger-600 bg-danger-50 hover:bg-danger-100 rounded-lg transition-colors"
                    @click="confirmDeleteTable"
                  >
                    {{ t.deleteTable }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Seats Tab -->
            <div v-else-if="panelTab === 'seats'">
              <!-- Summary Header -->
              <div class="mb-8">
                <div class="flex items-baseline gap-2 mb-3">
                  <span class="text-4xl font-light text-ink tracking-tight">{{ selectedTable.seats?.length || 0 }}</span>
                  <span class="text-lg text-ink-muted">{{ t.seatsTotal }}</span>
                </div>

                <!-- Capacity Bar -->
                <div class="mb-4">
                  <div class="h-1.5 bg-washi-300 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-sage rounded-full transition-all duration-500"
                      :style="{ width: `${selectedTable.seats?.length ? (tableAvailableSeats / selectedTable.seats.length) * 100 : 0}%` }"
                    ></div>
                  </div>
                  <div class="flex gap-4 mt-2">
                    <span class="text-xs text-ink-muted">
                      <span class="inline-block w-2 h-2 bg-sage rounded-full mr-1.5"></span>
                      {{ tableAvailableSeats }} {{ t.availableLabel }}
                    </span>
                    <span class="text-xs text-ink-muted">
                      <span class="inline-block w-2 h-2 bg-washi-400 rounded-full mr-1.5"></span>
                      {{ tableSoldSeats }} {{ t.soldLabel }}
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-3">
                  <button
                    @click="openAddSeat"
                    class="flex items-center gap-1.5 text-sm font-medium text-indigo hover:text-indigo-dark transition-colors"
                  >
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    {{ t.addSeat }}
                  </button>
                  <span class="text-washi-400">·</span>
                  <button
                    @click="openBulkCreate"
                    class="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
                  >
                    {{ t.bulkCreate }}
                  </button>
                </div>
              </div>

              <!-- Seats List -->
              <div v-if="selectedTable.seats?.length > 0" class="border-t border-washi-200">
                <div
                  v-for="seat in selectedTable.seats"
                  :key="seat.id"
                  class="group"
                >
                  <div
                    :class="[
                      'flex items-center justify-between py-4 border-b border-washi-200 transition-colors',
                      seat.status === 'sold' ? 'opacity-50' : 'hover:bg-paper-warm/50'
                    ]"
                  >
                    <div class="flex items-center gap-4">
                      <!-- Status Dot -->
                      <span :class="[
                        'w-2 h-2 rounded-full flex-shrink-0',
                        seat.status === 'available' ? 'bg-sage' : '',
                        seat.status === 'reserved' ? 'bg-gold' : '',
                        seat.status === 'sold' ? 'bg-washi-400' : ''
                      ]"></span>

                      <!-- Seat Label -->
                      <span class="text-base font-medium text-ink">{{ seat.label }}</span>
                    </div>

                    <div class="flex items-center gap-4">
                      <!-- Price -->
                      <span class="text-sm tabular-nums text-ink-muted">${{ formatPrice(seat.price) }}</span>

                      <!-- Actions (visible on hover) -->
                      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          @click="openEditSeat(seat)"
                          class="w-7 h-7 flex items-center justify-center rounded text-ink-light hover:text-ink hover:bg-washi-200 transition-all"
                          :title="t.editSeat"
                        >
                          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          @click="confirmDeleteSeat(seat)"
                          class="w-7 h-7 flex items-center justify-center rounded text-ink-light hover:text-danger-600 hover:bg-danger-50 transition-all"
                          :title="t.deleteSeat"
                        >
                          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="py-16 text-center">
                <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-washi-200 flex items-center justify-center">
                  <svg class="w-8 h-8 text-ink-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="4" y="4" width="16" height="16" rx="2"/>
                    <path d="M9 9h6M9 13h6M9 17h4"/>
                  </svg>
                </div>
                <p class="text-sm text-ink-muted mb-6">{{ t.noSeatsYet }}</p>
                <button
                  @click="openBulkCreate"
                  class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-sage hover:bg-sage-dark rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  {{ t.createSeats }}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </Transition>
    </div>

    <!-- Modals -->
    <Teleport to="body">
      <!-- Seat Form Modal -->
      <Transition name="modal">
        <div v-if="showSeatModal" class="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-[100] p-5" @click.self="closeSeatModal">
          <div class="modal-card w-full max-w-md bg-white rounded-2xl p-7 shadow-modal font-outfit">
            <h3 class="text-xl font-semibold text-ink mb-6">{{ editingSeat ? t.editSeat : t.addSeat }}</h3>
            <form @submit.prevent="handleSeatSubmit" class="space-y-5">
              <div class="space-y-2">
                <label class="text-sm font-medium text-ink-muted">{{ t.seatLabel }}</label>
                <input
                  v-model="seatForm.label"
                  type="text"
                  :placeholder="t.seatLabelPlaceholder"
                  required
                  class="w-full px-4 py-3 text-ink bg-paper-warm border border-washi-300 rounded-lg focus:outline-none focus:bg-white focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all placeholder:text-ink-light"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-ink-muted">{{ t.price }}</label>
                <input
                  v-model="seatForm.price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  class="w-full px-4 py-3 text-ink bg-paper-warm border border-washi-300 rounded-lg focus:outline-none focus:bg-white focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all placeholder:text-ink-light"
                />
              </div>
              <div class="flex justify-end gap-3 pt-5 mt-6 border-t border-washi-300">
                <button type="button" class="px-5 py-2.5 text-sm font-medium text-ink-muted hover:text-ink hover:bg-paper-warm rounded-lg transition-colors" @click="closeSeatModal">
                  {{ t.cancel }}
                </button>
                <button type="submit" :disabled="seatFormLoading" class="px-5 py-2.5 text-sm font-medium text-white bg-sage hover:bg-sage-dark rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {{ seatFormLoading ? t.saving : (editingSeat ? t.save : t.addSeat) }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>

      <!-- Bulk Create Modal -->
      <Transition name="modal">
        <div v-if="showBulkModal" class="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-[100] p-5" @click.self="showBulkModal = false">
          <div class="modal-card w-full max-w-lg bg-white rounded-2xl p-7 shadow-modal font-outfit">
            <h3 class="text-xl font-semibold text-ink mb-6">{{ t.bulkCreateSeats }}</h3>
            <form @submit.prevent="handleBulkSubmit" class="space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-ink-muted">{{ t.labelPrefix }}</label>
                  <input
                    v-model="bulkForm.prefix"
                    type="text"
                    :placeholder="t.labelPrefixPlaceholder"
                    required
                    class="w-full px-4 py-3 text-ink bg-paper-warm border border-washi-300 rounded-lg focus:outline-none focus:bg-white focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all placeholder:text-ink-light"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-ink-muted">{{ t.numberOfSeats }}</label>
                  <input
                    v-model="bulkForm.count"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="8"
                    required
                    class="w-full px-4 py-3 text-ink bg-paper-warm border border-washi-300 rounded-lg focus:outline-none focus:bg-white focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all placeholder:text-ink-light"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-ink-muted">{{ t.startNumber }}</label>
                  <input
                    v-model="bulkForm.start_number"
                    type="number"
                    placeholder="1"
                    class="w-full px-4 py-3 text-ink bg-paper-warm border border-washi-300 rounded-lg focus:outline-none focus:bg-white focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all placeholder:text-ink-light"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-ink-muted">{{ t.priceEach }}</label>
                  <input
                    v-model="bulkForm.price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    class="w-full px-4 py-3 text-ink bg-paper-warm border border-washi-300 rounded-lg focus:outline-none focus:bg-white focus:border-indigo focus:ring-2 focus:ring-indigo/20 transition-all placeholder:text-ink-light"
                  />
                </div>
              </div>
              <div v-if="bulkPreview.length > 0" class="p-4 bg-sage/10 border border-sage/20 rounded-lg">
                <span class="text-xs font-medium text-sage uppercase tracking-wide">{{ t.preview }}</span>
                <div class="flex flex-wrap gap-2 mt-3">
                  <span v-for="label in bulkPreview.slice(0, 10)" :key="label" class="px-2.5 py-1 text-sm font-medium text-sage bg-white border border-sage/30 rounded-md">
                    {{ label }}
                  </span>
                  <span v-if="bulkPreview.length > 10" class="px-2.5 py-1 text-sm font-medium text-ink-muted">
                    +{{ bulkPreview.length - 10 }} {{ t.more }}
                  </span>
                </div>
              </div>
              <div class="flex justify-end gap-3 pt-5 mt-6 border-t border-washi-300">
                <button type="button" class="px-5 py-2.5 text-sm font-medium text-ink-muted hover:text-ink hover:bg-paper-warm rounded-lg transition-colors" @click="showBulkModal = false">
                  {{ t.cancel }}
                </button>
                <button type="submit" :disabled="bulkLoading || bulkPreview.length === 0" class="px-5 py-2.5 text-sm font-medium text-white bg-sage hover:bg-sage-dark rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {{ bulkLoading ? t.creating : t.createXSeats.replace('{count}', bulkPreview.length) }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Modals -->
    <UiConfirmModal
      :is-open="showDeleteTableModal"
      :title="t.deleteTable"
      :message="t.deleteTableConfirm.replace('{name}', selectedTable?.name || '')"
      :confirm-text="t.delete"
      :cancel-text="t.cancel"
      @confirm="handleDeleteTable"
      @cancel="showDeleteTableModal = false"
    />

    <UiConfirmModal
      :is-open="showDeleteSeatModal"
      :title="t.deleteSeat"
      :message="t.deleteSeatConfirm.replace('{label}', deletingSeat?.label || '')"
      :confirm-text="t.delete"
      :cancel-text="t.cancel"
      @confirm="handleDeleteSeat"
      @cancel="showDeleteSeatModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

definePageMeta({
  layout: 'admin-fullscreen',
  middleware: ['auth', 'admin']
})

const { t: createT } = useLanguage()

const translations = {
  // Header
  floorPlan: { es: 'Plano de Mesas', en: 'Floor Plan' },
  subtitle: { es: 'Da clic en las mesas para administrar, arrastra para acomodar', en: 'Click tables to manage, drag to arrange' },
  tables: { es: 'Mesas', en: 'Tables' },
  seats: { es: 'Asientos', en: 'Seats' },
  available: { es: 'Disponibles', en: 'Available' },
  addTable: { es: 'Agregar Mesa', en: 'Add Table' },
  saving: { es: 'Guardando...', en: 'Saving...' },
  saveLayout: { es: 'Guardar Diseño', en: 'Save Layout' },

  // States
  loadingFloorPlan: { es: 'Cargando plano...', en: 'Loading floor plan...' },
  tryAgain: { es: 'Intentar de nuevo', en: 'Try Again' },
  noTablesYet: { es: 'No hay mesas aún', en: 'No tables yet' },
  createTablesDesc: { es: 'Agrega mesas para empezar a armar tu plano', en: 'Create tables to start designing your floor plan' },
  addFirstTable: { es: 'Agregar Primera Mesa', en: 'Add First Table' },

  // Toolbar tooltips
  zoomIn: { es: 'Acercar', en: 'Zoom In' },
  zoomOut: { es: 'Alejar', en: 'Zoom Out' },
  fitToView: { es: 'Ajustar a la vista', en: 'Fit to View' },
  fullscreen: { es: 'Pantalla completa', en: 'Fullscreen' },
  exitFullscreen: { es: 'Salir de pantalla completa', en: 'Exit Fullscreen' },
  snapToGrid: { es: 'Ajustar a cuadrícula', en: 'Snap to Grid' },

  // Canvas
  stage: { es: 'ESCENARIO', en: 'STAGE' },
  seatsLabel: { es: 'asientos', en: 'seats' },

  // Instructions
  quickControls: { es: 'Controles Rápidos', en: 'Quick Controls' },
  scrollZoom: { es: 'Hacer zoom', en: 'Zoom in/out' },
  dragCanvas: { es: 'Arrastrar lienzo', en: 'Drag canvas' },
  panAround: { es: 'Desplazar', en: 'Pan around' },
  clickTable: { es: 'Clic en mesa', en: 'Click table' },
  openDetails: { es: 'Abrir detalles', en: 'Open details' },
  dragTable: { es: 'Arrastrar mesa', en: 'Drag table' },
  moveTable: { es: 'Mover mesa', en: 'Move table' },
  gotIt: { es: 'Entendido', en: 'Got it' },
  scroll: { es: 'Scroll', en: 'Scroll' },

  // Panel
  newTable: { es: 'Nueva Mesa', en: 'New Table' },
  tableInfo: { es: 'Info de Mesa', en: 'Table Info' },
  tableName: { es: 'Nombre de Mesa', en: 'Table Name' },
  tableNamePlaceholder: { es: 'Ej: Mesa 1, Mesa VIP A', en: 'e.g., Table 1, VIP Table A' },
  capacity: { es: 'Capacidad', en: 'Capacity' },
  price: { es: 'Precio', en: 'Price' },
  sellAsWhole: { es: 'Vender mesa completa', en: 'Sell as whole table' },
  sellAsWholeDesc: { es: 'Los clientes compran la mesa completa', en: 'Customers purchase the entire table' },
  sellIndividualDesc: { es: 'Los clientes pueden comprar asientos individuales', en: 'Customers can buy individual seats' },
  active: { es: 'Activa', en: 'Active' },
  activeDesc: { es: 'Mesa disponible para apartar', en: 'Table is available for booking' },
  createTable: { es: 'Crear Mesa', en: 'Create Table' },
  saveChanges: { es: 'Guardar Cambios', en: 'Save Changes' },
  deleteTable: { es: 'Eliminar Mesa', en: 'Delete Table' },

  // Seats
  seatsTotal: { es: 'asientos', en: 'seats' },
  availableLabel: { es: 'disponibles', en: 'available' },
  soldLabel: { es: 'vendidos', en: 'sold' },
  bulkCreate: { es: 'Crear Varios', en: 'Bulk Create' },
  addSeat: { es: 'Agregar Asiento', en: 'Add Seat' },
  noSeatsYet: { es: 'No hay asientos creados', en: 'No seats created yet' },
  createSeats: { es: 'Crear Asientos', en: 'Create Seats' },
  editSeat: { es: 'Editar Asiento', en: 'Edit Seat' },
  seatLabel: { es: 'Etiqueta del Asiento', en: 'Seat Label' },
  seatLabelPlaceholder: { es: 'Ej: A1, B2', en: 'e.g., A1, B2' },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  save: { es: 'Guardar', en: 'Save' },

  // Bulk create
  bulkCreateSeats: { es: 'Crear Varios Asientos', en: 'Bulk Create Seats' },
  labelPrefix: { es: 'Prefijo', en: 'Label Prefix' },
  labelPrefixPlaceholder: { es: 'Ej: A, Asiento-', en: 'e.g., A, Seat-' },
  numberOfSeats: { es: 'Cantidad', en: 'Number of Seats' },
  startNumber: { es: 'Número Inicial', en: 'Start Number' },
  priceEach: { es: 'Precio c/u', en: 'Price Each' },
  preview: { es: 'Vista previa:', en: 'Preview:' },
  more: { es: 'más', en: 'more' },
  creating: { es: 'Creando...', en: 'Creating...' },
  createXSeats: { es: 'Crear {count} Asientos', en: 'Create {count} Seats' },

  // Delete modals
  deleteSeat: { es: 'Eliminar Asiento', en: 'Delete Seat' },
  deleteTableConfirm: { es: '¿Seguro que quieres eliminar \'{name}\'? También se van a eliminar todos los asientos.', en: 'Are you sure you want to delete \'{name}\'? This will also delete all seats.' },
  deleteSeatConfirm: { es: '¿Seguro que quieres eliminar el asiento \'{label}\'?', en: 'Are you sure you want to delete seat \'{label}\'?' },
  delete: { es: 'Eliminar', en: 'Delete' },

  // Toast messages
  tableCreated: { es: 'Mesa creada', en: 'Table created' },
  tableUpdated: { es: 'Mesa actualizada', en: 'Table updated' },
  tableDeleted: { es: 'Mesa eliminada', en: 'Table deleted' },
  seatCreated: { es: 'Asiento creado', en: 'Seat created' },
  seatUpdated: { es: 'Asiento actualizado', en: 'Seat updated' },
  seatDeleted: { es: 'Asiento eliminado', en: 'Seat deleted' },
  seatsCreated: { es: 'Asientos creados', en: 'Seats created' },
  layoutSaved: { es: 'Diseño guardado', en: 'Layout saved' },
  errorOccurred: { es: 'Ocurrió un error', en: 'An error occurred' }
}

const t = createT(translations)

const route = useRoute()
const toast = useToast()
const { getEvent } = useEvents()
const { getTables, createTable, updateTable, deleteTable } = useTables()
const { getSeats, createSeat, createSeatsBulk, updateSeat, deleteSeat } = useSeats()

const event = ref(null)
const tables = ref([])
const loading = ref(true)
const error = ref('')
const savingPositions = ref(false)
const hasUnsavedChanges = ref(false)
const showInstructions = ref(true)

// Canvas state
const canvasContainer = ref(null)
const zoom = ref(0.7)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const panStartX = ref(0)
const panStartY = ref(0)
const gridSnap = ref(true)
const gridSize = 25
const isFullscreen = ref(false)

// Drag state
const draggingTable = ref(null)
const dragStartX = ref(0)
const dragStartY = ref(0)
const tableStartX = ref(0)
const tableStartY = ref(0)
const hasDragged = ref(false)

// Panel state
const selectedTable = ref(null)
const isCreatingTable = ref(false)
const panelTab = ref('info')

// Table form
const tableForm = ref({
  name: '',
  capacity: 8,
  price: '',
  sell_as_whole: true,
  is_active: true
})
const tableFormLoading = ref(false)

// Seat form
const showSeatModal = ref(false)
const editingSeat = ref(null)
const seatForm = ref({ label: '', price: '' })
const seatFormLoading = ref(false)

// Bulk create
const showBulkModal = ref(false)
const bulkForm = ref({ prefix: '', count: 8, start_number: 1, price: '' })
const bulkLoading = ref(false)

// Delete modals
const showDeleteTableModal = ref(false)
const showDeleteSeatModal = ref(false)
const deletingSeat = ref(null)

// Computed
const totalSeats = computed(() => {
  return tables.value.reduce((total, table) => {
    if (table.sell_as_whole) return total + table.capacity
    return total + (table.seats?.length || 0)
  }, 0)
})

const availableSeats = computed(() => {
  return tables.value.reduce((total, table) => {
    if (table.sell_as_whole) {
      return total + (table.status === 'available' ? table.capacity : 0)
    }
    return total + (table.seats?.filter(s => s.status === 'available').length || 0)
  }, 0)
})

const tableAvailableSeats = computed(() => {
  return selectedTable.value?.seats?.filter(s => s.status === 'available').length || 0
})

const tableSoldSeats = computed(() => {
  return selectedTable.value?.seats?.filter(s => s.status === 'sold').length || 0
})

const bulkPreview = computed(() => {
  if (!bulkForm.value.prefix || !bulkForm.value.count) return []
  const labels = []
  const count = Math.min(parseInt(bulkForm.value.count) || 0, 50)
  const start = parseInt(bulkForm.value.start_number) || 1
  for (let i = 0; i < count; i++) {
    labels.push(`${bulkForm.value.prefix}${start + i}`)
  }
  return labels
})

const formatPrice = (price) => Number(price || 0).toFixed(0)

// Data fetching
const fetchData = async () => {
  loading.value = true
  error.value = ''

  try {
    const [eventRes, tablesRes] = await Promise.all([
      getEvent(route.params.slug),
      getTables(route.params.slug)
    ])

    event.value = eventRes.event
    tables.value = tablesRes.tables || []

    if (event.value?.seating_type !== 'seated') {
      navigateTo(`/app/admin/events/${route.params.slug}`)
    }

    nextTick(() => {
      setTimeout(() => centerOnContent(), 100)
    })
  } catch (e) {
    error.value = e.message || 'Failed to load floor plan'
  } finally {
    loading.value = false
  }
}

const fetchTableSeats = async (tableId) => {
  try {
    const res = await getSeats(route.params.slug, tableId)
    const table = tables.value.find(t => t.id === tableId)
    if (table) {
      table.seats = res.seats || []
    }
    if (selectedTable.value?.id === tableId) {
      selectedTable.value = { ...table }
    }
  } catch (e) {
    console.error('Failed to fetch seats:', e)
  }
}

// Panel functions
const openCreateTable = () => {
  isCreatingTable.value = true
  selectedTable.value = { id: 'new' }
  panelTab.value = 'info'
  tableForm.value = {
    name: `Table ${tables.value.length + 1}`,
    capacity: 8,
    price: '',
    sell_as_whole: true,
    is_active: true
  }
}

const closePanel = () => {
  selectedTable.value = null
  isCreatingTable.value = false
  panelTab.value = 'info'
}

const selectTable = (table) => {
  if (isCreatingTable.value) return
  selectedTable.value = { ...table }
  panelTab.value = 'info'
  tableForm.value = {
    name: table.name || '',
    capacity: table.capacity || 8,
    price: table.price || '',
    sell_as_whole: table.sell_as_whole !== false,
    is_active: table.is_active !== false
  }
  if (!table.sell_as_whole) {
    fetchTableSeats(table.id)
  }
}

// Table CRUD
const handleTableSubmit = async () => {
  tableFormLoading.value = true
  try {
    const data = {
      name: tableForm.value.name,
      capacity: parseInt(tableForm.value.capacity) || 8,
      price: parseFloat(tableForm.value.price) || 0,
      sell_as_whole: tableForm.value.sell_as_whole,
      is_active: tableForm.value.is_active,
      position_x: isCreatingTable.value ? Math.round(200 + Math.random() * 400) : Math.round(selectedTable.value.position_x),
      position_y: isCreatingTable.value ? Math.round(150 + Math.random() * 300) : Math.round(selectedTable.value.position_y)
    }

    if (isCreatingTable.value) {
      const res = await createTable(route.params.slug, data)
      // Add new table locally instead of re-fetching to preserve unsaved positions
      if (res.table) {
        res.table.seats = []
        tables.value.push(res.table)
      }
      isCreatingTable.value = false
      closePanel()
      toast.success(t.tableCreated)
    } else {
      const res = await updateTable(route.params.slug, selectedTable.value.id, data)
      // Update table locally instead of re-fetching to preserve unsaved positions
      const index = tables.value.findIndex(t => t.id === selectedTable.value.id)
      if (index !== -1 && res.table) {
        // Preserve current position and seats
        const currentTable = tables.value[index]
        tables.value[index] = {
          ...res.table,
          position_x: currentTable.position_x,
          position_y: currentTable.position_y,
          seats: currentTable.seats
        }
        selectTable(tables.value[index])
      }
      toast.success(t.tableUpdated)
    }
  } catch (e) {
    toast.error(e.message || t.errorOccurred)
  } finally {
    tableFormLoading.value = false
  }
}

const confirmDeleteTable = () => {
  showDeleteTableModal.value = true
}

const handleDeleteTable = async () => {
  try {
    const deletedId = selectedTable.value.id
    await deleteTable(route.params.slug, deletedId)
    showDeleteTableModal.value = false
    closePanel()
    // Remove table locally instead of re-fetching to preserve unsaved positions
    tables.value = tables.value.filter(t => t.id !== deletedId)
    toast.success(t.tableDeleted)
  } catch (e) {
    toast.error(e.message || t.errorOccurred)
    showDeleteTableModal.value = false
  }
}

// Seat CRUD
const openAddSeat = () => {
  editingSeat.value = null
  seatForm.value = { label: '', price: '' }
  showSeatModal.value = true
}

const openEditSeat = (seat) => {
  editingSeat.value = seat
  seatForm.value = { label: seat.label, price: seat.price }
  showSeatModal.value = true
}

const closeSeatModal = () => {
  showSeatModal.value = false
  editingSeat.value = null
}

const handleSeatSubmit = async () => {
  seatFormLoading.value = true
  try {
    const data = {
      label: seatForm.value.label,
      price: parseFloat(seatForm.value.price) || 0,
      is_active: true
    }

    if (editingSeat.value) {
      await updateSeat(route.params.slug, editingSeat.value.id, data)
      toast.success(t.seatUpdated)
    } else {
      await createSeat(route.params.slug, selectedTable.value.id, data)
      toast.success(t.seatCreated)
    }
    closeSeatModal()
    await fetchTableSeats(selectedTable.value.id)
  } catch (e) {
    toast.error(e.message || t.errorOccurred)
  } finally {
    seatFormLoading.value = false
  }
}

const openBulkCreate = () => {
  bulkForm.value = { prefix: '', count: 8, start_number: 1, price: '' }
  showBulkModal.value = true
}

const handleBulkSubmit = async () => {
  bulkLoading.value = true
  try {
    const seats = bulkPreview.value.map(label => ({
      label,
      price: parseFloat(bulkForm.value.price) || 0,
      is_active: true
    }))
    await createSeatsBulk(route.params.slug, selectedTable.value.id, seats)
    showBulkModal.value = false
    await fetchTableSeats(selectedTable.value.id)
    toast.success(t.seatsCreated)
  } catch (e) {
    toast.error(e.message || t.errorOccurred)
  } finally {
    bulkLoading.value = false
  }
}

const confirmDeleteSeat = (seat) => {
  deletingSeat.value = seat
  showDeleteSeatModal.value = true
}

const handleDeleteSeat = async () => {
  try {
    await deleteSeat(route.params.slug, deletingSeat.value.id)
    showDeleteSeatModal.value = false
    deletingSeat.value = null
    await fetchTableSeats(selectedTable.value.id)
    toast.success(t.seatDeleted)
  } catch (e) {
    toast.error(e.message || t.errorOccurred)
    showDeleteSeatModal.value = false
  }
}

// Drag functions
const startDrag = (e, table) => {
  draggingTable.value = table
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  tableStartX.value = table.position_x
  tableStartY.value = table.position_y
  hasDragged.value = false

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', endDrag)
}

const onDrag = (e) => {
  if (!draggingTable.value) return

  const deltaX = (e.clientX - dragStartX.value) / zoom.value
  const deltaY = (e.clientY - dragStartY.value) / zoom.value

  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
    hasDragged.value = true
  }

  let newX = tableStartX.value + deltaX
  let newY = tableStartY.value + deltaY

  if (gridSnap.value) {
    newX = Math.round(newX / gridSize) * gridSize
    newY = Math.round(newY / gridSize) * gridSize
  }

  draggingTable.value.position_x = Math.max(0, newX)
  draggingTable.value.position_y = Math.max(100, newY)

  hasUnsavedChanges.value = true
}

const endDrag = () => {
  if (draggingTable.value && !hasDragged.value) {
    selectTable(draggingTable.value)
  }
  draggingTable.value = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
}

// Pan functions
const startPan = (e) => {
  if (draggingTable.value) return
  isPanning.value = true
  panStartX.value = e.clientX - panX.value
  panStartY.value = e.clientY - panY.value
}

const onPan = (e) => {
  if (!isPanning.value || draggingTable.value) return
  panX.value = e.clientX - panStartX.value
  panY.value = e.clientY - panStartY.value
}

const endPan = () => {
  isPanning.value = false
}

const onWheel = (e) => {
  const container = canvasContainer.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const cursorX = e.clientX - rect.left
  const cursorY = e.clientY - rect.top

  const delta = e.deltaY > 0 ? -0.08 : 0.08
  const oldZoom = zoom.value
  const newZoom = Math.min(2, Math.max(0.3, oldZoom + delta))

  if (newZoom === oldZoom) return

  const contentX = (cursorX - panX.value) / oldZoom
  const contentY = (cursorY - panY.value) / oldZoom

  zoom.value = newZoom

  panX.value = cursorX - contentX * newZoom
  panY.value = cursorY - contentY * newZoom
}

const zoomIn = () => zoom.value = Math.min(2, zoom.value + 0.15)
const zoomOut = () => zoom.value = Math.max(0.3, zoom.value - 0.15)

const centerOnContent = (targetZoom = null) => {
  const container = canvasContainer.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const containerWidth = rect.width
  const containerHeight = rect.height

  if (tables.value.length > 0) {
    const tableWidth = 140
    const tableHeight = 110
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    tables.value.forEach(table => {
      minX = Math.min(minX, table.position_x)
      minY = Math.min(minY, table.position_y)
      maxX = Math.max(maxX, table.position_x + tableWidth)
      maxY = Math.max(maxY, table.position_y + tableHeight)
    })

    minY = Math.min(minY, 10)
    maxY = Math.max(maxY, 70)

    const contentCenterX = (minX + maxX) / 2
    const contentCenterY = (minY + maxY) / 2

    const contentWidth = maxX - minX + 100
    const contentHeight = maxY - minY + 100
    const fitZoomX = containerWidth / contentWidth
    const fitZoomY = containerHeight / contentHeight
    const fitZoom = Math.min(fitZoomX, fitZoomY, 1) * 0.85

    zoom.value = targetZoom ?? fitZoom
    panX.value = (containerWidth / 2) - (contentCenterX * zoom.value)
    panY.value = (containerHeight / 2) - (contentCenterY * zoom.value)
  } else {
    zoom.value = targetZoom ?? 0.7
    panX.value = (containerWidth / 2) - (700 * zoom.value)
    panY.value = (containerHeight / 2) - (300 * zoom.value)
  }
}

const fitToView = () => centerOnContent()

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}

const saveAllPositions = async () => {
  if (!hasUnsavedChanges.value) return
  savingPositions.value = true

  try {
    for (const table of tables.value) {
      await updateTable(route.params.slug, table.id, {
        position_x: Math.round(table.position_x),
        position_y: Math.round(table.position_y)
      })
    }
    hasUnsavedChanges.value = false
    toast.success(t.layoutSaved)
  } catch (e) {
    toast.error(e.message || t.errorOccurred)
  } finally {
    savingPositions.value = false
  }
}

const handleBeforeUnload = (e) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  fetchData()
  window.addEventListener('beforeunload', handleBeforeUnload)
  document.addEventListener('fullscreenchange', onFullscreenChange)
  setTimeout(() => {
    showInstructions.value = false
  }, 4000)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap');

.floor-plan-page {
  --font: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Japanese-inspired palette */
  --paper: #FAF8F5;
  --paper-warm: #F5F3EF;
  --ink: #1C1917;
  --ink-light: #44403C;
  --ink-muted: #78716C;
  --ink-faint: #A8A29E;
  --stone: #E7E5E4;
  --stone-dark: #D6D3D1;

  /* Accent colors */
  --indigo: #4338CA;
  --indigo-light: #6366F1;
  --indigo-soft: rgba(67, 56, 202, 0.1);
  --sage: #6B9080;
  --sage-soft: rgba(107, 144, 128, 0.15);
  --gold: #B08968;
  --gold-soft: rgba(176, 137, 104, 0.15);
  --coral: #DC6B6B;
  --coral-soft: rgba(220, 107, 107, 0.1);

  --header-h: 64px;
  --panel-w: 380px;
  --radius: 12px;
  --radius-sm: 8px;

  font-family: var(--font);
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--paper);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}

/* ========== HEADER ========== */
.editor-header {
  height: var(--header-h);
  background: rgba(250, 248, 245, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--stone);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  gap: 24px;
  flex-shrink: 0;
  z-index: 20;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  flex: 1;
}

.back-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  color: var(--ink-muted);
  transition: all 0.2s ease;
}

.back-link:hover {
  background: var(--stone);
  color: var(--ink);
}

.back-link svg {
  width: 20px;
  height: 20px;
}

.header-info h1 {
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
  letter-spacing: -0.02em;
}

.header-center {
  display: none;
}

@media (min-width: 900px) {
  .header-center {
    display: flex;
  }
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 8px 20px;
  background: white;
  border-radius: 100px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
}

.stat-label {
  font-size: 12px;
  font-weight: 400;
  color: var(--ink-muted);
  text-transform: lowercase;
}

.stat.accent .stat-value {
  color: var(--sage);
}

.stat-divider {
  width: 1px;
  height: 20px;
  background: var(--stone);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--stone);
  border-radius: var(--radius);
  background: white;
  color: var(--ink);
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-btn svg {
  width: 18px;
  height: 18px;
}

.header-btn span {
  display: none;
}

@media (min-width: 640px) {
  .header-btn span {
    display: inline;
  }
}

.header-btn:hover {
  background: var(--paper-warm);
  border-color: var(--stone-dark);
}

.header-btn.primary {
  background: var(--stone);
  border-color: var(--stone);
  color: var(--ink-muted);
}

.header-btn.primary.active {
  background: var(--indigo);
  border-color: var(--indigo);
  color: white;
}

.header-btn.primary.active:hover {
  background: var(--indigo-light);
}

.header-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========== STATE VIEWS ========== */
.state-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px;
  text-align: center;
}

.loader-zen {
  position: relative;
  width: 48px;
  height: 48px;
}

.loader-circle {
  width: 100%;
  height: 100%;
  border: 2px solid var(--stone);
  border-top-color: var(--indigo);
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

.state-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--stone);
}

.state-icon svg {
  width: 28px;
  height: 28px;
  color: var(--ink-muted);
}

.state-icon.error {
  background: var(--coral-soft);
}

.state-icon.error svg {
  color: var(--coral);
}

.state-text {
  font-size: 15px;
  color: var(--ink-muted);
  margin: 0;
  max-width: 300px;
}

.state-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  background: white;
  border: 1px solid var(--stone);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s ease;
}

.state-btn:hover {
  border-color: var(--stone-dark);
  background: var(--paper-warm);
}

.state-btn.primary {
  background: var(--indigo);
  border-color: var(--indigo);
  color: white;
}

.state-btn.primary:hover {
  background: var(--indigo-light);
}

.state-btn svg {
  width: 18px;
  height: 18px;
}

/* Empty state zen visual */
.empty-visual {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 8px;
}

.zen-circle {
  position: absolute;
  inset: 20px;
  border: 2px solid var(--stone-dark);
  border-radius: 50%;
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 1; }
}

.zen-lines {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.zen-lines span {
  width: 40px;
  height: 2px;
  background: var(--stone-dark);
  border-radius: 1px;
}

.zen-lines span:nth-child(2) {
  width: 60px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
  letter-spacing: -0.02em;
}

/* ========== EDITOR AREA ========== */
.editor-area {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

/* ========== TOOLBAR ========== */
.toolbar {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: white;
  border: 1px solid var(--stone);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  z-index: 10;
}

.tool-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--ink-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tool-btn:hover:not(:disabled) {
  background: var(--paper-warm);
  color: var(--ink);
}

.tool-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.tool-btn.active {
  background: var(--indigo-soft);
  color: var(--indigo);
}

.tool-btn svg {
  width: 18px;
  height: 18px;
}

.zoom-display {
  font-size: 11px;
  font-weight: 500;
  color: var(--ink-muted);
  padding: 4px 0;
}

.tool-sep {
  width: 20px;
  height: 1px;
  background: var(--stone);
  margin: 4px 0;
}

/* ========== CANVAS ========== */
.canvas {
  flex: 1;
  overflow: hidden;
  cursor: grab;
  position: relative;
  transition: margin-right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.canvas.panel-open {
  margin-right: var(--panel-w);
}

@media (max-width: 1024px) {
  .canvas.panel-open {
    margin-right: 0;
  }
}

.canvas.panning {
  cursor: grabbing;
}

.canvas.dragging {
  cursor: move;
}

.canvas-world {
  position: relative;
  width: 1400px;
  height: 1000px;
  transform-origin: 0 0;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle, var(--stone) 1px, transparent 1px);
  background-size: 25px 25px;
  opacity: 0.5;
}

/* ========== STAGE ========== */
.stage-element {
  position: absolute;
  top: 20px;
  left: 100px;
  right: 100px;
  height: 70px;
}

.stage-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #E7E5E4 0%, #D6D3D1 100%);
  border: 1px solid #A8A29E;
  border-radius: 0 0 50% 50% / 0 0 30% 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.stage-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: #57534E;
}

/* ========== TABLE CARDS ========== */
.table-card {
  position: absolute;
  width: 140px;
  background: white;
  border: 1px solid var(--stone);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s ease;
  user-select: none;
}

.table-card:hover {
  border-color: var(--stone-dark);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.table-card.is-dragging {
  box-shadow: 0 16px 40px rgba(67, 56, 202, 0.2);
  border-color: var(--indigo);
  z-index: 100;
  transform: scale(1.02);
}

.table-card.is-selected {
  border-color: var(--indigo);
  box-shadow: 0 0 0 3px var(--indigo-soft), 0 8px 24px rgba(0,0,0,0.08);
}

.table-card.is-sold {
  opacity: 0.6;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--ink);
}

.table-name {
  font-size: 12px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-body {
  padding: 14px 12px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.whole-table-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--ink-muted);
}

.whole-table-info svg {
  width: 24px;
  height: 24px;
}

.whole-table-info span {
  font-size: 13px;
  font-weight: 500;
}

.seats-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.seat-pip {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: var(--sage-soft);
  border: 1px solid var(--sage);
}

.seat-pip.reserved {
  background: var(--gold-soft);
  border-color: var(--gold);
}

.seat-pip.sold {
  background: var(--stone);
  border-color: var(--stone-dark);
}

.seats-overflow {
  font-size: 10px;
  font-weight: 500;
  color: var(--ink-muted);
  padding: 0 4px;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--paper-warm);
  border-top: 1px solid var(--stone);
}

.table-price {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
}

.table-seats {
  font-size: 11px;
  color: var(--ink-muted);
}

/* ========== DRAG TOOLTIP ========== */
.drag-tooltip {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
  background: white;
  border: 1px solid var(--stone);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* ========== WELCOME OVERLAY ========== */
.welcome-overlay {
  position: absolute;
  inset: 0;
  background: rgba(250, 248, 245, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15;
}

.welcome-card {
  background: white;
  border: 1px solid var(--stone);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  max-width: 320px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
}

.welcome-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--indigo-soft);
  border-radius: 16px;
}

.welcome-icon svg {
  width: 28px;
  height: 28px;
  color: var(--indigo);
}

.welcome-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 20px 0;
}

.controls-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.control-item kbd {
  flex-shrink: 0;
  padding: 4px 10px;
  font-family: var(--font);
  font-size: 11px;
  font-weight: 500;
  color: var(--ink);
  background: var(--paper-warm);
  border: 1px solid var(--stone);
  border-radius: 6px;
}

.control-item span {
  font-size: 13px;
  color: var(--ink-muted);
}

.welcome-btn {
  width: 100%;
  padding: 14px;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: var(--indigo);
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s ease;
}

.welcome-btn:hover {
  background: var(--indigo-light);
}

/* ========== SIDE PANEL ========== */
.side-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: var(--panel-w);
  height: 100%;
  background: white;
  border-left: 1px solid var(--stone);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

@media (max-width: 1024px) {
  .side-panel {
    width: 100%;
    max-width: 420px;
    box-shadow: -20px 0 60px rgba(0,0,0,0.1);
  }
}

/* Panel styles moved to Tailwind classes */

/* Form, button, seats, modal, and preview styles moved to Tailwind classes */

/* ========== TRANSITIONS ========== */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.panel-enter-active,
.panel-leave-active {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-enter-from,
.panel-leave-to {
  transform: translateX(100%);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.2s ease;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: scale(0.95);
}

/* ========== MOBILE ========== */
@media (max-width: 640px) {
  .editor-header {
    padding: 0 16px;
  }

  .toolbar {
    left: 12px;
    padding: 6px;
  }

  .tool-btn {
    width: 32px;
    height: 32px;
  }

  .panel-body {
    padding: 20px;
  }
}
</style>
