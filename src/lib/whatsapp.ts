// src/lib/whatsapp.ts
// Mode DÉMO : affiche les messages dans la console au lieu d'envoyer de vrais WhatsApp

export async function sendWhatsApp({
  to,
  message
}: {
  to: string;        // Format: "228XXXXXXXX" ou "+228XXXXXXXX"
  message: string;   // Message à envoyer
}) {
  const demoMode = process.env.WHATSAPP_DEMO_MODE !== "false";
  
  // Normaliser le numéro (format international)
  const cleanPhone = to.replace(/^(\+228|00228|0)/, "+228");
  const whatsappNumber = `whatsapp:${cleanPhone}`;

  if (demoMode) {
    // 🧪 MODE DÉMO : affichage dans la console
    console.log("💬 [WHATSAPP DÉMO] ===================================");
    console.log("💬 [WHATSAPP DÉMO] À:", whatsappNumber);
    console.log("💬 [WHATSAPP DÉMO] Message:");
    console.log(message);
    console.log("💬 [WHATSAPP DÉMO] ===================================");
    console.log("💡 Pour activer l'envoi réel, configure Twilio et passe WHATSAPP_DEMO_MODE=false dans .env");
    return { success: true, demo: true, to: cleanPhone };
  }

  // 🚀 MODE PRODUCTION (Twilio) - à activer plus tard
  try {
    const client = require("twilio")(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: whatsappNumber,
      body: message
    });
    
    console.log(`✅ WhatsApp envoyé à ${cleanPhone}`);
    return { success: true, demo: false };
  } catch (error: any) {
    console.error("❌ Erreur envoi WhatsApp:", error.message);
    return { success: false, error: error.message };
  }
}