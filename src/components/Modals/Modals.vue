<template>
  <div>
    <Modal
      v-if="isIssueCreateOpen"
      @close="isIssueCreateOpen = false"
      :width="700"
      :component="IssueCreate"
    />

    <Modal
      v-if="isIssueSearchOpen"
      @close="isIssueSearchOpen = false"
      variant="aside"
      :width="600"
      :component="IssueSearch"
    />

    <Modal
      v-if="isIssueDetailsOpen"
      @close="isIssueDetailsOpen = false"
      :width="1040"
      :component="IssueDetails"
      :componentProps="{ issueId }"
    />
    
    <Modal
      v-if="isIssueDeleteOpen"
      @confirm="confirmIssueDelete"
      @close="isIssueDeleteOpen = false"
      :width="600"
      :component="Confirm"
      :componentProps="issueDeleteProps"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, ref } from '@vue/composition-api'
import IssueCreate from '@/components/Project/Issue/IssueCreate/IssueCreate.vue'
import IssueSearch from '@/components/Project/Issue/IssueSearch/IssueSearch.vue'
import IssueDetails from '@/components/Project/Issue/IssueDetails/IssueDetails.vue'
import Confirm from './Confirm.vue'
import Modal from './Modal.vue'
import eventBus from '@/utils/eventBus'
import { Issue } from '@/types'
export default defineComponent({
  components: {
    Modal
  },
  setup() {
    const isIssueCreateOpen = ref<boolean>(false)
    const isIssueSearchOpen = ref<boolean>(false)
    const isIssueDetailsOpen = ref<boolean>(false)
    const isIssueDeleteOpen = ref<boolean>(false)
    const issueId = ref<string>(false)

    eventBus.$on(
      'toggle-issue-details',
      (isOpen: boolean, issueData: Issue) => {
        if (isOpen) {
          issueId.value = issueData.id
        }
        isIssueDetailsOpen.value = isOpen
      }
    )
    eventBus.$on('toggle-issue-search', (isOpen: boolean) => {
      isIssueSearchOpen.value = isOpen
    })
    eventBus.$on('toggle-issue-create', (isOpen: boolean) => {
      isIssueCreateOpen.value = isOpen
    })
    eventBus.$on('toggle-issue-delete', (isOpen: boolean) => {
      isIssueDeleteOpen.value = isOpen
    })

    const issueDeleteProps = {
      title: 'Are you sure you want to delete this issue?',
      message: "Once you delete, it's gone for good.",
      confirmText: 'Delete issue',
      variant: 'dancer'
    }

    const confirmIssueDelete = () => {
      eventBus.$emit('confirm-issue-delete')
    }

    return {
      IssueCreate,
      IssueDetails,
      IssueSearch,
      Confirm,
      isIssueCreateOpen,
      isIssueSearchOpen,
      isIssueDetailsOpen,
      isIssueDeleteOpen,
      issueDeleteProps,
      confirmIssueDelete,
      issueId
    }
  }
})
</script>
