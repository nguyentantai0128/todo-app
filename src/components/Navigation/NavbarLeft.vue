<template>
  <aside class="navbarLeft">
    <div class="navbarLeft-content">
      <div class="logoLink">
        <svg class="logo" viewBox="0 0 128 128" width="24" height="24">
          <path
            fill="#42b883"
            d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z"
          ></path>
          <path
            fill="#35495e"
            d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z"
          ></path>
        </svg>
      </div>

      <div v-for="(item, index) in items" :key="index" class="item">
        <div @click="item.handler" v-tippy="item.tooltip" class="itemIcon">
          <j-icon class="text-white" :name="item.icon" :size="24"></j-icon>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import eventBus from '@/utils/eventBus'

export default defineComponent({
  setup() {
    const items = [
      {
        icon: 'search',
        tooltip: 'Search issue',
        handler: () => {
          eventBus.$emit('toggle-issue-search', true)
        }
      },
      {
        icon: 'plus',
        tooltip: 'Create issue',
        handler: () => {
          eventBus.$emit('toggle-issue-create', true)
        }
      }
    ]

    return {
      items
    }
  }
})
</script>

<style lang="postcss" scoped>
.navbarLeft-content {
  @apply h-screen w-navbarLeft pt-6 pb-5 flex flex-col bg-default flex-shrink-0;
}

.logoLink {
  @apply relative pb-2 flex items-center justify-center;
}

.item {
  @apply relative w-full flex items-center justify-center;
  min-height: 42px;
}

.itemIcon {
  @apply w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 select-none transition-colors duration-100 cursor-pointer;
}

.itemIcon:hover {
  background: rgb(30, 97, 106);
}
</style>
