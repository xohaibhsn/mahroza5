import { useState } from "react";
import { useForm } from "react-hook-form";
import { services } from "@/lib/constants";

export type AppointmentFormValues = {
  name: string;
  phone: string;
  service: string;
  message: string;
};

type AppointmentFormProps = {
  compact?: boolean;
};

export default function AppointmentForm({ compact = false }: AppointmentFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    setServerError(null);

    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        setServerError(result.message || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      reset();
    } catch {
      setServerError(
        "Unable to connect right now. Please call or WhatsApp us instead."
      );
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-secondary/20 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold text-primary">
          Request Received
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Thank you for contacting QHC. Our team will call you shortly to confirm your appointment.
        </p>
        <button type="button" className="btn-primary mt-6" onClick={() => setSubmitted(false)}>
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`rounded-2xl bg-white shadow-card ${compact ? "p-6" : "p-6 sm:p-8"}`}
      noValidate
    >
      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div className={compact ? "" : "sm:col-span-1"}>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="input-field"
            placeholder="Your full name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className="input-field"
            placeholder="+92 300 0000000"
            {...register("phone", {
              required: "Phone number is required",
              minLength: { value: 10, message: "Enter a valid phone number" },
            })}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div className={compact ? "" : "sm:col-span-2"}>
          <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-slate-700">
            Service
          </label>
          <select
            id="service"
            className="input-field"
            {...register("service", { required: "Please select a service" })}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1 text-xs text-red-600">{errors.service.message}</p>
          )}
        </div>

        <div className={compact ? "" : "sm:col-span-2"}>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            id="message"
            rows={compact ? 3 : 4}
            className="input-field resize-y"
            placeholder="Tell us briefly about your care needs"
            {...register("message")}
          />
        </div>
      </div>

      {serverError ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      ) : null}

      <button type="submit" className="btn-primary mt-5 w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Make Appointment"}
      </button>
    </form>
  );
}
