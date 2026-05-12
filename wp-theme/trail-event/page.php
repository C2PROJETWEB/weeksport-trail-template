<?php get_header(); ?>

<div class="page-hero">
  <div class="page-hero-inner">
    <h1 class="page-title"><?php the_title(); ?></h1>
  </div>
</div>

<main class="site-main">
  <?php trail_render_sections(); ?>
  <?php
  // Contenu WordPress classique (si pas de sections custom)
  if (have_posts()): while (have_posts()): the_post();
      $content = get_the_content();
      if ($content && empty(trail_get_sections())):
  ?>
  <div class="container prose">
    <?php the_content(); ?>
  </div>
  <?php endif; endwhile; endif; ?>
</main>

<?php get_footer(); ?>
