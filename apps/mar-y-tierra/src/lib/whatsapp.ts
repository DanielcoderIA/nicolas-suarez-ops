import { CartItem } from "@/store/useCartStore";

interface CustomerData {
  name: string;
  address: string;
  neighborhood: string;
  paymentMethod: string;
}

export function generateWhatsAppLink(
  orderId: string,
  items: CartItem[],
  totalPrice: number,
  customerData: CustomerData
): string {
  // Get admin whatsapp from env or fallback to provided number
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP?.replace(/\D/g, "") || "573213359659";

  const formatCOP = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Build items list
  const itemsText = items
    .map((item) => {
      let line = `• ${item.quantity}x ${item.name} (${formatCOP(item.price * item.quantity)})`;
      if (item.variant) line += `\n  - ${item.variant}`;
      if (item.notes) line += `\n  - Nota: ${item.notes}`;
      return line;
    })
    .join("\n");

  const message = `Hola Mar y Tierra, quiero hacer un pedido a domicilio: 🛵

*Orden:* ${orderId}

👤 *Cliente:* ${customerData.name}
📍 *Dirección:* ${customerData.address} ${customerData.neighborhood ? `(${customerData.neighborhood})` : ""}
💳 *Pago:* ${customerData.paymentMethod}

📝 *Mi Pedido:*
${itemsText}

💰 *Total estimado: ${formatCOP(totalPrice)}*
_(El costo de envío se calculará según la dirección)_`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${adminPhone}?text=${encodedMessage}`;
}
