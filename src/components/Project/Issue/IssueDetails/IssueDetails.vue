<template>
  <div class="w-full h-full">
    <div class="md:flex items-center px-3 pt-4 text-textDarkest">
      <!-- Type -->
      <IssueType
        :updateIssue="handleUpdateIssue"
        :issueId="issueCopy.id"
        :value="issueCopy.type"
      />
      <div class="flex-auto"></div>
      <j-button @click="copyIssueLink" icon="link" variant="empty"
        >Copy Link</j-button
      >
      <j-button @click="triggerIssueDelete" icon="trash" variant="empty" />
      <j-button
        v-if="withFullScreenButton"
        @click="goFullScreen"
        icon="expand"
        :iconSize="24"
        variant="empty"
      />
      <j-button
        v-if="withCloseButton"
        @click="$emit('close')"
        icon="times"
        :iconSize="24"
        variant="empty"
      />
    </div>
    <div class="flex w-full flex-wrap pb-16 px-7">
      <!-- LEFT SECTION -->
      <div class="sm:w-full md:w-7/12 lg:w-4/6 pr-10">
        <!-- Title -->
        <IssueTitle :updateIssue="handleUpdateIssue" :value="issueCopy.title" />
        <!-- Description -->
        <IssueDescription
          :updateIssue="handleUpdateIssue"
          :initialValue="issueCopy.description || undefined"
        />
      </div>
      <!-- RIGHT SECTION -->
      <div class="sm:w-full md:w-5/12 lg:w-2/6 pt-1">
        <!-- STATUS -->
        <IssueStatus
          :updateIssue="handleUpdateIssue"
          :value="issueCopy.status"
        />
        <!-- PRIORITY -->
        <IssuePriority
          :value="issueCopy.priority"
          :updateIssue="handleUpdateIssue"
        />
        <!-- DATES -->
        <div
          class="mt-3 pt-3 leading-loose border-t border-borderLightest text-textMedium text-13"
        >
          <div>
            Created - {{ formatDateTimeConversational(issueCopy.createdAt) }}
          </div>
          <div v-if="issueCopy.updatedAt">
            Updated - {{ formatDateTimeConversational(issueCopy.updatedAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  defineComponent,
  ref,
  computed,
  onUnmounted,
} from '@vue/composition-api'
import { useClipboard } from '@/hooks/useClipboard'
import { Issue } from '@/types/issue'
import IssueDescription from './Description.vue'
import IssueTitle from './Title.vue'
import IssueType from './Type.vue'
import IssueStatus from './Status.vue'
import IssuePriority from './Priority.vue'
import { formatDateTimeConversational } from '@/utils/date'
import { getters, mutations } from '@/store'
import eventBus from '@/utils/eventBus'
import { updateArrayItemById } from '../../../../utils/dnd'

export default defineComponent({
  components: {
    IssueDescription,
    IssueTitle,
    IssueType,
    IssueStatus,
    IssuePriority
  },
  props: {
    issueId: {
      type: String,
      required: true
    },
    withCloseButton: {
      type: Boolean,
      default: true
    },
    withFullScreenButton: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { root, emit }) {
    const issueCopy = ref<Issue>(undefined)
    const project = computed(getters.project)
    if (props && props.issueId && props.issueId.length > 0) {
      const indexRouter = project.value.issues.findIndex(
        item => item.id === props.issueId
      )
      issueCopy.value = project.value.issues[indexRouter]
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setClipboard] = useClipboard()

    const copyIssueLink = async () => {
      const path =
        window.location.origin +
        root.$router.resolve({
          name: 'issue',
          params: { issueId: props.issueId }
        }).href

      await setClipboard(path)
    }

    const goFullScreen = () => {
      root.$router.push({
        name: 'issue',
        params: { issueId: props.issueId }
      })
      emit('close')
    }

    const handleUpdateIssue = async (fields: Partial<Issue>) => {
      issueCopy.value = { ...issueCopy.value, ...fields } as Issue
      const issueCopyTmp = {
        ...project.value,
        issues: updateArrayItemById(project.value.issues, props.issueId, fields)
      }
      mutations.setProject(issueCopyTmp)
      localStorage.setItem('project', JSON.stringify(issueCopyTmp))
    }
    /* -------- Delete Issue -------- */
    const isDeleteConfirmOpen = ref<boolean>(false)
    const triggerIssueDelete = () => {
      eventBus.$emit('toggle-issue-delete', true, props.issueId)
    }

    const deleteIssueHandler = async () => {
      const indexIssue = project.value.issues.findIndex(
        item => item.id === props.issueId
      )
      project.value.issues.splice(indexIssue, 1)
      localStorage.setItem('project', JSON.stringify(project.value))
      eventBus.$emit('toggle-issue-delete', false)
      eventBus.$emit('toggle-issue-details', false)
      eventBus.$emit('toggle-issue-search', false)
      if (root.$route.name != 'board') {
        root.$router.replace({ name: 'board' })
      }
    }

    eventBus.$on('confirm-issue-delete', deleteIssueHandler)

    onUnmounted(() => {
      eventBus.$off('confirm-issue-delete', deleteIssueHandler)
    })

    return {
      project,
      IssueStatus,
      issueCopy,
      handleUpdateIssue,
      copyIssueLink,
      triggerIssueDelete,
      isDeleteConfirmOpen,
      formatDateTimeConversational,
      deleteIssueHandler,
      goFullScreen
    }
  }
})
</script>

<style scoped>
.formField {
  @apply mt-5;
}
.sep {
  @apply mt-5 border border-backgroundLightest;
}
.formFieldLabel {
  @apply block pb-1-25 text-textMedium text-13 font-medium;
}
.formFieldTip {
  @apply pt-1-5 text-textMedium text-13;
}
</style>

<style lang="scss" scoped>
.error {
  position: absolute;
  right: 0;
  top: 0;
  padding: 2px 10px;
  background: #f53b57;
  color: white;
  font-size: 12px;
  border-bottom-left-radius: 3px;
  border-top-right-radius: 3px;
}
</style>
