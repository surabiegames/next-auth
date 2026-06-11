import React from "react"

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
