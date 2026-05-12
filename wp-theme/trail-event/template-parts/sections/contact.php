<?php /* Section : Contact */ ?>
<section class="section section-contact reveal">
  <div class="container">
    <?php if (!empty($section['titre'])): ?>
      <div class="section-header">
        <span class="deco-line"></span>
        <h2 class="section-title"><?= esc_html($section['titre']) ?></h2>
      </div>
    <?php endif; ?>
    <div class="contact-grid">
      <div class="contact-infos">
        <?php if (!empty($section['texte_intro'])): ?>
          <p><?= wp_kses_post($section['texte_intro']) ?></p>
        <?php endif; ?>
        <?php if (!empty($section['email'])): ?>
          <p>✉️ <a href="mailto:<?= esc_attr($section['email']) ?>"><?= esc_html($section['email']) ?></a></p>
        <?php endif; ?>
        <?php if (!empty($section['telephone'])): ?>
          <p>📞 <?= esc_html($section['telephone']) ?></p>
        <?php endif; ?>
        <?php if (!empty($section['adresse'])): ?>
          <p>📍 <?= nl2br(esc_html($section['adresse'])) ?></p>
        <?php endif; ?>
      </div>
      <?php if (!empty($section['email'])): ?>
      <form class="contact-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <input type="hidden" name="action" value="trail_contact">
        <input type="hidden" name="recipient" value="<?= esc_attr($section['email']) ?>">
        <?php wp_nonce_field('trail_contact_form'); ?>
        <input type="text"  name="nom"     placeholder="Votre nom"    required class="field-input">
        <input type="email" name="email"   placeholder="Votre email"  required class="field-input">
        <textarea name="message" placeholder="Votre message" rows="5" required class="field-input"></textarea>
        <button type="submit" class="btn-primary">Envoyer</button>
      </form>
      <?php endif; ?>
    </div>
  </div>
</section>
