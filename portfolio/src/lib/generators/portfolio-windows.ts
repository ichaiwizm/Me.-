/**
 * Générateurs de fenêtres HTML pour le portfolio de Ichai
 */

import { PERSONAL_INFO } from "@/data/personal-info";
import { SKILLS, SKILL_CATEGORIES } from "@/data/skills";
import { PROJECTS } from "@/data/projects";

export function generateSkillsWindow() {
  const skillsByCategory = SKILLS.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof SKILLS>);

  const skillsHtml = Object.entries(skillsByCategory)
    .map(([category, skills]) => {
      const { label, gradient } = SKILL_CATEGORIES[category as keyof typeof SKILL_CATEGORIES];
      const avgLevel = Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length);

      return `
        <div style='margin-bottom:25px;'>
          <h3 style='font-size:18px;margin-bottom:12px;color:#374151;'>${label}</h3>
          <div style='background:#f3f4f6;border-radius:10px;height:35px;overflow:hidden;box-shadow:inset 0 2px 4px rgba(0,0,0,0.1);'>
            <div style='background:${gradient};height:100%;width:${avgLevel}%;display:flex;align-items:center;padding:0 15px;color:white;font-weight:600;font-size:14px;transition:width 0.8s;'>
              ${skills.map(s => s.name).join(", ")} - ${avgLevel}%
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div style='padding:30px;font-family:system-ui;'>
      <h2 style='color:#8b5cf6;margin-bottom:25px;font-size:24px;font-weight:700;'>
        Mes Compétences Techniques
      </h2>
      ${skillsHtml}
    </div>
  `;
}

export function generateCVWindow() {
  return `
    <div style='padding:35px;font-family:system-ui;background:linear-gradient(135deg,#8b5cf6 0%,#a78bfa 100%);color:white;border-radius:12px;'>
      <div style='margin-bottom:25px;'>
        <h1 style='font-size:36px;margin-bottom:8px;font-weight:700;'>${PERSONAL_INFO.fullName}</h1>
        <p style='font-size:19px;opacity:0.95;font-weight:500;'>${PERSONAL_INFO.title} | ${PERSONAL_INFO.subtitle}</p>
      </div>
      <div style='background:white;color:#1f2937;padding:35px;border-radius:12px;box-shadow:0 20px 40px rgba(0,0,0,0.2);'>
        <div style='margin-bottom:28px;'>
          <h2 style='color:#8b5cf6;font-size:22px;margin-bottom:15px;border-bottom:3px solid #8b5cf6;padding-bottom:8px;font-weight:700;'>Formation</h2>
          <div>
            <p style='font-weight:600;color:#1f2937;margin-bottom:4px;'>WebSchool - Formation Développement Web Full-Stack</p>
            <p style='color:#6b7280;font-size:14px;'>2019 • Bases solides front/back, premières applications</p>
          </div>
        </div>
        <div style='margin-bottom:28px;'>
          <h2 style='color:#8b5cf6;font-size:22px;margin-bottom:15px;border-bottom:3px solid #8b5cf6;padding-bottom:8px;font-weight:700;'>Expérience</h2>
          <div style='margin-bottom:12px;'>
            <p style='font-weight:600;color:#1f2937;margin-bottom:4px;'>PhoneGS - Ingénieur Logiciel Full-Stack</p>
            <p style='color:#6b7280;font-size:14px;'>2023 - Présent • React, Node.js, Laravel, Asterisk, Docker</p>
          </div>
          <div>
            <p style='font-weight:600;color:#1f2937;margin-bottom:4px;'>Freelance - Développeur Full-Stack</p>
            <p style='color:#6b7280;font-size:14px;'>2020 - 2023 • Sites vitrines, SaaS, automatisations</p>
          </div>
        </div>
        <div>
          <h2 style='color:#8b5cf6;font-size:22px;margin-bottom:15px;border-bottom:3px solid #8b5cf6;padding-bottom:8px;font-weight:700;'>Contact</h2>
          <p style='margin-bottom:10px;color:#374151;'><span style='font-weight:600;'>📧 Email :</span> ${PERSONAL_INFO.contact.email}</p>
          <p style='color:#374151;'><span style='font-weight:600;'>📱 Téléphone :</span> ${PERSONAL_INFO.contact.phone}</p>
        </div>
      </div>
    </div>
  `;
}

export function generateContactWindow() {
  return `
    <div style='padding:35px;font-family:system-ui;'>
      <h2 style='color:#8b5cf6;margin-bottom:25px;font-size:26px;font-weight:700;'>Me contacter</h2>
      <form onsubmit='event.preventDefault();alert("Merci pour votre message ! Je vous répondrai rapidement.");' style='display:flex;flex-direction:column;gap:18px;'>
        <input type='text' placeholder='Votre nom' style='padding:14px;border:2px solid #e5e7eb;border-radius:10px;font-size:16px;transition:border-color 0.3s;' onfocus='this.style.borderColor="#8b5cf6"' onblur='this.style.borderColor="#e5e7eb"' required />
        <input type='email' placeholder='Votre email' style='padding:14px;border:2px solid #e5e7eb;border-radius:10px;font-size:16px;transition:border-color 0.3s;' onfocus='this.style.borderColor="#8b5cf6"' onblur='this.style.borderColor="#e5e7eb"' required />
        <textarea placeholder='Votre message' rows='6' style='padding:14px;border:2px solid #e5e7eb;border-radius:10px;font-size:16px;resize:vertical;transition:border-color 0.3s;' onfocus='this.style.borderColor="#8b5cf6"' onblur='this.style.borderColor="#e5e7eb"' required></textarea>
        <button type='submit' style='padding:16px;background:linear-gradient(135deg,#8b5cf6,#a78bfa);color:white;border:none;border-radius:10px;font-size:17px;font-weight:700;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 4px 12px rgba(139,92,246,0.3);' onmouseover='this.style.transform="translateY(-2px)";this.style.boxShadow="0 6px 20px rgba(139,92,246,0.4)"' onmouseout='this.style.transform="translateY(0)";this.style.boxShadow="0 4px 12px rgba(139,92,246,0.3)"'>
          Envoyer le message
        </button>
      </form>
      <div style='margin-top:30px;padding:25px;background:linear-gradient(135deg,#f9fafb,#f3f4f6);border-radius:12px;border-left:4px solid #8b5cf6;'>
        <h3 style='font-size:18px;margin-bottom:18px;color:#1f2937;font-weight:700;'>Coordonnées directes</h3>
        <p style='margin-bottom:12px;color:#374151;font-size:15px;'><strong style='color:#8b5cf6;'>Email :</strong> ${PERSONAL_INFO.contact.email}</p>
        <p style='color:#374151;font-size:15px;'><strong style='color:#8b5cf6;'>Téléphone :</strong> ${PERSONAL_INFO.contact.phone}</p>
      </div>
    </div>
  `;
}

export function generateProjectsWindow() {
  const featuredProjects = PROJECTS.filter(p => p.featured);

  const projectsHtml = featuredProjects
    .map(
      (project) => `
        <div style='background:#f9fafb;border-radius:12px;padding:20px;border:2px solid #e5e7eb;transition:transform 0.2s,box-shadow 0.2s;cursor:pointer;' onmouseover='this.style.transform="translateY(-4px)";this.style.boxShadow="0 8px 20px rgba(139,92,246,0.2)"' onmouseout='this.style.transform="translateY(0)";this.style.boxShadow="none"'>
          <h3 style='font-size:20px;color:#8b5cf6;margin-bottom:10px;font-weight:700;'>${project.title}</h3>
          <p style='color:#6b7280;font-size:14px;line-height:1.6;margin-bottom:15px;'>${project.description}</p>
          <div style='display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;'>
            ${project.technologies
              .map(
                (tech) =>
                  `<span style='padding:4px 10px;background:#8b5cf6;color:white;border-radius:12px;font-size:12px;font-weight:500;'>${tech}</span>`
              )
              .join("")}
          </div>
          <p style='color:#9ca3af;font-size:12px;font-style:italic;'>${project.date}</p>
        </div>
      `
    )
    .join("");

  return `
    <div style='padding:30px;font-family:system-ui;'>
      <h2 style='color:#8b5cf6;margin-bottom:25px;font-size:26px;font-weight:700;'>Mes Projets Phares</h2>
      <div style='display:grid;gap:20px;'>
        ${projectsHtml}
      </div>
    </div>
  `;
}
