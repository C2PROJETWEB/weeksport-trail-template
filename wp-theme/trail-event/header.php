<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" id="site-header">
  <div class="header-inner">

    <a href="<?php echo home_url('/'); ?>" class="site-logo">
      <?php
      $logo_id = get_theme_mod('custom_logo');
      if ($logo_id):
          echo wp_get_attachment_image($logo_id, 'full', false, ['class' => 'logo-img']);
      else:
          echo '<span class="logo-text">' . get_bloginfo('name') . '</span>';
      endif;
      ?>
    </a>

    <button class="nav-toggle" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <nav class="site-nav" id="site-nav">
      <?php
      wp_nav_menu([
          'theme_location' => 'primary',
          'container'      => false,
          'menu_class'     => 'nav-list',
          'fallback_cb'    => false,
          'walker'         => new Trail_Nav_Walker(),
      ]);
      ?>
    </nav>

  </div>
</header>
<?php

/* Walker personnalisé pour le menu avec sous-menus */
class Trail_Nav_Walker extends Walker_Nav_Menu {
    function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $classes = implode(' ', $item->classes ?? []);
        $has_children = in_array('menu-item-has-children', $item->classes ?? []);
        $output .= '<li class="nav-item' . ($has_children ? ' has-dropdown' : '') . '">';
        $output .= '<a href="' . esc_url($item->url) . '" class="nav-link">' . esc_html($item->title);
        if ($has_children) $output .= ' <span class="arrow">▾</span>';
        $output .= '</a>';
    }
    function start_lvl(&$output, $depth = 0, $args = null) {
        $output .= '<ul class="dropdown">';
    }
    function end_lvl(&$output, $depth = 0, $args = null) {
        $output .= '</ul>';
    }
    function end_el(&$output, $item, $depth = 0, $args = null) {
        $output .= '</li>';
    }
}
