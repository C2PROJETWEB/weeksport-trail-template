<?php /* Section : Partenaires */ ?>
<section class="section section-partenaires reveal">
  <div class="container">
    <?php if (!empty($section['titre'])): ?>
      <div class="section-header">
        <span class="deco-line"></span>
        <h2 class="section-title"><?= esc_html($section['titre']) ?></h2>
      </div>
    <?php endif; ?>
    <?php if (!empty($section['description'])): ?>
      <p class="section-intro"><?= esc_html($section['description']) ?></p>
    <?php endif; ?>
    <div class="partenaires-grid">
      <?php foreach (($section['partenaires'] ?? []) as $p): ?>
        <div class="partenaire-item">
          <?php $logo = trail_img($p['logo'] ?? ''); if ($logo): ?>
            <a href="<?= esc_url($p['url'] ?? '#') ?>" target="_blank" rel="noopener" title="<?= esc_attr($p['nom'] ?? '') ?>">
              <img src="<?= esc_url($logo) ?>" alt="<?= esc_attr($p['nom'] ?? '') ?>">
            </a>
          <?php else: ?>
            <span><?= esc_html($p['nom'] ?? '') ?></span>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
