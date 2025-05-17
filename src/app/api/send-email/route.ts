import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { envFeats, companyName, companyEmail } = await request.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "easymarketspl@gmail.com",
        pass: process.env.SMTP_PASS,
      },
    });

    // Correo para easymarketspl@gmail.com con solicitud
    const mailOptionsAdmin = {
      from: process.env.SMTP_FROM || '"EasyMarketSPL" <no-reply@easymarket.com>',
      to: 'easymarketspl@gmail.com',
      subject: `[NUEVO] Solicitud de Producto - ${companyName}`,
      text: 'Se ha registrado una nueva solicitud de producto para EasyMarketSPL.',
      attachments: [
        { filename: '.env.feats', content: envFeats },
      ],
    };

    // Correo para el usuario confirmando recepción
    const mailOptionsUser = {
      from: process.env.SMTP_FROM || '"EasyMarketSPL" <no-reply@easymarket.com>',
      to: companyEmail,
      subject: 'Confirmación de solicitud EasyMarketSPL',
      text: `Hola,\n\nGracias por su solicitud de producto para EasyMarketSPL. Estamos procesando su requerimiento y nos pondremos en contacto pronto.\n\nAtentamente,\nEquipo EasyMarketSPL`,
    };

    // Enviar ambos correos en paralelo
    await Promise.all([
      transporter.sendMail(mailOptionsAdmin),
      transporter.sendMail(mailOptionsUser),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando email:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
