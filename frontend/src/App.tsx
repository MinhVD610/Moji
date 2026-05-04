import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import SignUpPage from "./pages/SignUpPage";
// import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
    {/* <div className="flex justify-center items-center h-screen bg-gray-100">
      <h1 className="text-4xl font-extrabold text-blue-600 bg-yellow-300 p-8 rounded-2xl shadow-2xl border-4 border-red-500 hover:scale-110 transition-transform cursor-pointer">
        🚀 TAILWIND CSS ĐÃ HOẠT ĐỘNG THÀNH CÔNG!
      </h1>
    </div> */}
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path="/signin"
            element={<SignInPage />}
          />
          <Route
            path="/signup"
            element={<SignUpPage />}
          />

          {/* protected routes */}
          {/* <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={<ChatAppPage />}
            />
          </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;