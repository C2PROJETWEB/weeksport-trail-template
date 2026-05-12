<?php /* Section : Galerie photos */ ?>
<section class="section section-galerie reveal">
  <div class="container">
    <?php if (!empty($section['titre'])): ?>
      <div class="section-header">
        <span class="deco-line"></span>
        <h2 class="section-title"><?= esc_html($section['titre']) ?></h2>
      </div>
    <?php endif; ?>
    <div class="galerie-grid">
      <?php foreach (($section['photos'] ?? []) as $photo): ?>
        <div class="galerie-item">
          <img src="<?= esc_url(trail_img($photo['image'] ?? '')) ?>" alt="<?= esc_attr($photo['legende'] ?? '') ?>" loading="lazy">
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
