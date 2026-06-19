<?php
/**
 * Plugin Name: USH WooCommerce API Proxy
 * Description: API personnalisée pour exposer les produits WooCommerce avec CORS activé
 * Version: 1.0
 * Author: USH
 */

// ====== CONFIGURATION ======
// Remplace ces valeurs par tes vraies clés WooCommerce
define('USH_WC_CK', 'ck_07c44ce9e1bcaadf1a58908e64b7167ab9700496');
define('USH_WC_CS', 'cs_911faadc45d8dc7ad9e9cf4e529ef2bd21de7d66');

// Origine autorisée pour CORS (ton front en dev)
define('USH_ALLOWED_ORIGIN', 'http://127.0.0.1:3000');

// ====== CORS pour l'API REST WordPress ======
add_action('rest_api_init', function () {
    // Supprime les headers CORS par défaut
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

    add_filter('rest_pre_serve_request', function ($value) {
        header('Access-Control-Allow-Origin: ' . USH_ALLOWED_ORIGIN);
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');

        // Réponse aux pré-requêtes OPTIONS (CORS preflight)
        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit;
        }

        return $value;
    });
}, 15);

// ====== Endpoint personnalisé : /wp-json/ush/v1/products ======
add_action('rest_api_init', function () {
    register_rest_route('ush/v1', '/products', [
        'methods'             => 'GET',
        'callback'            => 'ush_get_products',
        'permission_callback' => '__return_true', // Public pour l'instant
    ]);
});

/**
 * Récupère les produits depuis l'API WooCommerce v3
 * 
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function ush_get_products( WP_REST_Request $request ) {
    // URL de l'API WooCommerce v3
    $base_url = 'https://shopushindi.com/wp-json/wc/v3/products';

    // Récupération des paramètres de requête
    $page     = max(1, (int) $request->get_param('page'));
    $per_page = max(1, min(100, (int) $request->get_param('per_page'))); // max 100
    $search   = sanitize_text_field($request->get_param('search'));
    $orderby  = sanitize_text_field($request->get_param('orderby'));
    $order    = sanitize_text_field($request->get_param('order'));

    // Construction des paramètres
    $args = [
        'page'     => $page,
        'per_page' => $per_page,
    ];

    if (!empty($search)) {
        $args['search'] = $search;
    }
    if (!empty($orderby)) {
        $args['orderby'] = $orderby;
    }
    if (!empty($order)) {
        $args['order'] = strtoupper($order) === 'ASC' ? 'asc' : 'desc';
    }

    // Construction de l'URL complète
    $url = add_query_arg($args, $base_url);

    // Appel à l'API WooCommerce avec authentification Basic
    $response = wp_remote_get($url, [
        'headers' => [
            'Authorization' => 'Basic ' . base64_encode(USH_WC_CK . ':' . USH_WC_CS),
            'Accept'        => 'application/json',
        ],
        'timeout' => 30,
    ]);

    // Gestion des erreurs
    if (is_wp_error($response)) {
        return new WP_REST_Response([
            'error'   => true,
            'message' => $response->get_error_message(),
        ], 500);
    }

    $status_code = wp_remote_retrieve_response_code($response);
    
    if ($status_code !== 200) {
        $body = wp_remote_retrieve_body($response);
        return new WP_REST_Response([
            'error'   => true,
            'message' => 'Erreur API WooCommerce',
            'status'  => $status_code,
            'body'    => $body,
        ], $status_code);
    }

    // Récupération des données
    $body    = wp_remote_retrieve_body($response);
    $data    = json_decode($body, true);
    $headers = wp_remote_retrieve_headers($response);

    // Construction de la réponse REST
    $rest_response = new WP_REST_Response($data, 200);

    // Propagation des headers de pagination
    if (isset($headers['x-wp-totalpages'])) {
        $rest_response->header('X-WP-TotalPages', $headers['x-wp-totalpages']);
    }
    if (isset($headers['x-wp-total'])) {
        $rest_response->header('X-WP-Total', $headers['x-wp-total']);
    }

    return $rest_response;
}

