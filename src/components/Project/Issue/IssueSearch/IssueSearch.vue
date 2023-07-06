<template>
  <div class="px-8 pb-16 pt-6">
    <div class="relative pr-7 mb-10">
      <j-input
        ref="searchInputRef"
        class="flat text-textMedium"
        icon="search"
        @input="handleSearchChange"
        :value="searchTerm"
        :iconSize="26"
        placeholder="Search issues by summary, description..."
      />
    </div>
    <div class="fadeIn">
      <div v-if="isSearchTermEmpty && recentIssues.length > 0">
        <div class="sectionTitle">Recent Issues</div>
        <SearchResult
          v-for="issue in recentIssues"
          :key="issue.id"
          :issue="issue"
        />
      </div>
      <div v-if="!isSearchTermEmpty && matchingIssues.length > 0">
        <div class="sectionTitle">Matching Issues</div>
        <SearchResult
          v-for="issue in matchingIssues"
          :key="issue.id"
          :issue="issue"
        />
      </div>
      <div
        class="pt-10 flex flex-col justify-center items-center"
        v-if="!isSearchTermEmpty && matchingIssues.length === 0"
      >
        <j-icon :size="125" name="no-result"></j-icon>
        <div class="pt-8 font-medium text-xl">
          We couldn&apos;t find anything matching your search
        </div>
        <div class="pt-2 text-15">Try again with a different term.</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from '@vue/composition-api'
import SearchResult from './SearchResult.vue'
import { getters } from '@/store'
import { debounce } from 'throttle-debounce'
import { CombinedVueInstance } from 'vue/types/vue'
import { Issue } from '@/types'

const sortByNewest = (items: any[] = [], sortField: string) => {
  return items.sort(function(a, b) {
    return new Date(b[sortField]).valueOf() - new Date(a[sortField]).valueOf()
  })
}

const filterIssues = (projectIssues: Array<Issue>, searchTerm: string) => {
  let issues = [...projectIssues]
  if (searchTerm) {
    issues = issues?.filter(issue => {
      if (
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.description &&
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        return issue
      }
    })
  }
  return issues
}

export default defineComponent({
  components: {
    SearchResult
  },
  setup() {
    const isSearchTermEmpty = ref<boolean>(true)
    const searchTerm = ref<string>('')
    const searchInputRef = ref<
      CombinedVueInstance<Vue, object, object, object, object>
    >(null)
    const project = computed(getters.project)

    const matchingIssues = computed(() =>
      filterIssues(project.value.issues, searchTerm.value)
    )
    const recentIssues = computed(() =>
      sortByNewest(project.value.issues, 'createdAt').slice(0, 10)
    )
    const handleSearchChange = debounce(500, (value: string) => {
      searchTerm.value = value.trim()
      isSearchTermEmpty.value = !searchTerm.value
    })

    onMounted(() => {
      if (searchInputRef.value) {
        const inputEl = searchInputRef.value.$el.querySelector('input')
        if (inputEl) {
          inputEl.focus()
        }
      }
    })

    return {
      matchingIssues,
      recentIssues,
      isSearchTermEmpty,
      handleSearchChange,
      searchTerm,
      searchInputRef
    }
  }
})
</script>

<style lang="postcss" scoped>
.sectionTitle {
  @apply text-textMedium font-bold text-xs uppercase pb-3;
}
</style>

<style lang="scss"></style>
