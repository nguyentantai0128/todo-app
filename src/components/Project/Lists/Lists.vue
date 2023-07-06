<template>
  <div class="flex container mt-7">
    <List
      @drop="onDrop"
      v-for="status in IssueStatus"
      v-show="filters.status !== 'all' ? filters.status === status : true"
      :key="status"
      :status="status"
    >
    </List>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@vue/composition-api'
import List from '@/components/Project/Lists/List.vue'
import { IssueStatus } from '@/types/issue'
import { getters, mutations } from '@/store'
import {
  DropResult,
  Target,
  calculateIssueListPosition,
  isPositionChanged,
  updateArrayItemById
} from '@/utils/dnd'

export default defineComponent({
  components: {
    List
  },
  setup() {
    const project = computed(getters.project)
    const filters = computed(getters.filters)

    const destination = ref<Target>(null)
    const source = ref<Target>(null)

    const handleIssueDrop = (issueId: string, d: Target, s: Target) => {
      if (!isPositionChanged(s, d)) return

      const issueUpdateValues = {
        status: d.droppableId,
        listPosition: calculateIssueListPosition(
          project.value.issues,
          d,
          s,
          issueId
        )
      }

      const issues = updateArrayItemById(
        project.value.issues,
        issueId,
        issueUpdateValues
      )

      // optimistic update
      const issueTmp = {
        ...project.value,
        issues
      }
      mutations.setProject(issueTmp)
      localStorage.setItem('project', JSON.stringify(issueTmp))

      destination.value = null
      source.value = null
    }

    const onDrop = (dropResult: DropResult) => {
      const { removedIndex, addedIndex, payload, to } = dropResult

      if (removedIndex == null && addedIndex == null) return

      if (removedIndex != null) {
        source.value = {
          index: removedIndex,
          droppableId: payload.status
        }
      }

      if (addedIndex != null) {
        destination.value = {
          index: addedIndex,
          droppableId: Object.values(IssueStatus)[to]
        }
      }

      if (destination.value != null && source.value != null) {
        handleIssueDrop(payload.id, destination.value, source.value)
      }
    }

    return {
      onDrop,
      IssueStatus,
      filters
    }
  }
})
</script>
