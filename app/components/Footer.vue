<template>
  <footer class="site-footer">
    <div class="footer-grid">
      <div>
        <h3>Annonces TG</h3>
        <p>Achetez et vendez facilement, partout au Togo.</p>
      </div>
      <div>
        <h4>Catégories</h4>
        <ul>
          <li><NuxtLink to="/categorie/vehicules">Véhicules</NuxtLink></li>
          <li><NuxtLink to="/categorie/immobilier">Immobilier</NuxtLink></li>
          <li><NuxtLink to="/categorie/electronique">Électronique</NuxtLink></li>
        </ul>
      </div>
      <div>
        <h4>Annonces TG</h4>
        <ul>
          <li><NuxtLink to="/publier">Publier une annonce</NuxtLink></li>
          <li><a href="mailto:contact@annonces-tg.com">Nous contacter</a></li>
        </ul>
      </div>
    </div>
    <p class="copy">© {{ new Date().getFullYear() }} Annonces TG</p>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-xl);
  padding: var(--space-lg) var(--space-md);
}
.footer-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-md); max-width: 1100px; margin-inline: auto;
}
.footer-grid h3, .footer-grid h4 { font-size: var(--step-0); margin: 0 0 var(--space-xs); }
.footer-grid p { color: var(--color-ink-soft); font-size: var(--step--1); margin: 0; }
.footer-grid ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--space-xs); }
.footer-grid a { font-size: var(--step--1); color: var(--color-ink-soft); }
.footer-grid a:hover { color: var(--color-primary-ink); }
.copy {
  text-align: center; font-size: var(--step--1); color: var(--color-ink-soft);
  margin: var(--space-lg) 0 0;
}
</style>