import { PERSONAL_INFO } from "@/data/personal-info";
import { useState } from "react";
import { toast } from "sonner";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    // Simulation d'envoi
    toast.success("Merci pour votre message ! Je vous répondrai rapidement.");

    // Reset form
    setFormData({ name: "", email: "", message: "" });
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
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Me contacter
          </h1>
          <p className="text-lg text-foreground/60">
            N'hésitez pas à me contacter pour toute opportunité ou question
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Envoyez-moi un message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Votre nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Jean Dupont"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Votre email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="jean@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground/80 mb-2"
                >
                  Votre message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  placeholder="Bonjour, je souhaiterais..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Envoyer le message ✉️
              </button>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                Coordonnées directes
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <a
                      href={`mailto:${PERSONAL_INFO.contact.email}`}
                      className="text-purple-600 hover:underline"
                    >
                      {PERSONAL_INFO.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Téléphone</p>
                    <a
                      href={`tel:${PERSONAL_INFO.contact.phone.replace(/\s/g, "")}`}
                      className="text-purple-600 hover:underline"
                    >
                      {PERSONAL_INFO.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Localisation</p>
                    <p className="text-foreground/70">{PERSONAL_INFO.contact.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Retrouvez-moi aussi sur
              </h3>
              <div className="space-y-3">
                <a
                  href={PERSONAL_INFO.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-purple-500/10 transition-colors"
                >
                  <span className="text-2xl">🐙</span>
                  <span className="font-medium text-foreground">GitHub</span>
                </a>
                <a
                  href={PERSONAL_INFO.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-purple-500/10 transition-colors"
                >
                  <span className="text-2xl">💼</span>
                  <span className="font-medium text-foreground">LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Disponibilité */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
              <p className="text-green-700 dark:text-green-400 font-semibold">
                🟢 Disponible pour des opportunités d'alternance et de projets
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
