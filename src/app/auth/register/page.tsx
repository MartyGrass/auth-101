// src/app/auth/register/page.tsx
"use client";

import { useState } from "react";

export default function Page() {
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    ).value.trim();
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    ).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    setMsg("Gönderiliyor…");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setMsg(
      res.ok ? "Kayıt başarılı ✅" : `Hata: ${data?.error ?? "bilinmeyen hata"}`
    );
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-3 border p-6 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold">Kayıt Ol</h1>
        <input
          name="name"
          placeholder="Ad Soyad"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="E-posta"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Şifre (min 6)"
          className="w-full border px-3 py-2 rounded"
        />
        <button className="w-full bg-black text-white py-2 rounded">
          Gönder
        </button>
        <p className="text-sm text-neutral-600">{msg}</p>
      </form>
    </main>
  );
}
