<?php
/* ── Meta box "Sections de la page" ────────────────────────────────────── */
function trail_register_meta_boxes() {
    add_meta_box(
        'trail_sections',
        '📄 Sections de la page',
        'trail_sections_box',
        'page',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'trail_register_meta_boxes');

/* Rendu de la meta box */
function trail_sections_box($post) {
    wp_nonce_field('trail_save_sections', 'trail_sections_nonce');
    $sections = trail_get_sections($post->ID);
    $types = [
        'texte'       => '📝 Texte / Contenu',
        'programme'   => '📅 Programme',
        'epreuves'    => '🏃 Épreuves',
        'galerie'     => '🖼️ Galerie photos',
        'partenaires' => '🤝 Partenaires',
        'contact'     => '📞 Contact',
        'benevoles'   => '🙋 Bénévoles',
        'compteur'    => '⏱️ Compte à rebours',
        'resultats'   => '🏆 Résultats',
        'photos'      => '📷 Photos par année',
    ];
    ?>
    <div id="trail-section-builder" data-sections="<?= esc_attr(json_encode($sections)) ?>">
        <div id="trail-sections-list" class="trail-sections-list">
            <!-- Sections injectées par admin.js -->
        </div>
        <div class="trail-add-section">
            <select id="trail-section-type">
                <option value="">-- Choisir un type de section --</option>
                <?php foreach ($types as $val => $label): ?>
                    <option value="<?= $val ?>"><?= $label ?></option>
                <?php endforeach; ?>
            </select>
            <button type="button" id="trail-add-btn" class="button button-primary">+ Ajouter une section</button>
        </div>
        <input type="hidden" name="trail_sections_data" id="trail-sections-data" value="<?= esc_attr(json_encode($sections)) ?>">
    </div>
    <?php
}

/* Sauvegarde */
function trail_save_sections($post_id) {
    if (!isset($_POST['trail_sections_nonce']) || !wp_verify_nonce($_POST['trail_sections_nonce'], 'trail_save_sections')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_page', $post_id)) return;
    if (!isset($_POST['trail_sections_data'])) return;

    $raw = wp_unslash($_POST['trail_sections_data']);
    $data = json_decode($raw, true);
    if (is_array($data)) {
        update_post_meta($post_id, '_trail_sections', wp_slash(json_encode($data)));
    }
}
add_action('save_post', 'trail_save_sections');
