<template>
  <div class="w-full h-full flex">
    <Navigation @onResize="handleNavigationResize" :expanded="expanded" />
    <div :style="getContentStyles" id="content">
      <router-view class="page" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from '@vue/composition-api'
import Navigation from '@/components/Navigation/Navigation.vue'
import { mutations } from '@/store'

export default defineComponent({
  components: {
    Navigation
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
    // Set Local data
    const projectLocal = localStorage.getItem('project')
    if (projectLocal) {
      mutations.setProject(JSON.parse(projectLocal))
    }
    return {
      expanded,
      handleNavigationResize,
      getContentStyles
    }
  }
})
</script>
