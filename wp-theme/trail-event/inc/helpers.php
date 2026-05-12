<?php
/* ── Helpers templates ──────────────────────────────────────────────────── */

/* Récupère les sections d'une page */
function trail_get_sections($post_id = null) {
    $post_id = $post_id ?: get_the_ID();
    $raw = get_post_meta($post_id, '_trail_sections', true);
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/* Affiche toutes les sections d'une page */
function trail_render_sections($post_id = null) {
    $sections = trail_get_sections($post_id);
    foreach ($sections as $section) {
        $type = $section['type'] ?? '';
        $tpl  = get_template_directory() . "/template-parts/sections/{$type}.php";
        if (file_exists($tpl)) {
            include $tpl;
        }
    }
}

/* Retourne l'URL d'une image (ID ou URL) */
function trail_img($id_or_url, $size = 'large') {
    if (!$id_or_url) return '';
    if (is_numeric($id_or_url)) return wp_get_attachment_image_url((int)$id_or_url, $size) ?: '';
    return esc_url($id_or_url);
}

/* Couleurs CSS en variables */
function trail_css_vars() {
    $primary   = trail_opt('couleur_primaire',   '#E63946');
    $secondary = trail_opt('couleur_secondaire', '#1D3557');
    // Calculer RGB pour les effets de glow
    list($r, $g, $b) = sscanf(ltrim($primary, '#'), '%02x%02x%02x');
    echo "<style>:root{--color-primary:{$primary};--color-secondary:{$secondary};--color-primary-rgb:{$r},{$g},{$b};}</style>";
}
add_action('wp_head', 'trail_css_vars');

/* Classe active du menu */
function trail_menu_class($post_id) {
    return (get_the_ID() === $post_id || is_page($post_id)) ? ' active' : '';
}
