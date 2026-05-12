<footer class="site-footer">
  <div class="footer-inner">
    <p><?php echo wp_kses_post(trail_opt('footer_texte', '&copy; ' . date('Y') . ' ' . get_bloginfo('name') . '. Tous droits réservés.')); ?></p>
  </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
