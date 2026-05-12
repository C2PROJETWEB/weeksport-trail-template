<?php /* Section : Bénévoles */ ?>
<section class="section section-benevoles reveal">
  <div class="container">
    <div class="benevoles-grid">
      <?php if (!empty($section['image'])): ?>
        <div class="benevoles-img">
          <img src="<?= esc_url(trail_img($section['image'])) ?>" alt="Bénévoles">
        </div>
      <?php endif; ?>
      <div class="benevoles-content">
        <?php if (!empty($section['titre'])): ?>
          <div class="section-header">
            <span class="deco-line"></span>
            <h2 class="section-title"><?= esc_html($section['titre']) ?></h2>
          </div>
        <?php endif; ?>
        <?php if (!empty($section['description'])): ?>
          <div class="prose"><?= wp_kses_post(wpautop($section['description'])) ?></div>
        <?php endif; ?>
        <?php if (!empty($section['lien_inscription'])): ?>
          <a href="<?= esc_url($section['lien_inscription']) ?>" class="btn-primary" target="_blank" rel="noopener">Devenir bénévole</a>
        <?php endif; ?>
      </div>
    </div>
  </div>
</section>
