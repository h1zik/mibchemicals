"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitLead, type LeadActionState } from "@/actions/lead";

const initial: LeadActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded border-2 border-mib bg-mib py-3 text-base font-semibold text-white hover:bg-mib-dark disabled:opacity-60 sm:w-auto sm:px-10"
    >
      {pending ? "Mengirim…" : "Kirim pesan"}
    </button>
  );
}

export function LeadForm() {
  const [state, formAction] = useFormState(submitLead, initial);

  if (state.ok) {
    return (
      <div
        className="rounded-lg border border-mib/30 bg-mib/5 p-6 text-mib-dark"
        role="status"
      >
        <p className="font-semibold">Terima kasih.</p>
        <p className="mt-2 text-sm text-neutral-700">
          Tim kami akan menghubungi Anda sesegera mungkin.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Nama
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none ring-mib focus:border-mib focus:ring-1"
          />
          {state.fieldErrors?.name?.[0] ? (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name[0]}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-foreground">
            Perusahaan
          </label>
          <input
            id="company"
            name="company"
            required
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none ring-mib focus:border-mib focus:ring-1"
          />
          {state.fieldErrors?.company?.[0] ? (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.company[0]}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none ring-mib focus:border-mib focus:ring-1"
          />
          {state.fieldErrors?.email?.[0] ? (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email[0]}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground">
            Telepon
          </label>
          <input
            id="phone"
            name="phone"
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none ring-mib focus:border-mib focus:ring-1"
          />
        </div>
      </div>
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-foreground">
          Sektor
        </label>
        <select
          id="industry"
          name="industry"
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none ring-mib focus:border-mib focus:ring-1 sm:max-w-md"
        >
          <option value="">Pilih sektor</option>
          <option value="oil-gas">Oil & Gas</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="mining">Mining</option>
          <option value="water">Water Treatment</option>
          <option value="other">Lainnya</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          Kebutuhan / pesan
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none ring-mib focus:border-mib focus:ring-1"
        />
        {state.fieldErrors?.message?.[0] ? (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.message[0]}</p>
        ) : null}
      </div>
      <SubmitButton />
    </form>
  );
}
