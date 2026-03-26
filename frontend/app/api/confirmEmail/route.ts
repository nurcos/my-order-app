import { NextResponse } from "next/server";
import axios from 'axios';
import { pb } from "@/lib/pb";

export async function POST(req: Request) {
	try {
		const {
			order,
			restaurant,
			cart_items
		} = await req.json();

		if (!order) {
			return NextResponse.json(
				{ error: 'Order data is required.' },
				{ status: 400 }
			);
		}

		// Validate restaurant and cart items
		if (!restaurant) {
			return NextResponse.json(
				{ error: 'Restaurant data is required.' },
				{ status: 400 }
			);
		}

		if (!Array.isArray(cart_items) || cart_items.length === 0) {
			return NextResponse.json(
				{ error: 'Cart items are required.' },
				{ status: 400 }
			);
		}

		const apiKey = process.env.SMTP2GO_API_KEY;

		const itemsHtml = (cart_items ?? []).map((item: any) => {
			const cart = cart_items ?? [];
			const idx = cart.indexOf(item);
			const isFirst = idx === 0;
			const isLast = idx === cart.length - 1;

			const row = `<tr>
				<td style="border:1px solid #ddd;padding:8px">${item.name}</td>
				<td style="border:1px solid #ddd;padding:8px;text-align:right">${item.variant.base_price}</td>
			</tr>`;

			return `${isFirst ? `<table style="width:100%;border-collapse:collapse;"><thead><tr><th style="text-align:left;border:1px solid #ddd;padding:8px">Item</th><th style="text-align:right;border:1px solid #ddd;padding:8px">Price</th></tr></thead><tbody>` : ''}${row}${isLast ? '</tbody></table>' : ''}`;
		}).join('');

		const payload = {
			api_key: apiKey,
			to: order.delivery_info?.email,
			sender: 'MyOrder <webmaster@rcwebstudios.co.uk>',
			reply_to: restaurant.email,
			subject: 'Order ID: ' + order.id,
			text_body: 'Order ID: ' + order.id,
			html_body: `
				<h2 style="text-transform:uppercase">Order confirmation — ${order.id}</h2>
				<section>
					<h3>Restaurant</h3>
					<p>${restaurant?.name ?? ''}</p>
					<p>Email: ${restaurant?.email ?? ''}</p>
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
								<td style="padding:8px;border:1px solid #ddd;text-align:right">£${(order.subtotal ?? 0).toFixed(2)}</td>
							</tr>
							<tr>
								<td style="padding:8px;border:1px solid #ddd">Delivery Price</td>
								<td style="padding:8px;border:1px solid #ddd;text-align:right">£${(order.delivery_price ?? 0).toFixed(2)}</td>
							</tr>
							<tr>
								<td style="padding:8px;border:1px solid #ddd;font-weight:bold">Total</td>
								<td style="padding:8px;border:1px solid #ddd;text-align:right;font-weight:bold">£${(((order.subtotal ?? 0) + (order.delivery_price ?? 0))).toFixed(2)}</td>
							</tr>
						</tbody>
					</table>
				</section>
			`
		};

		const res = await axios.post('https://api.smtp2go.com/v3/email/send', payload);

		return NextResponse.json({ success: true }, { status: 200 });

	} catch (error) {
		console.error('Error sending confirmation email:', error);
	}
	return NextResponse.json(
		{ error: 'Error sending confirmation email' },
		{ status: 500 }
	);
}