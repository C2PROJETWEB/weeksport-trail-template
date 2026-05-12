<?php /* Section : Photos par année */ ?>
<section class="section section-photos reveal">
  <div class="container">
    <?php if (!empty($section['titre'])): ?>
      <div class="section-header">
        <span class="deco-line"></span>
        <h2 class="section-title"><?= esc_html($section['titre']) ?></h2>
      </div>
    <?php endif; ?>
    <div class="albums-grid">
      <?php foreach (($section['annees'] ?? []) as $a): ?>
        <a href="<?= esc_url($a['lien'] ?? '#') ?>" class="album-card" target="_blank" rel="noopener">
          <?php $cover = trail_img($a['image'] ?? ''); if ($cover): ?>
            <img src="<?= esc_url($cover) ?>" alt="Album <?= esc_attr($a['annee'] ?? '') ?>">
          <?php endif; ?>
          <div class="album-label"><?= esc_html($a['annee'] ?? '') ?></div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
