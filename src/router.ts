import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

function loadView(view: string) {
  return () =>
    import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'root',
    redirect: 'project'
  },
  {
    path: '/project',
    meta: { requiresAuth: true },
    component: loadView('Project/Project'),
    children: [
      {
        path: '',
        name: 'board',
        component: loadView('Project/Board')
      },
      {
        path: 'issue/:issueId',
        name: 'issue',
        component: loadView('Project/FullIIssueDetails'),
        props: true
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, _, next) => {
  next()
})

export default router
