// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { envFront, envBack } = await request.json();

    // Configura aquí tu SMTP o usa variables de entorno
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "easymarketspl@gmail.com",
        pass: process.env.SMTP_PASS
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || '"EasyMarketSPL" <no-reply@easymarket.com>',
      to: 'easymarketspl@gmail.com',
      subject: '[NUEVO] Solicitud de Producto',
      text: 'Se ha registrado una nueva solicitud de producto para EasyMarketSPL.',
      attachments: [
        { filename: '.env.front', content: envFront },
        { filename: '.env.back', content: envBack },
      ],
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando email:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
