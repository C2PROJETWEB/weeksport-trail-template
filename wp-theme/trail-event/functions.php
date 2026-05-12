<?php
defined('ABSPATH') || exit;

/* ── Setup ──────────────────────────────────────────────────────────────── */
function trail_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', ['search-form','comment-form','gallery','caption']);
    register_nav_menus(['primary' => 'Menu principal']);
    load_theme_textdomain('trail-event', get_template_directory() . '/languages');
}
add_action('after_setup_theme', 'trail_setup');

/* ── Scripts & styles ───────────────────────────────────────────────────── */
function trail_assets() {
    wp_enqueue_style('trail-main', get_template_directory_uri() . '/assets/css/trail.css', [], '1.0.0');
    wp_enqueue_script('trail-front', get_template_directory_uri() . '/assets/js/front.js', [], '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'trail_assets');

function trail_admin_assets($hook) {
    if (in_array($hook, ['post.php', 'post-new.php', 'appearance_page_trail-settings'])) {
        wp_enqueue_media();
        wp_enqueue_style('trail-admin', get_template_directory_uri() . '/assets/css/admin.css', [], '1.0.0');
        wp_enqueue_script('trail-admin', get_template_directory_uri() . '/assets/js/admin.js', ['jquery', 'jquery-ui-sortable'], '1.0.0', true);
        wp_localize_script('trail-admin', 'trailAdmin', ['ajaxUrl' => admin_url('admin-ajax.php'), 'nonce' => wp_create_nonce('trail_nonce')]);
    }
}
add_action('admin_enqueue_scripts', 'trail_admin_assets');

/* ── Include modules ────────────────────────────────────────────────────── */
require_once get_template_directory() . '/inc/customizer.php';
require_once get_template_directory() . '/inc/meta-boxes.php';
require_once get_template_directory() . '/inc/helpers.php';

/* ── Flush rewrite on activation ───────────────────────────────────────── */
function trail_flush_rewrites() { flush_rewrite_rules(); }
add_action('after_switch_theme', 'trail_flush_rewrites');
