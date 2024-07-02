import { Routes, Route, useLocation } from "react-router-dom";
import { OnboardingRoute, PrivateRoute, AdminRoute, AdminNav, Nav } from "../components";
import {
  Login,
  Register,
  Dashboard,
  AdminDashboard,
  ResetPassword,
  Onboarding,
  Signout,
  CreatePost,
  Profile,
  EditProfile,
  Post
} from "../pages";
import { ToastContainer } from "react-toastify";

function Root() {
  const location = useLocation().pathname;

  const renderNav = () => {
    if (!location.includes("/login") && !location.includes("/register") && !location.includes("/signout") && !location.includes("/reset-password")  && !location.includes("/onboarding")) {
      if (location.includes("/admin")) {
        return <AdminNav />
      } else {
        return <Nav/>
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {renderNav()}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/signout' element={<Signout />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/onboarding'
          element={
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          }
        />
        <Route
          path='/'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path='/post/:postId'
          element={
            <PrivateRoute>
              <Post />
            </PrivateRoute>
          }
        />
        <Route
          path='/create-post'
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route
          path='/admin'
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path='/admin/post'
          element={
            <PrivateRoute>
              <AdminRoute>
                <CreatePost />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path='/profile/edit'
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default Root;
