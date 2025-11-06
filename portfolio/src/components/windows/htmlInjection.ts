export async function renderHtmlWithScripts(container: HTMLElement, html: string): Promise<void> {
  // Isoler le HTML/CSS dans un Shadow DOM pour éviter toute fuite de styles globales
  const root = (container as HTMLElement & { shadowRoot?: ShadowRoot }).shadowRoot
    || container.attachShadow({ mode: 'open' });
  root.innerHTML = html;
  const scripts = Array.from(root.querySelectorAll('script'));
  const exec = (oldScript: HTMLScriptElement) => new Promise<void>((resolve, reject) => {
    const newScript = document.createElement('script');
    for (const attr of Array.from(oldScript.attributes)) newScript.setAttribute(attr.name, attr.value);
    if (oldScript.textContent) newScript.textContent = oldScript.textContent;
    newScript.onload = () => resolve();
    newScript.onerror = () => reject(new Error('Script load error'));
    oldScript.replaceWith(newScript);
    if (!newScript.src) resolve();
  });
  for (const s of scripts) {
    // Préserver l'ordre d'exécution
    // eslint-disable-next-line no-await-in-loop
    await exec(s);
  }
}

export function clearContainer(container: HTMLElement) {
  const root = (container as HTMLElement & { shadowRoot?: ShadowRoot }).shadowRoot;
  if (root) root.innerHTML = '';
  else while (container.firstChild) container.removeChild(container.firstChild);
}

