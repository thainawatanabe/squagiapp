import { RouteRecordRaw } from "vue-router";
import store from "../store";

const routes: RouteRecordRaw[] = [
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    // beforeEnter: (_to, _from, next) => {
    //   if (store.getters.loggedIn) {
    //     next();
    //   } else {
    //     next({
    //       path: "/login"
    //     });
    //   }
    // },
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },

  {
    path: "/",
    component: () => import("layouts/BackgroundLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Main.vue"),
      },
    ],
  },

  {
    path: "/convite",
    component: () => import("layouts/BackgroundLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Establishments/LinkUser.vue"),
      },
    ],
  },

  {
    path: "/usuarios",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Users.vue"),
      },
    ],
  },

  {
    path: "/estabelecimentos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Establishments/Create.vue"),
      },
    ],
  },

  {
    path: "/feed",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "",
        path: "",
        component: () => import("src/pages/feed/Request.vue"),
      },
      {
        name: "termos",
        path: "termos",
        component: () => import("pages/Index.vue"),
      },
      {
        name: "a",
        path: "a",
        component: () => import("pages/Index.vue"),
      },
    ],
  },

  {
    path: "/logo",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "",
        path: "",
        component: () => import("pages/Index.vue"),
      }
    ],
  },

  {
    path: "/site",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "",
        path: "",
        component: () => import("pages/Index.vue"),
      }
    ],
  },

  {
    path: "/editor",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "",
        path: "",
        component: () => import("pages/Index.vue"),
      }
    ],
  },

  {
    path: "/gestao-rede",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "",
        path: "",
        component: () => import("pages/Index.vue"),
      },
      {
        name: "solicitar",
        path: "solicitar",
        component: () => import("pages/Index.vue"),
      },
      {
        name: "programacao",
        path: "programacao",
        component: () => import("pages/Index.vue"),
      },
      {
        name: "relatorio",
        path: "relatorio",
        component: () => import("pages/Index.vue"),
      },
    ],
  },

  {
    path: "/gestao-trafego",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "",
        path: "",
        component: () => import("pages/Index.vue"),
      },
      {
        name: "solicitacoes",
        path: "solicitacoes",
        component: () => import("pages/Index.vue"),
      },
      {
        name: "ads",
        path: "ads",
        component: () => import("pages/Index.vue"),
      }
    ],
  },

  {
    path: "/parceiros",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "",
        path: "",
        component: () => import("pages/Index.vue"),
      },
      {
        name: "fotografo",
        path: "fotografo",
        component: () => import("pages/Index.vue"),
      },
      {
        name: "contrato",
        path: "contrato",
        component: () => import("pages/Index.vue"),
      }
    ],
  },

  {
    path: "/financeiro",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "",
        path: "",
        component: () => import("pages/Index.vue"),
      },
      {
        name: "faturas",
        path: "faturas",
        component: () => import("pages/Index.vue"),
      }
    ],
  },

  {
    path: "/configuracao",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "",
        path: "",
        component: () => import("pages/Index.vue"),
      },
      {
        name: "empresa",
        path: "empresa",
        component: () => import("pages/Index.vue"),
      },
      {
        name: "equipe",
        path: "equipe",
        component: () => import("pages/Index.vue"),
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
