<template>
  <div class="pr-6 py-8 pl-10 h-full w-full flex flex-col">
    <j-breadcrumbs :items="['Projects', project.name, 'Board']" />
    <header class="mt-3 flex justify-between text-textDarkest">
      <div class="text-2xl font-medium">Board</div>
    </header>
    <appFilters @change="handleFiltersChange" />
    <Lists />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import appFilters from '@/components/Project/Filters.vue'
import Lists from '@/components/Project/Lists/Lists.vue'
import { Filters } from '@/types/filters'
import { mutations, getters } from '@/store'
export default defineComponent({
  components: {
    appFilters,
    Lists
  },
  setup() {
    const project = computed(getters.project)
    const handleFiltersChange = (f: Filters) => {
      mutations.setFilters(f)
    }

    return {
      project,
      handleFiltersChange
    }
  }
})
</script>

<style></style>
