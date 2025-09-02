<?php
// public_html/auth/request_link.php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL); ini_set('display_errors', 0);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405); echo json_encode(['ok'=>false,'error'=>'Method not allowed']); exit;
}

/** Cargar config desde /home/USUARIO/canlab_config/config.php */
function load_config_outside_public() {
  // Intento 1: deducir /home/USUARIO desde esta ruta
  if (preg_match('#^(/home/[^/]+)#', __DIR__, $m)) {
    $cfgPath = $m[1] . '/canlab_config/config.php';
    if (is_file($cfgPath)) return require $cfgPath;
  }
  // Intento 2: DOCUMENT_ROOT
  if (!empty($_SERVER['DOCUMENT_ROOT']) && preg_match('#^(/home/[^/]+)#', $_SERVER['DOCUMENT_ROOT'], $m)) {
    $cfgPath = $m[1] . '/canlab_config/config.php';
    if (is_file($cfgPath)) return require $cfgPath;
  }
  // Fallback (dev): por si alguien lo dejó en public_html/config.php
  $fallback = __DIR__ . '/../config.php';
  if (is_file($fallback)) return require $fallback;

  http_response_code(500);
  echo json_encode(['ok'=>false,'error'=>'Config not found']); exit;
}
$cfg = load_config_outside_public();

/** Helper: ruta de storage fuera de public_html */
function storage_path($path='') {
  global $cfg;
  // Usa config si viene; si no, derivar /home/USUARIO/canlab_storage
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

// PHPMailer sin Composer (rutas dentro de public_html)
require __DIR__ . '/../lib/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/../lib/PHPMailer/src/SMTP.php';
require __DIR__ . '/../lib/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/** Helpers varios */
function client_ip() {
  foreach (['HTTP_CF_CONNECTING_IP','HTTP_X_FORWARDED_FOR','REMOTE_ADDR'] as $h) {
    if (!empty($_SERVER[$h])) {
      $ip = $_SERVER[$h];
      if ($h === 'HTTP_X_FORWARDED_FOR') $ip = trim(explode(',', $ip)[0]);
      return $ip;
    }
  }
  return '';
}
function guess_name_from_email($email) {
  $local = strstr($email, '@', true);
  if (!$local) return '';
  $local = preg_replace('/[0-9_]+/',' ', $local);
  $parts = preg_split('/[.\- ]+/', $local, -1, PREG_SPLIT_NO_EMPTY);
  $parts = array_slice($parts, 0, 3);
  $pretty = array_map(fn($s)=>mb_convert_case($s, MB_CASE_TITLE, "UTF-8"), $parts);
  return implode(' ', $pretty);
}
