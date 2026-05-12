<?php get_header(); ?>

<!-- Hero -->
<?php
$hero_img = trail_hero_image_url();
$hero_titre = trail_opt('hero_titre', get_bloginfo('name'));
$hero_date  = trail_opt('hero_date');
$hero_cta   = trail_opt('hero_cta');
$hero_cta_url = trail_opt('hero_cta_url');
?>
<section class="hero" <?php if ($hero_img): ?>style="--hero-img: url('<?= esc_url($hero_img) ?>')"<?php endif; ?>>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <?php if ($hero_date): ?>
      <p class="hero-date"><?= esc_html($hero_date) ?></p>
    <?php endif; ?>
    <h1 class="hero-title"><?= esc_html($hero_titre) ?></h1>
    <?php if ($hero_cta && $hero_cta_url): ?>
      <a href="<?= esc_url($hero_cta_url) ?>" class="btn-primary hero-btn" target="_blank" rel="noopener">
        <?= esc_html($hero_cta) ?>
      </a>
    <?php endif; ?>
  </div>
</section>

<!-- Sections de la page d'accueil -->
<main class="site-main">
  <?php trail_render_sections(); ?>
</main>

<?php get_footer(); ?>
