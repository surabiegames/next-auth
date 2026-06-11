import { FormLogin } from "@/components/auth/form-login"

const Register = () => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      {/* Grid line horizontal + vertical */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(0 0% 0% / 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(0 0% 0% / 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Garis diagonal tipis seperti Tailwind */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 39px,
            hsl(0 0% 0% / 0.03) 39px,
            hsl(0 0% 0% / 0.03) 40px
          )`,
        }}
      />

      {/* Fade gradient dari tengah agar form tetap terbaca */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,hsl(0_0%_100%/0.9),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,hsl(0_0%_0%/0.7),transparent)]" />

      {/* Konten */}
      <div className="relative z-10 w-full max-w-md px-4">
        <FormLogin />
      </div>
    </div>
  )
}

export default Register
