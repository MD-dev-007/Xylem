"use client";

import { useToast } from "@/components/ui/toast";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

const fieldMotion = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ConsultationForm() {
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        message: formData.get("message"),
        type: "CONSULTATION"
      })
    });
    setLoading(false);

    if (!response.ok) {
      push({ title: "Submission failed", description: "Please try again." });
      return;
    }

    event.currentTarget.reset();
    push({ title: "Consultation booked", description: "Our design team will reach out soon." });
  };

  return (
    <section className="rounded-2xl bg-[#efe4d4] p-6 md:p-10">
      <h2 className="mb-6 text-3xl font-light text-primary">Book a Free Consultation</h2>
      <motion.form
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        onSubmit={onSubmit}
        className="grid gap-4 md:grid-cols-2"
      >
        <motion.input variants={fieldMotion} name="name" required placeholder="Name" className="h-11 rounded-md border border-primary/20 bg-white px-3" />
        <motion.input variants={fieldMotion} name="phone" required placeholder="Phone" className="h-11 rounded-md border border-primary/20 bg-white px-3" />
        <motion.input variants={fieldMotion} name="email" type="email" placeholder="Email" className="h-11 rounded-md border border-primary/20 bg-white px-3" />
        <motion.select variants={fieldMotion} name="roomType" className="h-11 rounded-md border border-primary/20 bg-white px-3 text-primary/80">
          <option value="">Room Type</option>
          <option value="living-room">Living Room</option>
          <option value="bedroom">Bedroom</option>
          <option value="kitchen">Kitchen</option>
          <option value="office">Office</option>
        </motion.select>
        <motion.select variants={fieldMotion} name="budgetRange" className="h-11 rounded-md border border-primary/20 bg-white px-3 text-primary/80">
          <option value="">Budget Range</option>
          <option value="0-25000">Up to Rs 25,000</option>
          <option value="25000-75000">Rs 25,000 - Rs 75,000</option>
          <option value="75000-150000">Rs 75,000 - Rs 1,50,000</option>
          <option value="150000+">Rs 1,50,000+</option>
        </motion.select>
        <motion.div variants={fieldMotion} className="md:col-span-2">
          <textarea
            name="message"
            rows={5}
            placeholder="Message"
            className="w-full rounded-md border border-primary/20 bg-white p-3"
          />
        </motion.div>
        <motion.div variants={fieldMotion} className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </motion.div>
      </motion.form>
    </section>
  );
}
