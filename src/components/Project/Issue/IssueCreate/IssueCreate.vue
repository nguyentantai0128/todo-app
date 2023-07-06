<template>
  <div class="w-full h-full py-5 px-8">
    <div class="flex items-center py-3 text-textDarkest">
      <div class="text-xl">
        Create issue
      </div>
      <div class="flex-auto"></div>
      <j-button
        @click="$emit('close')"
        icon="x"
        :iconSize="24"
        variant="empty"
      />
    </div>
    <form novalidate autocomplete="off">
      <div class="formField">
        <label for="issuetype" class="formFieldLabel">Issue type</label>
        <j-select
          id="issuetype"
          :value="issueCreateObject.type"
          searchable
          :options="
            Object.values(IssueType).map(type => ({
              value: type,
              label: IssueTypeCopy[type],
              icon: IssueTypeCopy[type].toLowerCase()
            }))
          "
          @change="setFieldValue('type', $event)"
          customRender
        >
          <template v-slot:default="{ label, icon }">
            <div class="my-px mr-4 flex items-center">
              <j-icon class="mr-1" :size="16" :name="icon"></j-icon>
              <div class="pr-1 pl-2">
                {{ label }}
              </div>
            </div>
          </template>
        </j-select>
      </div>

      <div class="formField ">
        <label class="formFieldLabel" for="summary">Short Summary</label>
        <div class="relative">
          <j-input
            :value="issueCreateObject.title"
            id="summary"
            @input="setFieldValue('title', $event)"
          />
        </div>
      </div>

      <div class="formField ">
        <label class="formFieldLabel" for="description">Description</label>
        <j-text-editor
          :mode="`write`"
          @input="setFieldValue('description', $event)"
          class="descriptionEditor"
          id="description"
        />
        <div class="formFieldTip">
          Describe the issue in as much detail as you'd like.
        </div>
      </div>

      <div class="formField ">
        <label class="formFieldLabel" for="priority">Priority</label>
        <j-select
          id="priority"
          :value="issueCreateObject.priority"
          searchable
          :options="
            Object.values(IssuePriority).map(p => ({
              value: p,
              label: IssuePriorityCopy[p],
              icon: parseInt(p) < 3 ? 'arrow-down' : 'arrow-up',
              color: issuePriorityColors[p]
            }))
          "
          customRender
          @change="setFieldValue('priority', $event)"
        >
          <template v-slot:default="{ label, icon, color }">
            <div class="my-px mr-4 flex items-center">
              <j-icon :style="{ color }" :size="20" :name="icon"></j-icon>

              <div class="pr-1 pl-2">
                {{ label }}
              </div>
            </div>
          </template>
        </j-select>
        <div class="formFieldTip">
          Priority in relation to other issues.
        </div>
      </div>
      <div class="formField flex justify-end items-center">
        <j-button
          :isWorking="isWorking"
          @click.prevent="handleSubmit"
          :disabled="!isValidDTO"
          class="ml-3"
          variant="brand"
          >Create</j-button
        >
        <j-button
          @click.prevent="$emit('close')"
          class="ml-3"
          variant="secondary"
          >Cancel</j-button
        >
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref } from '@vue/composition-api'
import Issue, {
  IssueType,
  IssuePriority,
  IssuePriorityCopy,
  IssueTypeCopy,
  IssueStatus
} from '@/types/issue'
import { issuePriorityColors } from '@/utils/colors'
import { successToast } from '../../../../plugins/toast'
import { getters, mutations } from '@/store'
import uniqid from 'uniqid'

type fieldType = 'type' | 'title' | 'description' | 'priority' | 'status'

export default defineComponent({
  setup(_, { emit }) {
    const defaultIssueValues = {
      id: uniqid(),
      type: IssueType.TASK,
      title: '',
      description: '',
      priority: IssuePriority.MEDIUM
    } as Issue
    const project = computed(getters.project)
    const issueCreateObject = reactive<Issue>(defaultIssueValues)
    const isRequired = (value: string) =>
      ['', null, undefined].indexOf(value) === -1

    const isValidDTO = computed(
      () =>
        isRequired(issueCreateObject.type) &&
        isRequired(issueCreateObject.title) &&
        isRequired(issueCreateObject.priority)
    )

    // eslint-disable-next-line
    const setFieldValue = (field: fieldType, value: any) => {
      issueCreateObject[field] = (value as unknown) as never
    }

    const loading = ref<boolean>(false)

    const isWorking = computed(() => loading.value)

    const handleSubmit = async () => {
      loading.value = true
      const issue: Issue = {
        ...issueCreateObject,
        createdAt: new Date(),
        updatedAt: null,
        status: IssueStatus.BACKLOG
      }
      try {
        // Save Data
        const data = [...project.value.issues]
        data.push(issue)
        // optimistic update
        const issueTmp = {
          ...project.value,
          issues:data
        }
        mutations.setProject(issueTmp)
        localStorage.setItem('project', JSON.stringify(project.value))

        loading.value = false
        emit('close')
        successToast('Issue has been successfully created').showToast()
      } catch (error) {
        console.error(error)
        emit('close')
      }
    }

    return {
      issueCreateObject,
      IssueType,
      isValidDTO,
      IssueTypeCopy,
      IssuePriority,
      IssuePriorityCopy,
      issuePriorityColors,
      setFieldValue,
      handleSubmit,
      isWorking
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

<style lang="scss">
.descriptionEditor .ql-editor {
  min-height: 110px;
}
</style>
