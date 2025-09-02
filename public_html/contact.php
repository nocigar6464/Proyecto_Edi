<?php
// public_html/contact.php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL); ini_set('display_errors', 1);

// Carga PHPMailer sin Composer (ajustado a tu carpeta)
require __DIR__ . '/lib/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/lib/PHPMailer/src/SMTP.php';
require __DIR__ . '/lib/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok'=>false,'error'=>'Method not allowed']);
  exit;
}

// Acepta JSON o form POST tradicional
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) { $data = $_POST; }

$name    = trim($data['name']    ?? '');
$email   = trim($data['email']   ?? '');
$phone   = trim($data['phone']   ?? '');
$message = trim($data['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
  http_response_code(400);
  echo json_encode(['ok'=>false,'error'=>'Missing fields']);
  exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok'=>false,'error'=>'Invalid email']);
  exit;
}
// Sanitiza para evitar header injection
$name  = str_replace(["\r","\n"], ' ', $name);
$email = str_replace(["\r","\n"], '', $email);

// Cuerpo del correo
$body = "Nombre: $name\nEmail: $email\nTelefono: $phone\n\nMensaje:\n$message\n";

$mail = new PHPMailer(true);
try {
  // === SMTP Hostinger ===
  $mail->isSMTP();
  $mail->Host       = 'smtp.hostinger.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = 'no-reply@canlab.cl';
  $mail->Password   = 'u@3M5?!NGP';   // <-- nueva se cambia en panel de hostinger
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // probar 587 primero
  $mail->Port       = 587;                            // si falla: SMTPS + 465
  $mail->CharSet    = 'UTF-8';

  // Remitentes / destinatarios
  $mail->setFrom('no-reply@canlab.cl', 'Formulario Web');
  $mail->addAddress('eduardo.schwerter@gmail.com');
  $mail->addReplyTo($email, $name);

  // Contenido
  $mail->Subject = 'Nuevo contacto desde canlab.cl';
  $mail->isHTML(false);
  $mail->Body = $body;

  // Debug opcional a error_log:
  // $mail->SMTPDebug = 2;
  // $mail->Debugoutput = 'error_log';

  $mail->send();
  echo json_encode(['ok'=>true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok'=>false,'error'=>$mail->ErrorInfo ?: $e->getMessage()]);
}
