import { OrderWithItems } from "@/types/order"

export function openInvoiceHtml(order: OrderWithItems) {
  const { id, createdAt, tableNumber, paymentMethod, totalPrice, items } = order

  const date = new Date(createdAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  const rows = items.map(i => `
    <tr>
      <td>${i.nameSnapshot}</td>
      <td>${i.quantity}</td>
      <td style="text-align:right">Rp. ${(i.priceSnapshot * i.quantity).toLocaleString("id-ID")}</td>
    </tr>
  `).join("")

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Invoice - Salira Resto</title>
  <style>
    body { font-family: sans-serif; padding: 24px; background: #fff; }
    .invoice { max-width: 480px; margin: 0 auto; }
    h1, h2 { text-align: center; margin: 0; }
    .info, .total, .footer { margin-top: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 6px 8px; border-bottom: 1px solid #ddd; }
    th { text-align: left; }
    .total { font-weight: bold; text-align: right; margin-top: 16px; }
    .footer { text-align: center; margin-top: 32px; font-size: 0.9rem; color: #555; }
  </style>
</head>
<body>
  <div class="invoice">
    <h1>Salira Resto</h1>
    <h2>Invoice</h2>

    <div class="info">
      <p>No. Order: <strong>#${id}</strong></p>
      <p>Tanggal: <strong>${date}</strong></p>
      <p>Meja: <strong>${tableNumber}</strong></p>
      <p>Pembayaran: <strong>${paymentMethod.toUpperCase()}</strong></p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th style="text-align:right">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <div class="total">Total: Rp. ${totalPrice.toLocaleString("id-ID")}</div>

    <div class="footer">Terima kasih telah berkunjung ke Salira Resto!</div>
  </div>
</body>
</html>
  `

  const win = window.open()
  if (win) {
    win.document.write(html)
    win.document.close()
  } else {
    alert("Popup blocked. Please allow popups for this site.")
  }
}
