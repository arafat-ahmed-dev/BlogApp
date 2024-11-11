import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Protected, Login } from "./Component/index.js";
import Signup from "./Pages/Signup.jsx";
import MyPosts from "./Pages/Mypost.jsx";
import AddPost from "./Pages/AddPost.jsx";
import EditPost from "./Pages/EditPost.jsx";
import Post from "./Pages/Post.jsx";
import Home from "./Pages/Home.jsx";
import PasswordRecovery from "./Pages/PasswordRecovery.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import NotFound from "./Component/NotFound.jsx";
import Profile from "./Pages/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        ),
      },
      {
        path: "/signup",
        element: (
          <Protected authentication={false}>
            <Signup />
          </Protected>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <Protected authentication={false}>
            <PasswordRecovery />
          </Protected>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <Protected authentication={false}>
            <ResetPassword />
          </Protected>
        ),
      },
      {
        path: "/my-posts",
        element: (
          <Protected authentication>
            {" "}
            <MyPosts />
          </Protected>
        ),
      },
      {
        path: "/profile",
        element: (
          <Protected authentication>
            {" "}
            <Profile />
          </Protected>
        ),
      },
      {
        path: "/profile/:slug",
        element: <Profile />,
      },
      {
        path: "/add-post",
        element: (
          <Protected authentication>
            {" "}
            <AddPost />
          </Protected>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <Protected authentication>
            {" "}
            <EditPost />
          </Protected>
        ),
      },
      {
        path: "/post/:slug",
        element: <Post />,
      },
      {
        path: "*", // Catch-all route for undefined paths
        element: <NotFound />, // Render the NotFound component
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
