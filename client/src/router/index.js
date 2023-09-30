// Composables
import { createRouter, createWebHistory } from "vue-router";
import Default from "@/layouts/default/Default.vue";
import Headerless from "@/layouts/headerless/Headerless.vue";
import Landing from "@/views/Landing.vue";
import Register from "@/views/Register.vue";
import Signin from "@/views/Signin.vue";
import Wall from "@/views/Wall.vue";
import Browse from "@/views/Browse.vue";
import Friends from "@/views/Friends.vue";
import EventSingle from "@/views/EventSingle.vue";
import WishlistSingle from "@/views/WishlistSingle.vue";
import Favorite from "@/views/Favorite.vue";
import Wishlist from "@/views/Wishlist.vue";
import Settings from "@/views/Settings.vue";
import Blog from "@/views/Blog.vue";
import BlogSingle from "@/views/BlogSingle.vue";
import Terms from "@/views/Terms.vue";
import About from "@/views/About.vue";
import Privacy from "@/views/Privacy.vue";
import Admin from "@/views/Admin.vue";
import Signout from "@/views/Signout.vue";

const routes = [
  {
    path: "/index",
    component: Headerless,
    children: [
      {
        path: "",
        name: "landing",
        component: Landing,
        meta: {
          requiresAuth: false,
        },
      },
    ],
  },
  {
    path: "/",
    component: Default,
    children: [
      {
        path: "register",
        name: "register",
        component: Register,
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "signin",
        name: "signin",
        component: Signin,
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "wall/:id",
        name: "wall",
        component: Wall,
        props: true,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "browse",
        name: "browse",
        component: Browse,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "friends",
        name: "friends",
        component: Friends,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "event/:id",
        name: "eventSingle",
        component: EventSingle,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "favorite",
        name: "favorite",
        component: Favorite,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "wishlist",
        name: "wishlist",
        component: Wishlist,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "wishlist/:id",
        name: "wishlistSingle",
        component: WishlistSingle,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "settings",
        name: "settings",
        component: Settings,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "blog",
        name: "blog",
        component: Blog,
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "blog/:id",
        name: "blogSingle",
        component: BlogSingle,
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "terms",
        name: "terms",
        component: Terms,
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "about",
        name: "about",
        component: About,
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "privacy",
        name: "privacy",
        component: Privacy,
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "signout",
        name: "signout",
        component: Signout,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/admin/dashboard",
        name: "adminDashboard",
        component: Admin,
        meta: {
          requiresAdmin: true,
        },
      },
    ],
  },
  {
    path: "",
    redirect: "/index",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
