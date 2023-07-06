<template>
  <div class="flex items-center mt-6">
    <div class="mr-4 w-40">
      <form autocomplete="off" novalidate>
        <j-input
          aria-label="search"
          icon="search"
          :value="projectFilters.searchTerm"
          @input="handleInput"
        />
      </form>
    </div>
    <j-select
      searchable
      variant="empty"
      :dropdownWidth="300"
      :withClearValue="false"
      :options="issueStatusOptions"
      :placeholder="'Select Status'"
      @change="updateIssueStatus"
      :value="projectFilters.status"
      customRender
      customRenderOption
    >
      <template v-slot:default="{ label }">
        <j-button
          class="uppercase text-textMedium text-13"
          :variant="issueStatusVariants[projectFilters.status]"
        >
          {{ label }}
        </j-button>
      </template>
      <template v-slot:option="{ label }">
        <div class="flex items-center pr-1 pl-2">
          <div class="text-15 pr-1 pl-2">
            {{ label }}
          </div>
        </div>
      </template>
    </j-select>
    <j-button
      :isActive="projectFilters.recent"
      class="ml-3"
      variant="empty"
      @click="handleRecent"
      >Recently Updated</j-button
    >
    <div class="ml-3 flex items-center" v-if="!areFiltersCleared">
      <div class="mr-3 w-px bg-backgroundMedium self-stretch"></div>
      <j-button variant="secondary" @click="handleReset">Clear all</j-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import { getters } from '@/store'
import { Filters } from '@/types/filters'
import { debounce } from 'throttle-debounce'
import { IssueStatus, IssueStatusCopy } from '@/types/issue'
import { issueStatusVariants } from '@/utils/colors'

export default defineComponent({
  setup(props, { emit }) {
    const projectFilters = computed(getters.filters)
    const project = computed(getters.project)

    const filters = ref<Filters>(projectFilters.value || {})

    const newFilter = (filter: Partial<Filters> | Function) => {
      filters.value = { ...filters.value, ...filter }
      emit('change', filters.value)
    }

    const handleInput = debounce(500, (newValue: string) => {
      newFilter({ searchTerm: newValue })
    })

    const handleRecent = () =>
      newFilter({ recent: !projectFilters.value.recent })

    const handleReset = () =>
      newFilter({
        searchTerm: '',
        recent: false,
        status: 'all'
      })
    // Handle status
    const issueStatusOptions = Object.values(IssueStatus).map(status => ({
      value: status,
      label: IssueStatusCopy[status]
    }))

    const updateIssueStatus = async (status: IssueStatus) => {
      newFilter({ status })
    }

    const areFiltersCleared = computed(() => {
      return (
        !projectFilters.value.searchTerm &&
        !projectFilters.value.recent &&
        !(projectFilters.value.status !== 'all')
      )
    })

    return {
      project,
      projectFilters,
      handleInput,
      handleRecent,
      handleReset,
      areFiltersCleared,
      issueStatusOptions,
      updateIssueStatus,
      issueStatusVariants
    }
  }
})
</script>

<style lang="scss" scoped>
.active {
  box-shadow: 0 0 0 4px #1255b9;
}
.lift:hover {
  transform: translateY(-5px);
}
</style>
