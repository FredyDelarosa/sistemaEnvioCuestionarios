-- B3: plantillas de correo sin imágenes en base64
--
-- Las 3 plantillas pesaban unos 160 KB por 2 imágenes incrustadas en base64.
-- Gmail recorta los correos de más de 100 KB y no muestra imágenes base64.
-- Aquí las imágenes van por enlace a {{backend_url}}/img/ y cada plantilla pesa de 4 a 5 KB.
--
-- ANTES de correr esto: copiar encabezado-encuesta.png y logo-upchiapas.png
-- a la carpeta img/ del servidor del back y revisar que abran desde internet.
-- Hacer respaldo de las 3 filas de template_correo antes de aplicar.

-- Plantilla 220001: imágenes por enlace en lugar de base64 (B3)
SET NAMES utf8mb4;
UPDATE template_correo SET layout_html='<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  @media only screen and (max-width: 600px) {
    .responsive-table { width: 100% !important; max-width: 100% !important; }
    .header-box { height: auto !important; min-height: 300px !important; padding: 30px 20px !important; }
    .content-box { padding: 20px !important; }
    .wrapper-box { padding: 20px 10px !important; }
    .btn { padding: 12px 20px !important; font-size: 14px !important; width: 100% !important; box-sizing: border-box !important; }
  }
</style>
<title>Plantilla de correo - Encuesta - Egresados UPChiapas 2026</title>
</head>
<body style="margin:0; padding:0; background:#E7E9F3; font-family:Arial, Helvetica, sans-serif;">
<div style="max-width:680px; margin:0 auto; padding:40px 0;" class="wrapper-box">

  <table class="responsive-table" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; max-width:100%; margin:0 auto; border-radius:18px; overflow:hidden; box-shadow:0 18px 40px rgba(11,15,64,0.25);">
    <tr>
      <td bgcolor="#1C258E" style="position:relative; background-color:#1C258E; background:linear-gradient(135deg,#161c72 0%,#1C258E 55%,#233098 100%); padding:0;">
        <div class="header-box" style="position:relative; min-height:400px; height:auto; padding:40px; box-sizing:border-box; overflow:hidden; background-image:url(\'{{backend_url}}/img/encabezado-encuesta.png\'); background-repeat:no-repeat; background-position:center center; background-size:contain;">
          
          <div style="position:relative; z-index:2; max-width:100%;">
            
            <p style="margin:0 0 6px 0; font-size:12px; letter-spacing:2.5px; font-weight:700; color:#00CEBA; text-transform:uppercase;">Encuesta</p>
            <h1 style="margin:0 0 18px 0; font-size:26px; line-height:1.25; font-weight:800; color:#FFFFFF; font-family:Arial, Helvetica, sans-serif;">Participa en esta encuesta</h1>
            <p style="margin:0 0 14px 0; font-size:15px; line-height:1.65; color:#EDEFF9;">Es un honor recibirles en este espacio diseñado especialmente para mantener viva la conexión con nuestra comunidad universitaria. Aquí podrás reencontrarte con compañeros, fortalecer redes profesionales, compartir experiencias y acceder a oportunidades de formación continua, empleabilidad y cooperación internacional.</p>
<p style="margin:0 0 14px 0; font-size:15px; line-height:1.65; color:#EDEFF9;">Este espacio busca ser un puente entre su trayectoria académica y tu desarrollo profesional, promoviendo la identidad institucional y el orgullo de pertenecer a nuestra universidad.</p>
<p style="margin:0 0 14px 0; font-size:15px; line-height:1.65; color:#EDEFF9;">La información que nos proporciones en la encuesta que te enviamos cumple con el aviso de privacidad de la UPChiapas.</p>
<p style="margin:0 0 14px 0; font-size:15px; line-height:1.65; color:#EDEFF9;">Te invitamos a explorar las secciones disponibles, actualizar tus datos, participar en actividades y seguir construyendo juntos una comunidad sólida, inclusiva y comprometida con el futuro.</p>
            <div style="text-align:center; margin: 30px 0;">
              <a href="{{link_encuesta}}" style="background-color: #00CEBA; color: #161c72; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;" class="btn">Responder Encuesta</a>
            </div>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background:#F4F6FC; padding:28px 34px 12px 34px;" class="content-box">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding-bottom:18px;">
              <img src="{{backend_url}}/img/logo-upchiapas.png" alt="Universidad Politécnica de Chiapas" style="height:44px; width:auto; display:block;" />
            </td>
          </tr>
        </table>
        <hr style="border:none; border-top:1px solid #D7DCF0; margin:0 0 16px 0;" />
      </td>
    </tr>
    <tr>
      <td style="background:#F4F6FC; padding:0 34px 30px 34px; text-align:center;" class="content-box">
        <p style="margin:0 0 4px 0; font-size:12px; color:#6B7290; line-height:1.6;">Si el botón superior no funciona, copia y pega el siguiente enlace en tu navegador:</p>
        <a href="{{link_encuesta}}" style="font-size:12px; color:#1C258E; word-break:break-all; display:block; margin-bottom: 20px;">{{link_encuesta}}</a>
        <p style="margin:0; font-size:11.5px; color:#6B7290; line-height:1.6;">Aviso de privacidad</p>
        <a href="https://www.upchiapas.edu.mx/media/1348/files/Aviso%20de%20privacidad%20UPChiapas%202024.pdf" style="font-size:11.5px; color:#1C258E; word-break:break-all;">https://www.upchiapas.edu.mx/media/1348/files/Aviso%20de%20privacidad%20UPChiapas%202024.pdf</a>
      </td>
    </tr>
  </table>

</div>
</body>
</html>

' WHERE id_template=220001;

-- Plantilla 220002: imágenes por enlace en lugar de base64 (B3)
SET NAMES utf8mb4;
UPDATE template_correo SET layout_html='<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  @media only screen and (max-width: 600px) {
    .responsive-table { width: 100% !important; max-width: 100% !important; }
    .header-box { height: auto !important; min-height: 300px !important; padding: 30px 20px !important; }
    .content-box { padding: 20px !important; }
    .wrapper-box { padding: 20px 10px !important; }
    .btn { padding: 12px 20px !important; font-size: 14px !important; width: 100% !important; box-sizing: border-box !important; }
  }
</style>
<title>Plantilla de correo - Felicitación - Egresados UPChiapas 2026</title>
</head>
<body style="margin:0; padding:0; background:#E7E9F3; font-family:Arial, Helvetica, sans-serif;">
<div style="max-width:680px; margin:0 auto; padding:40px 0;" class="wrapper-box">

  <table class="responsive-table" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; max-width:100%; margin:0 auto; border-radius:18px; overflow:hidden; box-shadow:0 18px 40px rgba(11,15,64,0.25);">
    <tr>
      <td bgcolor="#1C258E" style="position:relative; background-color:#1C258E; background:linear-gradient(135deg,#161c72 0%,#1C258E 55%,#233098 100%); padding:0;">
        <div class="header-box" style="position:relative; min-height:400px; height:auto; padding:40px; box-sizing:border-box; overflow:hidden; background-image:url(\'{{backend_url}}/img/encabezado-encuesta.png\'); background-repeat:no-repeat; background-position:center center; background-size:contain;">
          
          <div style="position:relative; z-index:2; max-width:100%;">
            
            <p style="margin:0 0 6px 0; font-size:12px; letter-spacing:2.5px; font-weight:700; color:#00CEBA; text-transform:uppercase;">Felicitación</p>
            <h1 style="margin:0 0 18px 0; font-size:26px; line-height:1.25; font-weight:800; color:#FFFFFF; font-family:Arial, Helvetica, sans-serif;">¡Feliz cumpleaños!</h1>
            <p style="margin:0 0 14px 0; font-size:15px; line-height:1.65; color:#EDEFF9;">En nombre de la Universidad Politécnica de Chiapas, extendemos un afectuoso saludo y nuestras más sinceras felicitaciones en este día tan especial. Celebrar un año más de vida es también reconocer la trayectoria, el esfuerzo y la valiosa contribución que cada miembro de nuestra comunidad realiza.</p>
<p style="margin:0 0 14px 0; font-size:15px; line-height:1.65; color:#EDEFF9;">Que este nuevo ciclo esté lleno de salud, logros y satisfacciones personales y profesionales. Nos enorgullece contar con su presencia en nuestra comunidad y deseamos que continúe siendo parte activa de los proyectos y sueños que compartimos.</p>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background:#F4F6FC; padding:28px 34px 12px 34px;" class="content-box">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding-bottom:18px;">
              <img src="{{backend_url}}/img/logo-upchiapas.png" alt="Universidad Politécnica de Chiapas" style="height:44px; width:auto; display:block;" />
            </td>
          </tr>
        </table>
        <hr style="border:none; border-top:1px solid #D7DCF0; margin:0 0 16px 0;" />
      </td>
    </tr>
    <tr>
      <td style="background:#F4F6FC; padding:0 34px 30px 34px; text-align:center;" class="content-box">
        <p style="margin:0; font-size:11.5px; color:#6B7290; line-height:1.6;">Aviso de privacidad</p>
        <a href="https://www.upchiapas.edu.mx/media/1348/files/Aviso%20de%20privacidad%20UPChiapas%202024.pdf" style="font-size:11.5px; color:#1C258E; word-break:break-all;">https://www.upchiapas.edu.mx/media/1348/files/Aviso%20de%20privacidad%20UPChiapas%202024.pdf</a>
      </td>
    </tr>
  </table>

</div>
</body>
</html>

' WHERE id_template=220002;

-- Plantilla 220003: imágenes por enlace en lugar de base64 (B3)
SET NAMES utf8mb4;
UPDATE template_correo SET layout_html='<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  @media only screen and (max-width: 600px) {
    .responsive-table { width: 100% !important; max-width: 100% !important; }
    .header-box { height: auto !important; min-height: 300px !important; padding: 30px 20px !important; }
    .content-box { padding: 20px !important; }
    .wrapper-box { padding: 20px 10px !important; }
    .btn { padding: 12px 20px !important; font-size: 14px !important; width: 100% !important; box-sizing: border-box !important; }
  }
</style>
<title>Plantilla de correo - Recordatorio - Egresados UPChiapas 2026</title>
</head>
<body style="margin:0; padding:0; background:#E7E9F3; font-family:Arial, Helvetica, sans-serif;">
<div style="max-width:680px; margin:0 auto; padding:40px 0;" class="wrapper-box">

  <table class="responsive-table" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; max-width:100%; margin:0 auto; border-radius:18px; overflow:hidden; box-shadow:0 18px 40px rgba(11,15,64,0.25);">
    <tr>
      <td bgcolor="#1C258E" style="position:relative; background-color:#1C258E; background:linear-gradient(135deg,#161c72 0%,#1C258E 55%,#233098 100%); padding:0;">
        <div class="header-box" style="position:relative; min-height:400px; height:auto; padding:40px; box-sizing:border-box; overflow:hidden; background-image:url(\'{{backend_url}}/img/encabezado-encuesta.png\'); background-repeat:no-repeat; background-position:center center; background-size:contain;">
          
          <div style="position:relative; z-index:2; max-width:100%;">
            <p style="margin:0 0 4px 0; font-size:13px; color:#C7CCEE;">Estimado/a egresado/a</p>
            <p style="margin:0 0 6px 0; font-size:12px; letter-spacing:2.5px; font-weight:700; color:#00CEBA; text-transform:uppercase;">Recordatorio</p>
            <h1 style="margin:0 0 18px 0; font-size:26px; line-height:1.25; font-weight:800; color:#FFFFFF; font-family:Arial, Helvetica, sans-serif;">Tu opinión sigue esperándonos</h1>
            <p style="margin:0 0 14px 0; font-size:15px; line-height:1.65; color:#EDEFF9;">Con el propósito de fortalecer nuestros vínculos y mejorar los servicios que ofrecemos a nuestra comunidad egresada de la UPChiapas, te invitamos cordialmente a responder la encuesta que te hemos enviado recientemente. Tu participación es fundamental para conocer tus experiencias, expectativas y propuestas, y así seguir construyendo juntos una red activa y comprometida.</p>
<p style="margin:0 0 14px 0; font-size:15px; line-height:1.65; color:#EDEFF9;">Agradecemos de antemano el tiempo que dedique a este ejercicio, que contribuirá al desarrollo de nuevas oportunidades académicas, profesionales y culturales.</p>
            <div style="text-align:center; margin: 30px 0;">
              <a href="{{link_encuesta}}" style="background-color: #00CEBA; color: #161c72; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;" class="btn">Responder Encuesta</a>
            </div>
          </div>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background:#F4F6FC; padding:28px 34px 12px 34px;" class="content-box">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding-bottom:18px;">
              <img src="{{backend_url}}/img/logo-upchiapas.png" alt="Universidad Politécnica de Chiapas" style="height:44px; width:auto; display:block;" />
            </td>
          </tr>
        </table>
        <hr style="border:none; border-top:1px solid #D7DCF0; margin:0 0 16px 0;" />
      </td>
    </tr>
    <tr>
      <td style="background:#F4F6FC; padding:0 34px 30px 34px; text-align:center;" class="content-box">
        <p style="margin:0 0 4px 0; font-size:12px; color:#6B7290; line-height:1.6;">Si el botón superior no funciona, copia y pega el siguiente enlace en tu navegador:</p>
        <a href="{{link_encuesta}}" style="font-size:12px; color:#1C258E; word-break:break-all; display:block; margin-bottom: 20px;">{{link_encuesta}}</a>
        <p style="margin:0; font-size:11.5px; color:#6B7290; line-height:1.6;">Aviso de privacidad</p>
        <a href="https://www.upchiapas.edu.mx/media/1348/files/Aviso%20de%20privacidad%20UPChiapas%202024.pdf" style="font-size:11.5px; color:#1C258E; word-break:break-all;">https://www.upchiapas.edu.mx/media/1348/files/Aviso%20de%20privacidad%20UPChiapas%202024.pdf</a>
      </td>
    </tr>
  </table>

</div>
</body>
</html>

' WHERE id_template=220003;

