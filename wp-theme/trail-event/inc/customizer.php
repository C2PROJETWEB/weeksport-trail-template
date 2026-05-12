<?php
/* ── Personnalisation du thème (Apparence > Personnaliser) ──────────────── */
function trail_customizer($wp_customize) {

    /* Panel principal */
    $wp_customize->add_panel('trail_panel', [
        'title'    => '🏔️ Réglages Trail',
        'priority' => 10,
    ]);

    /* ── Section : Identité ── */
    $wp_customize->add_section('trail_identity', [
        'title' => 'Identité & couleurs',
        'panel' => 'trail_panel',
    ]);

    trail_add_setting($wp_customize, 'couleur_primaire',   '#E63946', 'WP_Customize_Color_Control', 'Couleur principale',   'trail_identity');
    trail_add_setting($wp_customize, 'couleur_secondaire', '#1D3557', 'WP_Customize_Color_Control', 'Couleur secondaire',   'trail_identity');

    /* ── Section : Hero ── */
    $wp_customize->add_section('trail_hero', [
        'title' => "Page d'accueil — En-tête",
        'panel' => 'trail_panel',
    ]);

    trail_add_setting($wp_customize, 'hero_titre',   '',  null, "Titre principal (nom de l'événement)", 'trail_hero');
    trail_add_setting($wp_customize, 'hero_date',    '',  null, "Date de l'événement (ex: 29 août 2026)", 'trail_hero');
    trail_add_setting($wp_customize, 'hero_cta',     '',  null, 'Texte du bouton principal', 'trail_hero');
    trail_add_setting($wp_customize, 'hero_cta_url', '',  null, "URL du bouton (inscription)", 'trail_hero');

    $wp_customize->add_setting('trail_hero_image', ['default' => '', 'sanitize_callback' => 'absint']);
    $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'trail_hero_image', [
        'label'     => "Photo d'en-tête",
        'section'   => 'trail_hero',
        'mime_type' => 'image',
    ]));

    /* ── Section : Footer ── */
    $wp_customize->add_section('trail_footer', [
        'title' => 'Pied de page',
        'panel' => 'trail_panel',
    ]);

    trail_add_setting($wp_customize, 'footer_texte', '', null, 'Texte du pied de page', 'trail_footer');
}
add_action('customize_register', 'trail_customizer');

/* Helper pour ajouter un réglage + contrôle */
function trail_add_setting($wp_customize, $id, $default, $control_class, $label, $section) {
    $wp_customize->add_setting("trail_$id", [
        'default'           => $default,
        'sanitize_callback' => $control_class === 'WP_Customize_Color_Control' ? 'sanitize_hex_color' : 'sanitize_text_field',
        'transport'         => 'refresh',
    ]);
    $args = ['label' => $label, 'section' => $section, 'settings' => "trail_$id"];
    if ($control_class) {
        $wp_customize->add_control(new $control_class($wp_customize, "trail_$id", $args));
    } else {
        $wp_customize->add_control("trail_$id", $args);
    }
}

/* Helpers pour récupérer les valeurs */
function trail_opt($key, $fallback = '') {
    return get_theme_mod("trail_$key", $fallback);
}

function trail_hero_image_url() {
    $id = trail_opt('hero_image');
    if (!$id) return '';
    return wp_get_attachment_image_url($id, 'full') ?: '';
}
