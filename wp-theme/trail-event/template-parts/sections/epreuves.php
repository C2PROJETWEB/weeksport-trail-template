<?php /* Section : Épreuves */ ?>
<section class="section section-epreuves reveal">
  <div class="container">
    <?php if (!empty($section['titre'])): ?>
      <div class="section-header">
        <span class="deco-line"></span>
        <h2 class="section-title"><?= esc_html($section['titre']) ?></h2>
      </div>
    <?php endif; ?>
    <div class="epreuves-grid">
      <?php foreach (($section['epreuves'] ?? []) as $ep): ?>
        <div class="epreuve-card">
          <?php if (!empty($ep['image'])): ?>
            <div class="epreuve-img">
              <img src="<?= esc_url(trail_img($ep['image'])) ?>" alt="<?= esc_attr($ep['nom'] ?? '') ?>">
            </div>
          <?php endif; ?>
          <div class="epreuve-body">
            <h3 class="epreuve-nom"><?= esc_html($ep['nom'] ?? '') ?></h3>
            <div class="epreuve-meta">
              <?php if (!empty($ep['distance'])): ?><span>📏 <?= esc_html($ep['distance']) ?></span><?php endif; ?>
              <?php if (!empty($ep['denivele'])): ?><span>⛰️ <?= esc_html($ep['denivele']) ?></span><?php endif; ?>
              <?php if (!empty($ep['depart'])): ?><span>🕐 <?= esc_html($ep['depart']) ?></span><?php endif; ?>
            </div>
            <?php if (!empty($ep['description'])): ?>
              <p class="epreuve-desc"><?= esc_html($ep['description']) ?></p>
            <?php endif; ?>
            <?php if (!empty($ep['lien_inscription'])): ?>
              <a href="<?= esc_url($ep['lien_inscription']) ?>" class="btn-primary btn-sm" target="_blank" rel="noopener">S'inscrire</a>
            <?php endif; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
