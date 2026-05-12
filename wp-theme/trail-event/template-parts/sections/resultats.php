<?php /* Section : Résultats */ ?>
<section class="section section-resultats reveal">
  <div class="container">
    <?php if (!empty($section['titre'])): ?>
      <div class="section-header">
        <span class="deco-line"></span>
        <h2 class="section-title"><?= esc_html($section['titre']) ?></h2>
      </div>
    <?php endif; ?>
    <div class="resultats-list">
      <?php foreach (($section['annees'] ?? []) as $a): ?>
        <a href="<?= esc_url($a['lien'] ?? '#') ?>" class="resultat-item" target="_blank" rel="noopener">
          <span class="resultat-annee"><?= esc_html($a['annee'] ?? '') ?></span>
          <span class="resultat-arrow">→</span>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
