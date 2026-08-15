import { useState } from "react";
import { useForm } from "react-hook-form";

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setServerError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setServerError(result.message || "Unable to send message.");
        return;
      }
      setSubmitted(true);
      reset();
    } catch {
      setServerError("Unable to connect right now. Please call or WhatsApp us.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-secondary/20 bg-white p-8 text-center shadow-card">
        <h3 className="font-display text-2xl font-semibold text-primary">Message Sent</h3>
        <p className="mt-2 text-sm text-slate-600">
          Thank you for contacting QHC. We will get back to you shortly.
        </p>
        <button type="button" className="btn-primary mt-6" onClick={() => setSubmitted(false)}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-card sm:p-8" noValidate>
      <h3 className="font-display text-2xl font-semibold text-primary">Send us a message</h3>
      <p className="mt-2 text-sm text-slate-600">We usually respond the same day across Lahore.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            id="contact-name"
            className="input-field"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input id="contact-email" type="email" className="input-field" {...register("email")} />
        </div>
        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input id="contact-phone" type="tel" className="input-field" {...register("phone")} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={4}
            className="input-field"
            {...register("message", { required: "Message is required" })}
          />
          {errors.message ? (
            <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
          ) : null}
        </div>
      </div>

      {serverError ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      ) : null}

      <button type="submit" className="btn-primary mt-5" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
