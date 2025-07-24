import React from "react"
import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import SearchPage from "@/components/pages/SearchPage"

function App() {
  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SearchPage />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App