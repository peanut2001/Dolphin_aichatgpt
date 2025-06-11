// Composables
import DefaultLayout from "@/layouts/default/defaultlayout.vue"
import AuthLayout from "@/layouts/auth/authlayout.vue"
import LoginView from "@/pages/auth/login.vue"

export default [
  // 认证相关路由（使用独立布局）
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        name: "login",
        component: LoginView,
      },
    ],
  },
  // 主应用路由（使用默认布局）
  {
    path: "/",
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/pages/base/home.vue"),
      },
      {
        path: "profile",
        name: "userprofile",
        component: () => import("@/pages/user/userprofile.vue"),
      },
      {
        path: "chat",
        name: "chat",
        component: () => import("@/pages/chat/index.vue"),
      },
      {
        path: "welcome",
        name: "welcome",
        component: () => import("@/pages/welcome/index.vue"),
      },
      {
        path: "settings",
        name: "usersettings",
        component: () => import("@/pages/settings/index.vue"),
      },
      {
        path: "contact",
        name: "contactus",
        component: () => import("@/pages/contact/index.vue"),
      },
    ],
  },
]
