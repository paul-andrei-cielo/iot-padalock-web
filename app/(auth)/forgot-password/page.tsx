import Link from "next/link";
import Image from "next/image";

export default function ForgotPassword() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f6f2f4] via-[#efc7d3] to-[#df4f7d] px-6 py-8 md:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-between gap-10">
        <section className="flex-1 text-white">
          <div className="mb-16 flex items-center gap-4">
            <div className="mb-16">
              <Image
                src="/padalock-logo.png"
                alt="PadaLock Logo"
                width={390}
                height={90}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-extrabold leading-[1.2] md:text-5xl">
              Forgot your
              <br />
              password?
            </h2>
          </div>
        </section>

        <section className="flex w-full max-w-xl justify-center lg:justify-end">
          <div className="w-full rounded-[2rem] bg-[#f6e8ec]/50 p-8 shadow-[0_20px_60px_rgba(214,84,126,0.18)] backdrop-blur-sm md:p-10">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-lg font-medium text-[#e34774]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  className="h-14 w-full rounded-full border-none bg-[#f8f4f5] px-6 text-lg text-[#dd8ea5] outline-none placeholder:text-[#dd9db0]"
                />
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  type="submit"
                  className="h-12 min-w-[170px] rounded-full bg-[#e33e70] px-6 text-lg font-bold text-white transition hover:scale-[1.02]"
                >
                  Send Reset Link
                </button>

                <p className="text-base text-[#e34774] text-center">
                  Remember your password?{" "}
                  <Link href="/login" className="font-bold hover:underline">
                    Back to login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}