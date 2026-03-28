const nodemailer = require('nodemailer');

let transporter;

const getTransporter = async () => {
  if (transporter) {
    return transporter;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    return transporter;
  }

  transporter = nodemailer.createTransport({
    jsonTransport: true,
  });

  return transporter;
};

const sendOrderConfirmationEmail = async ({ order, user }) => {
  if (!user?.email) {
    return null;
  }

  const transport = await getTransporter();
  const itemsText = order.items
    .map((item) => `- ${item.product.name} x ${item.quantity}`)
    .join('\n');

  const info = await transport.sendMail({
    from: process.env.MAIL_FROM || 'noreply@flipkart-clone.local',
    to: user.email,
    subject: `Order #${order.id} confirmed`,
    text: [
      `Hi ${user.name},`,
      '',
      `Your order #${order.id} has been placed successfully.`,
      '',
      'Items:',
      itemsText,
      '',
      `Total: INR ${Number(order.total).toFixed(2)}`,
      '',
      'Thank you for shopping with us.',
    ].join('\n'),
  });

  return info;
};

module.exports = { sendOrderConfirmationEmail };
