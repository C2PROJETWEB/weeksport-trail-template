<?php /* Section : Texte / Contenu */ ?>
<section class="section section-texte reveal">
  <div class="container">
    <?php if (!empty($section['titre'])): ?>
      <div class="section-header">
        <span class="deco-line"></span>
        <h2 class="section-title"><?= esc_html($section['titre']) ?></h2>
      </div>
    <?php endif; ?>
    <?php if (!empty($section['contenu'])): ?>
      <div class="prose"><?= wp_kses_post(wpautop($section['contenu'])) ?></div>
    <?php endif; ?>
    <?php if (!empty($section['bouton_label']) && !empty($section['bouton_url'])): ?>
      <div class="section-cta">
        <a href="<?= esc_url($section['bouton_url']) ?>"
           class="<?= $section['bouton_style'] === 'outline' ? 'btn-outline' : 'btn-primary' ?>"
           <?= !empty($section['bouton_externe']) ? 'target="_blank" rel="noopener"' : '' ?>>
          <?= esc_html($section['bouton_label']) ?>
        </a>
      </div>
    <?php endif; ?>
  </div>
</section>
