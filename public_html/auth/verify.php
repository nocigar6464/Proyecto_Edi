<?php
// public_html/auth/verify.php
error_reporting(E_ALL); ini_set('display_errors', 0);

/** Cargar config desde /home/USUARIO/canlab_config/config.php */
function load_config_outside_public() {
  if (preg_match('#^(/home/[^/]+)#', __DIR__, $m)) {
    $cfgPath = $m[1] . '/canlab_config/config.php';
    if (is_file($cfgPath)) return require $cfgPath;
  }
  if (!empty($_SERVER['DOCUMENT_ROOT']) && preg_match('#^(/home/[^/]+)#', $_SERVER['DOCUMENT_ROOT'], $m)) {
    $cfgPath = $m[1] . '/canlab_config/config.php';
    if (is_file($cfgPath)) return require $cfgPath;
  }
  $fallback = __DIR__ . '/../config.php';
  if (is_file($fallback)) return require $fallback;
  http_response_code(500); echo "Config not found."; exit;
}
$cfg = load_config_outside_public();

/** Helper: storage fuera de public_html */
function storage_path($path='') {
  global $cfg;
  if (!empty($cfg['storage_base'])) {
    $base = $cfg['storage_base'];
  } else {
    if (preg_match('#^(/home/[^/]+)#', __DIR__, $m)) {
      $base = $m[1] . '/canlab_storage';
    } else {
      $base = dirname(__DIR__, 2) . '/canlab_storage';
    }
  }
  if (!is_dir($base)) @mkdir($base, 0700, true);
  if ($path && strpos($path, '/') === false && !is_dir($base.'/'.$path)) {
    @mkdir($base.'/'.$path, 0700, true);
  }
  return $base . ($path ? '/'.$path : '');
}

// PHPMailer (para notificar lead verificado al admin)
require __DIR__ . '/../lib/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../lib/PHPMailer/src/SMTP.php';
require __DIR__ . '/../lib/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/** Helper token */
function b64url_decode($d) { $r = strtr($d, '-_', '+/'); return base64_decode($r . str_repeat('=', (4 - strlen($r) % 4) % 4)); }
