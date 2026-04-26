// test-brevo.js
require("dotenv").config({ path: ".env" });
const nodemailer = require("nodemailer");

console.log("🧪 Test Brevo avec :");
console.log("  Host:", process.env.BREVO_SMTP_HOST);
console.log("  Port:", process.env.BREVO_SMTP_PORT);
console.log("  Login:", process.env.BREVO_SMTP_LOGIN);
console.log("  Key:", process.env.BREVO_SMTP_KEY?.substring(0, 20) + "...");

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Échec connexion Brevo:", error.message);
    console.error("💡 Vérifie : Login, Key, et que l'expéditeur est validé dans Brevo");
    process.exit(1);
  } else {
    console.log("✅ Connexion Brevo réussie !");
    
    // Essayer d'envoyer un email de test
    transporter.sendMail({
      from: `"PRESSING SHALOM" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_FROM,
      subject: "🧪 Test Brevo - PRESSING SHALOM",
      text: "Si tu reçois ceci, Brevo fonctionne ! ✅",
      html: "<h1>🧪 Test réussi</h1><p>Brevo envoie des emails via PRESSING SHALOM ✅</p>"
    })
    .then(() => {
      console.log("✅ Email de test envoyé ! Vérifie ta boîte Gmail (Principal, Promotions, Spams)");
      process.exit(0);
    })
    .catch(err => {
      console.error("❌ Échec envoi email:", err.message);
      process.exit(1);
    });
  }
});