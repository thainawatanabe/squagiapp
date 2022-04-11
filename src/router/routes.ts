import { RouteRecordRaw } from 'vue-router';
import store from "../store";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
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
    path: "/login",
    component: () => import("layouts/BackgroundLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Login.vue")
      }
    ]
  },

  {
    path: "/cadastrar",
    component: () => import("layouts/BackgroundLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/SignUp.vue")
      }
    ]
  },

  {
    path: "/senha",
    component: () => import("layouts/BackgroundLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/ResetPassword.vue")
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
