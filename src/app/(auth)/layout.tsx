import React from "react" // Hapus impor { children } di sini karena tidak diperlukan

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="">
        <main className="">{children}</main>
      </div>
    </div>
  )
}

export default AuthLayout
