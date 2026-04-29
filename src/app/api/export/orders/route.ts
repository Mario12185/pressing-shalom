import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });

    const statusMap: Record<string, string> = {
      EN_COURS: 'En cours',
      PRET: 'Prêt',
      LIVRE: 'Livré',
      ANNULE: 'Annulé'
    };

    const headers = [
      'ID Commande', 'Client', 'Téléphone', 'Service',
      'Quantité', 'Prix Unitaire (FCFA)', 'Total (FCFA)',
      'Statut', 'Mode', 'Date de création'
    ];

        const rows = orders.map(o => [
      String(o.id),
      `"${(o.clientName || '').replace(/"/g, '""')}"`,
      String(o.clientPhone || ''),
      String(o.serviceId || 'N/A'),
      String(o.quantity),
      String(Number(o.unitPrice || 0)),
      String(Number(o.total || 0)),
      String(statusMap[o.status as keyof typeof statusMap] || o.status),
      String(o.deliveryType === 'pickup' ? 'Retrait' : 'Livraison'),
      new Date(o.createdAt).toLocaleDateString('fr-FR')
    ]);

    // 🌍 BOM UTF-8 obligatoire pour qu'Excel affiche les accents
    const bom = '\uFEFF';
    const csvContent = bom + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv;charset=utf-8',
        'Content-Disposition': 'attachment; filename="commandes-pressing-shalom.csv"',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error) {
    console.error('❌ Erreur export CSV:', error);
    return NextResponse.json({ error: 'Impossible de générer l\'export' }, { status: 500 });
  }
}