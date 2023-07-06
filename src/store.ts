import Vue from 'vue'
import { Filters, Issue, Project } from '@/types'

const store = Vue.observable({
  project: {
    name: 'Demo Project',
    category: 'software',
    issues: [] as Issue[]
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
