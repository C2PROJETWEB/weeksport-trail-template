<?php /* Section : Compte à rebours */ ?>
<section class="section section-compteur reveal">
  <div class="container">
    <?php if (!empty($section['titre'])): ?>
      <div class="section-header">
        <span class="deco-line"></span>
        <h2 class="section-title"><?= esc_html($section['titre']) ?></h2>
      </div>
    <?php endif; ?>
    <?php if (!empty($section['date'])): ?>
      <div class="countdown" data-date="<?= esc_attr($section['date']) ?>">
        <div class="countdown-block"><span class="cnt-num" id="cnt-j">--</span><span class="cnt-lbl">Jours</span></div>
        <div class="countdown-block"><span class="cnt-num" id="cnt-h">--</span><span class="cnt-lbl">Heures</span></div>
        <div class="countdown-block"><span class="cnt-num" id="cnt-m">--</span><span class="cnt-lbl">Minutes</span></div>
        <div class="countdown-block"><span class="cnt-num" id="cnt-s">--</span><span class="cnt-lbl">Secondes</span></div>
      </div>
    <?php endif; ?>
  </div>
</section>
