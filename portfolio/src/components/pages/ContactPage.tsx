import { motion, AnimatePresence } from "framer-motion";
import { PERSONAL_INFO } from "@/data/personal-info";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { FadeInView } from "@/components/animations";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";

// Animated Input Component with floating label
function AnimatedInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  rows,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isActive = isFocused || hasValue;
  const InputComponent = rows ? "textarea" : "input";

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Floating label */}
      <motion.label
        htmlFor={name}
        className={`absolute left-4 pointer-events-none transition-all duration-200 ${
          isActive
            ? "top-2 text-tiny text-primary font-medium"
            : "top-4 text-body text-foreground/50"
        }`}
        animate={{
          y: isActive ? 0 : 4,
        }}
      >
        {label}
      </motion.label>

      {/* Input field */}
      <InputComponent
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-card/30 backdrop-blur-sm border rounded-xl px-4 text-body transition-all duration-300 resize-none
          ${isActive ? "pt-7 pb-3" : "py-4"}
          ${
            isFocused
              ? "border-primary/50 ring-4 ring-primary/10 shadow-lg shadow-primary/5"
              : "border-foreground/10 hover:border-foreground/20"
          }
          focus:outline-none
        `}
        placeholder={isFocused ? placeholder : ""}
        required={required}
        rows={rows}
      />

      {/* Focus glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: isFocused
            ? "0 0 30px -10px rgba(var(--primary), 0.3)"
            : "0 0 0px 0px transparent",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Contact info card component
function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
  delay: number;
}) {
  return (
    <motion.a
      href={href}
      className="group relative flex items-center gap-4 p-5 rounded-2xl glass overflow-hidden transition-all duration-300 hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon */}
      <motion.div
        className="p-3 rounded-xl bg-primary/10 text-primary"
        whileHover={{ rotate: 5, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>

      {/* Content */}
      <div className="flex-1">
        <div className="text-tiny text-foreground/50 mb-1">{label}</div>
        <div className="text-body font-medium group-hover:text-primary transition-colors">
          {value}
        </div>
      </div>

      {/* Arrow */}
      <motion.div
        className="text-foreground/30 group-hover:text-primary transition-colors"
        initial={{ x: 0 }}
        whileHover={{ x: 5 }}
      >
        <ArrowRight className="w-4 h-4" />
      </motion.div>

      {/* Hover gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </motion.a>
  );
}

// Social link component
function SocialLink({
  icon: Icon,
  label,
  href,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  delay: number;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 px-6 py-3 rounded-full glass hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
      <span className="text-body font-medium group-hover:text-primary transition-colors">
        {label}
      </span>
      <motion.span
        className="text-foreground/40 group-hover:text-primary transition-colors"
        initial={{ x: 0 }}
        whileHover={{ x: 3 }}
      >
        →
      </motion.span>
    </motion.a>
  );
}

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Tous les champs sont requis");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Message envoyé ! Je vous réponds bientôt.");

    // Reset after animation
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setIsSuccess(false);
    }, 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <FadeInView className="mb-16 text-center">
          <motion.div
            className="text-small-caps text-primary/70 mb-4 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-8 h-px bg-primary/50" />
            Contactez-moi
            <div className="w-8 h-px bg-primary/50" />
          </motion.div>
          <h1 className="text-monumental tracking-tight mb-6">
            <span className="gradient-text">Contact</span>
          </h1>
          <p className="text-body-large text-foreground/60 max-w-xl mx-auto">
            N'hésitez pas à me contacter pour toute opportunité, projet ou
            simplement pour discuter.
          </p>
        </FadeInView>

        {/* Contact Cards Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          <ContactCard
            icon={Mail}
            label="Email"
            value={PERSONAL_INFO.contact.email}
            href={`mailto:${PERSONAL_INFO.contact.email}`}
            delay={0.3}
          />
          <ContactCard
            icon={Phone}
            label="Téléphone"
            value={PERSONAL_INFO.contact.phone}
            href={`tel:${PERSONAL_INFO.contact.phone.replace(/\s/g, "")}`}
            delay={0.4}
          />
          <ContactCard
            icon={MapPin}
            label="Localisation"
            value={PERSONAL_INFO.contact.location}
            href={`https://maps.google.com/?q=${encodeURIComponent(
              PERSONAL_INFO.contact.location
            )}`}
            delay={0.5}
          />
        </div>

        {/* Form Section */}
        <motion.div
          className="relative max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="relative p-8 md:p-12 rounded-3xl glass overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <h2 className="text-title font-bold mb-8 text-center relative">
              Envoyez-moi un message
            </h2>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  className="flex flex-col items-center justify-center py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.1,
                    }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </motion.div>
                  <motion.p
                    className="text-title font-bold text-emerald-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Message envoyé !
                  </motion.p>
                  <motion.p
                    className="text-body text-foreground/60 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Je vous réponds très vite.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6 relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnimatedInput
                    label="Nom"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom complet"
                    required
                  />

                  <AnimatedInput
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                  />

                  <AnimatedInput
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Votre message..."
                    required
                    rows={5}
                  />

                  <motion.div
                    className="pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full py-4 rounded-xl font-semibold text-body overflow-hidden transition-all duration-300 disabled:opacity-70"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Button background */}
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90 group-hover:opacity-100 transition-opacity" />

                      {/* Shimmer effect */}
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />

                      {/* Content */}
                      <span className="relative flex items-center justify-center gap-2 text-white">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Envoyer le message
                          </>
                        )}
                      </span>
                    </motion.button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-foreground/20" />
            <span className="text-small-caps text-foreground/50">
              Retrouvez-moi également
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-foreground/20" />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <SocialLink
              icon={Github}
              label="GitHub"
              href={PERSONAL_INFO.social.github}
              delay={0.7}
            />
            <SocialLink
              icon={Linkedin}
              label="LinkedIn"
              href={PERSONAL_INFO.social.linkedin}
              delay={0.8}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
