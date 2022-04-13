import { RouteRecordRaw } from 'vue-router';
import store from "../store";

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    // beforeEnter: (_to, _from, next) => {
    //   if (store.getters.loggedIn) {
    //     next();
    //   } else {
    //     next({
    //       path: "/login"
    //     });
    //   }
    // },
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },

  {
    path: "/",
    component: () => import("layouts/BackgroundLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Main.vue")
      }
    ]
  },

  {
    path: "/usuarios",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Users.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
