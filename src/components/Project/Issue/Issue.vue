<template>
  <div class="issue-wrap">
    <div @click="openIssueDetails" class="issue">
      <p class="pb-3 text-15 text-textDarkest">
        {{ issue.title }}
      </p>
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <j-icon
            :name="issue.type"
            :size="20"
            class="text-textMedium mr-1"
          ></j-icon>

          <j-icon
            :style="{ color: issuePriorityStyles.color }"
            :name="issuePriorityStyles.icon"
            :size="20"
          ></j-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { Issue, IssuePriority } from '@/types/issue'
import { getters } from '@/store'
import { issuePriorityColors } from '@/utils/colors'
import eventBus from '@/utils/eventBus'

export default defineComponent({
  props: {
    issue: {
      type: Object as () => Issue,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const project = computed(getters.project)

    const issuePriorityStyles = computed(() => ({
      icon: [IssuePriority.LOW].includes(
        props.issue.priority
      )
        ? 'arrow-down'
        : 'arrow-up',
      color: issuePriorityColors[props.issue.priority]
    }))

    const openIssueDetails = () => {
      eventBus.$emit('toggle-issue-details', true, props.issue)
    }

    return {
      project,
      issuePriorityStyles,
      openIssueDetails
    }
  }
})
</script>

<style scoped>
.issue-wrap {
  touch-action: manipulation;
  cursor: grab;
  margin-bottom: 5px;
}
.issue {
  @apply rounded-sm bg-white  transition-all duration-100 select-none;
  padding: 10px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 2px 0px;
}
.issue:hover {
  @apply bg-backgroundLight;
}
</style>
