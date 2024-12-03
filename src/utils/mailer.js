import nodemailer from "nodemailer";

export const sendEmail1 = async (correo, nombreInstructor, tipoInstrucotor, estudiantes) => {
    try {
        let pass = process.env.EMAIL_PASS;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Obtener la fecha actual
        const fechaActual = new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Crear la tabla de estudiantes en formato HTML
        const estudiantesTabla = estudiantes.map((estudiante, index) => {
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${estudiante.nombreFicha}</td>
                    <td>${estudiante.numeroFicha}</td>
                    <td>${estudiante.cc}</td>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.apellido}</td>
                </tr>
            `;
        }).join("");

        const mailOptions = {
            from: '"Etapas Productivas SENA" <etapasproductivascat@sena.edu.co>',
            to: correo,
            subject: `NOTIFICACIÓN ASIGNACIÓN COMO INSTRUCTOR DE ${tipoInstrucotor}`,
            html: `
                <html>
                    <body>
                        <h2>NOTIFICACIÓN DE ASIGNACIÓN COMO INSTRUCTOR DE ${tipoInstrucotor}</h2>
                        <p>Fecha: ${fechaActual}</p>
                        <p>Cordial saludo estimado instructor ${nombreInstructor},</p>
                        <p>Adjunto listado con asignaciones de ${tipoInstrucotor} de etapa productiva para su gestión y apoyo.</p>
                        
                        <h3>Lista de Estudiantes Asignados:</h3>
                        <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>PROGRAMA DE FORMACIÓN</th>
                                    <th>FICHA</th>
                                    <th>CC-TI</th>
                                    <th>APELLIDOS</th>
                                    <th>NOMBRES</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${estudiantesTabla} <!-- Aquí se insertan las filas generadas -->
                            </tbody>
                        </table>
                        
                        <p>La base de datos en el Excel está en su drive con los datos totales.</p>

                        <p>Es muy importante contactar los aprendices cuanto antes, ya que según reglamento del aprendiz debemos realizar el 1er seguimiento los 15 primeros días para establecer las actividades a realizar y orientarlo sobre el proceso. Aunque en algunos casos pasamos ya esta fecha por demoras en la asignación lo invitamos a gestionar cuanto antes la comunicación.</p>

                        <p><b>Recuerde la importancia de llevar un correcto seguimiento tomando y seguir las siguientes recomendaciones:</b></p>
                        <ol>
                            <li>El primer seguimiento debe hacerse cuanto antes para acordar las actividades con su coformador(jefe) (15 días al iniciar en lo posible si dan los tiempos una vez asignados)</li>
                            <li>Son en total 3 seguimientos (iniciando, a mitad y finalizando), es nuestro deber cumplir con los tiempos.</li>
                            <li>Asegúrese de recibir cada 15 días la bitácora que corresponde en la fecha asignada, de lo contrario citar a comité académico por incumplimiento del aprendiz.</li>
                            <li>Maneje el correo y el drive que compartir desde etapas productivas para el seguimiento suyo, en el cual debe guardar la información con los seguimientos, bitácoras y documentos de certificación al día.</li>
                            <li>Las firmas de los documentos son muy importantes ya que convalidan la autenticidad del documento cargue todos los documentos firmados.</li>
                            <li>Revise las fechas recuerde que las fichas se vencen por tiempo y hay unos tiempos máximos (2 años al finalizar su lectiva) para realizar su etapa productiva y el trámite de certificación.</li>
                            <li>Cite a comités cuando el aprendiz incumpla los tiempos, las entregas y haya novedades disciplinarias y académicas, es su responsabilidad como instructor de seguimiento.</li>
                            <li>Deje evidencias por correo electrónico, no por WhatsApp de su gestión con los aprendices.</li>
                            <li>Registre una vez terminado los 3 seguimientos la calificación en Sofia, es su responsabilidad cargarla.</li>
                            <li>Apoye al aprendiz con los documentos de certificación una vez se evalúa al final su etapa productiva y notifíquenos de la entrega de los mismos.</li>
                        </ol>

                        <p>Agradecemos su apoyo, ya que para este proceso y certificación de los aprendices es demasiado importante. Recuerde llevar los documentos en su carpeta asignada en el ONEDRIVE.</p>
                        <p>Cualquier duda estamos para apoyarle.</p>

                        <p>Cordialmente,</p>
                        <p>Equipo Etapas Productivas</p>
                        <p>etapasproductivascat@sena.edu.co</p>
                        <p>(+57) 7248113</p>
                        <p>Calle 22 N° 9 – 82, San Gil Centro Agroturístico</p>
                        <p>Regional Santander</p>
                    </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Mensaje enviado: %s", info.messageId);
        return info.response;

    } catch (error) {
        console.error("Error en la función sendEmail:", error);
        return error;
    }
};




// correo de asignación al aprendiz
export const sendEmail2 = async (correo, nombreAprendiz, instructorNombre, instructorEmail, instructorTelefono) => {
    try {
        let pass = process.env.EMAIL_PASS;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });


        // Obtener la fecha actual
        const fechaActual = new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const mailOptions = {
            from: '"Etapas Productivas SENA" <etapasproductivascat@sena.edu.co>',
            to: correo,
            subject: "ASIGNACIÓN DE INSTRUCTOR PARA REALIZACIÓN SEGUIMIENTO",
            html: `
                <html>
                    <body>
                        <h2>Asignación de Instructor para Seguimiento - Etapas Productivas</h2>
                        <p><strong>Fecha:</strong> ${fechaActual}</p>
                        <p>Cordial saludo apreciado aprendiz <strong>${nombreAprendiz}</strong>,</p>
                        <p>De manera atenta me permito informarle que, de acuerdo con lo establecido en el reglamento del aprendiz, se asigna como instructor de seguimiento al siguiente instructor:</p>
                        
                        <h3>Detalles del Instructor:</h3>
                        <ul>
                            <li><strong>Nombre:</strong> ${instructorNombre}</li>
                            <li><strong>Email:</strong> <a href="mailto:${instructorEmail}">${instructorEmail}</a></li>
                            <li><strong>Teléfono:</strong> ${instructorTelefono}</li>
                        </ul>

                        <h3>Reglamento de Seguimiento:</h3>
                        <p><strong>ARTÍCULO 14. SEGUIMIENTO Y EVALUACIÓN DE LA ETAPA PRODUCTIVA:</strong></p>
                        <p>El seguimiento a la etapa productiva es obligatorio y se realizará de manera virtual y presencial. El aprendiz elaborará una bitácora quincenal, en la que señalará las actividades adelantadas en desarrollo de su etapa productiva. Esta actividad debe complementarse con visitas o comunicación directa realizada por el instructor.</p>

                        <p><strong>Parágrafo:</strong> Si el aprendiz no alcanza los resultados de aprendizaje de la etapa productiva, se procederá a realizar un comité de evaluación para emitir juicios evaluativos finales. Si los juicios no alcanzan los resultados, se procederá a cancelar la matrícula, tras el debido proceso.</p>

                        <h3>Recomendaciones Importantes:</h3>
                        <ol>
                            <li>El primer seguimiento debe hacerse cuanto antes para acordar las actividades con su coformador (jefe).</li>
                            <li>Son en total 3 seguimientos: inicial, a mitad, y finalizando la etapa.</li>
                            <li>Guarde las evidencias que debe presentar cada 15 días en su bitácora, como informes, fotografías, documentos, correos, entre otros.</li>
                            <li>Use el correo y el drive proporcionados por su instructor para realizar el seguimiento.</li>
                            <li>Las firmas de los documentos son esenciales para validar la autenticidad de los mismos.</li>
                            <li>Revise las fechas, ya que las fichas se vencen por tiempo. Recuerde que debe completar la etapa productiva dentro de los dos años a partir de finalizar la lectiva.</li>
                        </ol>

                        <h3>Documentos y Enlace de Google Drive:</h3>
                        <p>Adjunto documentos importantes. Puede consultarlos en el siguiente enlace:</p>
                        <p><a href="https://drive.google.com/drive/folders/1e3naiLl-e6kRF6_rfKp_rwDt2BTUEXXc?usp=sharing" target="_blank">Documentos y Bitácoras en Google Drive</a></p>

                        <p>Recuerde que si tiene problemas de comunicación o incumplimiento de seguimientos con el instructor, debe notificar a este correo para apoyar con la búsqueda de soluciones.</p>

                        <h3>Contacto:</h3>
                        <p>Cualquier duda o inconveniente, no dude en contactarnos:</p>
                        <ul>
                            <li><strong>Email:</strong> <a href="mailto:etapasproductivascat@sena.edu.co">etapasproductivascat@sena.edu.co</a></li>
                            <li><strong>Teléfono:</strong> (+57) 7248113</li>
                            <li><strong>Dirección:</strong> Calle 22 N° 9 – 82, San Gil Centro Agroturístico, Regional Santander</li>
                        </ul>

                        <p>Quedamos atentos a cualquier novedad.</p>

                        <p>Cordialmente,</p>
                        <p><strong>Equipo Etapas Productivas</strong></p>
                    </body>
                </html>
            `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Mensaje enviado: %s", info.messageId);
        return info.response;
    } catch (error) {
        console.error("Error en la función sendEmail:", error);
        return error;
    }
}


// Notificaciones de vecimiento de ficha 
export const sendEmail3 = async (correo, nombreAprendiz, mesesRestantes, mesesParaRegistro) => {
    try {
        let pass = process.env.EMAIL_PASS;
        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });
        // Obtener la fecha actual
        const fechaActual = new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const mailOptions = {
            from: '"Etapas Productivas SENA" <etapasproductivascat@sena.edu.co>',
            to: correo,
            subject: "¡Atención! Se acorta el tiempo para finalizar su formación en el SENA – Regularice su etapa productiva y certifíquese",
            text: `
Cordial saludo estimado aprendiz ${nombreAprendiz},

El motivo de este correo es INFORMARLE desde la coordinación académica del Centro Agroturístico SENA San Gil,
que le hacen falta ${mesesRestantes} MESES para finalizar los dos años que tiene disponible para culminar su proceso de
formación en el Sena y a la fecha usted tiene resultados de aprendizaje pendientes y/o el resultado relacionado 
con su etapa práctica.

*Si usted tiene pendiente competencias de la etapa lectiva por favor comunicarse con el instructor encargado de
 la competencia y/o con el coordinador(a) Académico del programa.

*Si usted tiene pendiente el resultado de aprendizaje de etapa productiva, le recordamos que existen diferentes
 alternativas: CONTRATO DE APRENDIZAJE, VINCULO LABORAL, PASANTÍA (VINCULO FORMATIVO), APOYO A UNA
 ORGANIZACIÓN ESTATAL O ONG SIN ANIMO DE LUCRO, UNIDAD PRODUCTIVA FAMILIAR, PROYECTO PRODUCTIVO

Para modalidad contrato de aprendizaje comunicarse al correo dlalfonso@sena.edu.co; las alternativas diferentes
a Contrato de aprendizaje se debe solicitar el registro ante el coordinador académico al correo
etapasproductivascat@sena.edu.co, para esto usted debe tener aprobado el 100% de las competencias de la
Etapa Lectiva y que no hayan transcurrido más de 18 meses después de terminar la etapa lectiva. Dado lo anterior 
le informamos que le quedan ${mesesParaRegistro} MESES para registrar la alternativa elegida ante el coordinador académico.

Nota:
1. Si se encuentra desarrollando su etapa productiva por favor hacer CASO OMISO a este correo y continuar con su
 proceso con el instructor asignado.
2. Si se encuentra Por Certificar o Certificado por favor hacer CASO OMISO a este correo y continuar con su proceso
 de certificación.

Si usted tiene alguna duda sobre el tema por favor acercarse al centro de formación a la oficina de seguimiento a
etapa productiva para revisar su situación o responder a este correo electrónico.

COMPARTO INFORMACION DE LA FICHA EN LA QUE SE ENCUENTRA MATRICULADO

CODIGO FICHA: 2504381
CODIGO PROGRAMA: 228118
VERSION PROGRAMA: 1
NOMBRE PROGRAMA: ANALISIS Y DESARROLLO DE SOFTWARE
NIVEL FORMACION: TECNÓLOGO

Cordialmente,
Equipo Etapas Productivas
etapasproductivascat@sena.edu.co
(+57) 7248113
Calle 22 N° 9 – 82, San Gil Centro Agroturístico
Regional Santander
  `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Mensaje enviado: %s", info.messageId);
        return info.response;
    } catch (error) {
        console.error("Error en la función sendEmail:", error);
        return error;
    }
}