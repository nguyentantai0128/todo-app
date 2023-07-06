import Vue from 'vue'
import { Filters, Issue, Project } from '@/types'

const store = Vue.observable({
  project: {
    name: 'Demo',
    category: 'software',
    issues: [
      {
        id: '1ljqk7qh4',
        type: 'story',
        title: 'APP TO DO',
        description: '<p>App Todo</p>',
        priority: '1',
        createdAt: new Date('2023-07-06T03:00:15.826Z'),
        updatedAt: null,
        status: 'done',
        listPosition: 1
      } as Issue
    ] as Issue[]
  } as Project,
  filters: {
    searchTerm: '',
    recent: false,
    status: 'all'
  } as Filters
})

export const getters = {
  project: () => store.project,
  filters: () => store.filters
}

export const mutations = {
  setFilters: (filters: Filters) => (store.filters = filters),
  setProject: (project: Project) => (store.project = project)
}

export default {
  store,
  getters,
  mutations
}
