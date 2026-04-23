import { NextResponse } from "next/server";
import { fetchOrder, fetchRestaurant } from "@/lib/pb-server";

export async function POST(req: Request) {
  const data = await req.json();

  const { order_id, restaurant_id, cart_items } = data;

  if (!order_id) {
    return NextResponse.json(
      { error: "Order ID is required." },
      { status: 400 },
    );
  }

  if (!restaurant_id) {
    return NextResponse.json(
      { error: "Restaurant ID is required." },
      { status: 400 },
    );
  }

  if (!Array.isArray(cart_items) || cart_items.length === 0) {
    return NextResponse.json(
      { error: "Cart items are required." },
      { status: 400 },
    );
  }

  const order = await fetchOrder(order_id);
  const restaurant = await fetchRestaurant(restaurant_id);

  if (!order || !restaurant) {
    return NextResponse.json(
      { error: "Failed to fetch order or restaurant." },
      { status: 500 },
    );
  }

 	const mailCustomerResult = await mailCustomer({ order, restaurant, cart_items });
  const mailRestaurantResult = await mailRestaurant({ order, restaurant, cart_items });

	if (!mailCustomerResult.ok) {
		return NextResponse.json(
			{ error: "Error sending confirmation email to customer" },
			{ status: 500 },
		);
	}

	if (!mailRestaurantResult.ok) {
		return NextResponse.json(
			{ error: "Error sending confirmation email to restaurant" },
			{ status: 500 },
		);
	}

	return NextResponse.json({ success: true });
}

async function mailCustomer(data: any) {
  try {
    const apiKey = process.env.SMTP2GO_API_KEY;

    const itemsHtml = (data.cart_items ?? [])
      .map((item: any) => {
        const cart = data.cart_items ?? [];
        const idx = cart.indexOf(item);
        const isFirst = idx === 0;
        const isLast = idx === cart.length - 1;

        const row = `<tr>
				<td style="border:1px solid #ddd;padding:8px">
					${item.name}</br> ${(item.options ?? [])
          .map((optionType: any) => {
            const optionNames = optionType.option
              ? optionType.option.name
              : Array.isArray(optionType.options)
              ? optionType.options.map((o: any) => o.name).join("</br>")
              : "";
            return `${optionType.name}${optionNames ? ": " + optionNames : ""}`;
          })
          .join(", ")}
				</td>
				<td style="border:1px solid #ddd;padding:8px;text-align:right">£${item.variant.base_price.toFixed(
          2,
        )}</td>
			</tr>`;

        return `${
          isFirst
            ? `<table style="width:100%;border-collapse:collapse;"><thead><tr><th style="text-align:left;border:1px solid #ddd;padding:8px">Item</th><th style="text-align:right;border:1px solid #ddd;padding:8px">Price</th></tr></thead><tbody>`
            : ""
        }${row}${isLast ? "</tbody></table>" : ""}`;
      })
      .join("");

    const payload = {
      api_key: apiKey,
      to: data.order.delivery_info?.email,
      sender: "MyOrder <webmaster@rcwebstudios.co.uk>",
      reply_to: data.restaurant.email,
      subject: "Order ID: " + data.order.id,
      text_body: "Order ID: " + data.order.id,
      html_body: `
				<h2 style="text-transform:uppercase">Order confirmation — ${data.order.id}</h2>
				<section>
					<h3>Restaurant</h3>
					<p>${data.restaurant?.name ?? ""}</p>
				</section>
				<section>
					<h3>Items</h3>
					${itemsHtml}
				</section>
				<section>
					<h3>Totals</h3>
					<table style="width:100%;border-collapse:collapse;">
						<tbody>
							<tr>
								<td style="padding:8px;border:1px solid #ddd">Subtotal</td>
								<td style="padding:8px;border:1px solid #ddd;text-align:right">£${(
                  data.order.subtotal ?? 0
                ).toFixed(2)}</td>
							</tr>
							<tr>
								<td style="padding:8px;border:1px solid #ddd">Delivery Price</td>
								<td style="padding:8px;border:1px solid #ddd;text-align:right">£${(
                  data.order.delivery_price ?? 0
                ).toFixed(2)}</td>
							</tr>
							<tr>
								<td style="padding:8px;border:1px solid #ddd;font-weight:bold">Total</td>
								<td style="padding:8px;border:1px solid #ddd;text-align:right;font-weight:bold">£${(
                  (data.order.subtotal ?? 0) + (data.order.delivery_price ?? 0)
                ).toFixed(2)}</td>
							</tr>
						</tbody>
					</table>
				</section>
			`,
    };

    const res = await fetch(
      "https://api.smtp2go.com/v3/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
		return NextResponse.json(
			{ error: "Error sending confirmation email" },
			{ status: 500 },
		);
  }
}

async function mailRestaurant(data: any) {
  try {
    const apiKey = process.env.SMTP2GO_API_KEY;

    const itemsHtml = (data.cart_items ?? [])
      .map((item: any) => {
        const cart = data.cart_items ?? [];
        const idx = cart.indexOf(item);
        const isFirst = idx === 0;
        const isLast = idx === cart.length - 1;

        const row = `
			<tr>
				<td style="border:1px solid #ddd;padding:8px">
					${item.name} </br> ${(item.options ?? [])
          .map((optionType: any) => {
            const optionNames = optionType.option
              ? optionType.option.name
              : Array.isArray(optionType.options)
              ? optionType.options.map((o: any) => o.name).join("</br>")
              : "";
            return `${optionType.name}${optionNames ? ": " + optionNames : ""}`;
          })
          .join(", ")}
				</td>
				<td style="border:1px solid #ddd;padding:8px;text-align:right">£${item.variant.base_price.toFixed(
          2,
        )}</td>
			</tr>
		`;

        return `${
          isFirst
            ? `<table style="width:100%;border-collapse:collapse;"><thead><tr><th style="text-align:left;border:1px solid #ddd;padding:8px">Item</th><th style="text-align:right;border:1px solid #ddd;padding:8px">Price</th></tr></thead><tbody>`
            : ""
        }${row}${isLast ? "</tbody></table>" : ""}`;
      })
      .join("");

    const payload = {
      api_key: apiKey,
      to: data.restaurant.email,
      sender: "MyOrder <webmaster@rcwebstudios.co.uk>",
      reply_to: data.order.delivery_info?.email,
      subject: "New Order Received: " + data.order.id,
      text_body: "New Order Received: " + data.order.id,
      html_body: `
				<h2 style="text-transform:uppercase">New Order Received — ${data.order.id}</h2>
				<section>
					<h3>Customer</h3>
					<p>Name: ${data.order.delivery_info?.firstName ?? ""} ${
        data.order.delivery_info?.lastName ?? ""
      }</p>
					<p>Email: ${data.order.delivery_info?.email ?? ""}</p>
					<p>Phone: ${data.order.delivery_info?.phone ?? ""}</p>
					<p>Address: ${data.order.delivery_info?.address ?? ""}, ${
        data.order.delivery_info?.address2 ?? ""
      }, ${data.order.delivery_info?.address3 ?? ""}, ${
        data.order.delivery_info?.postCode ?? ""
      }</p>
					<p>City: ${data.order.delivery_info?.city ?? ""}</p>

				</section>
				<section>
					<h3>Items</h3>
					${itemsHtml}
				</section>
				<section>
					<h3>Totals</h3>
					<table style="width:100%;border-collapse:collapse;">
						<tbody>
							<tr>
								<td style="padding:8px;border:1px solid #ddd">Subtotal</td>
								<td style="padding:8px;border:1px solid #ddd;text-align:right">£${(
                  data.order.subtotal ?? 0
                ).toFixed(2)}</td>
							</tr>
							<tr>
								<td style="padding:8px;border:1px solid #ddd">Delivery Price</td>
								<td style="padding:8px;border:1px solid #ddd;text-align:right">£${(
                  data.order.delivery_price ?? 0
                ).toFixed(2)}</td>
							</tr>
							<tr>
								<td style="padding:8px;border:1px solid #ddd;font-weight:bold">Total</td>
								<td style="padding:8px;border:1px solid #ddd;text-align:right;font-weight:bold">£${(
                  (data.order.subtotal ?? 0) + (data.order.delivery_price ?? 0)
                ).toFixed(2)}</td>
							</tr>
						</tbody>
					</table>
				</section>
			`,
    };

    const res = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
		return NextResponse.json(
			{ error: "Error sending confirmation email" },
			{ status: 500 },
		);
  }
}
