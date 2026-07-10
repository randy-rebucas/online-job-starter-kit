const PAYMONGO_API = "https://api.paymongo.com/v1";

function authHeader() {
  const key = process.env.PAYMONGO_SECRET_KEY;
  if (!key) throw new Error("PAYMONGO_SECRET_KEY is not configured.");
  return "Basic " + Buffer.from(`${key}:`).toString("base64");
}

async function paymongoFetch(path, options = {}) {
  const res = await fetch(`${PAYMONGO_API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = body?.errors?.[0]?.detail || `PayMongo request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

// amountPhp is whole pesos (e.g. 499) — PayMongo amounts are in centavos.
export async function createCheckoutSession({ reference, amountPhp, successUrl, cancelUrl, email }) {
  const body = await paymongoFetch("/checkout_sessions", {
    method: "POST",
    body: JSON.stringify({
      data: {
        attributes: {
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          description: "Online Job Starter Kit — full PDF download",
          reference_number: reference,
          success_url: successUrl,
          cancel_url: cancelUrl,
          billing: email ? { email } : undefined,
          line_items: [
            {
              currency: "PHP",
              amount: Math.round(amountPhp * 100),
              name: "Online Job Starter Kit (PDF)",
              quantity: 1,
            },
          ],
          payment_method_types: ["card", "gcash", "paymaya"],
        },
      },
    }),
  });

  return {
    id: body.data.id,
    checkoutUrl: body.data.attributes.checkout_url,
  };
}

export async function retrieveCheckoutSession(checkoutSessionId) {
  const body = await paymongoFetch(`/checkout_sessions/${checkoutSessionId}`, { method: "GET" });
  const attrs = body.data.attributes;
  const payments = attrs.payments || [];
  const paid = payments.some((p) => p.attributes?.status === "paid");
  return { id: body.data.id, paid, payments, raw: attrs };
}
