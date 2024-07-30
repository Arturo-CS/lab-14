"use client";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle-button";
import { buttonVariants } from "./ui/button";
import { useSession, signOut } from "next-auth/react";

function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between py-5">
      <Link href="/">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Laboratorio
        </h1>
      </Link>

      <div className="flex gap-x-2 items-center">
        <Link href="/" className={buttonVariants({ variant: "secondary", class:"hover:text-emerald-200" })}>
          Inicio
        </Link>
        <Link href="/images" className={buttonVariants({ variant: "secondary", class:"hover:text-emerald-200" })}>
          Imagenes
        </Link>
        {session ? (
          <>
            <Link href="/dashboard" className={buttonVariants({ variant: "secondary", class:"hover:text-emerald-200" })}>
              Dashboard
            </Link>
            <span className={buttonVariants({ variant: "secondary" })}>
              {session.user?.name}
            </span>
            <button onClick={() => signOut()} className={buttonVariants({ variant: "default", class:"hover:text-emerald-200" })}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/users/register" className={buttonVariants({ variant: "secondary", class:"hover:text-emerald-200" })}>
              Registrarse
            </Link>
            <Link href="/users/login" className={buttonVariants({ variant: "default", class:"hover:text-emerald-200" })}>
              Ingresar
            </Link>
          </>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}

export default Navbar;