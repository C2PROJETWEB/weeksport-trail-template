<?php /* Section : Programme */ ?>
<section class="section section-programme reveal">
  <?php if (!empty($section['image'])): ?>
    <div class="programme-bg" style="--bg-img: url('<?= esc_url(trail_img($section['image'])) ?>')">
      <div class="programme-overlay"></div>
  <?php else: ?>
    <div class="programme-bg">
  <?php endif; ?>
    <div class="container">
      <?php if (!empty($section['titre'])): ?>
        <div class="section-header section-header--light">
          <span class="deco-line deco-line--white"></span>
          <h2 class="section-title section-title--white"><?= esc_html($section['titre']) ?></h2>
        </div>
      <?php endif; ?>
      <?php if (!empty($section['contenu'])): ?>
        <div class="prose prose--white"><?= wp_kses_post(wpautop($section['contenu'])) ?></div>
      <?php endif; ?>
    </div>
  </div>
</section>
