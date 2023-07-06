<template>
  <div id="root">
    <Modals />
    <div id="app-frame">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api'
import Navigation from '@/components/Navigation/Navigation.vue'
import Modals from '@/components/Modals/Modals.vue'
export default defineComponent({
  components: {
    Navigation,
    Modals
  },
  setup() {
    const expanded = ref<boolean>(true)
    const handleNavigationResize = (isExpanded: boolean) => {
      expanded.value = isExpanded
    }

    const getContentStyles = computed(() => ({
      'padding-left': `${expanded.value ? 240 : 20}` + 'px',
      'margin-left': '64px'
    }))

    const match = window.matchMedia('(max-width: 1100px)')
    const matchHandler = (e: MediaQueryListEventInit) =>
      (expanded.value = !e.matches)

    matchHandler(match)
    match.addListener(matchHandler)

    return {
      expanded,
      handleNavigationResize,
      getContentStyles
    }
  }
})
</script>
