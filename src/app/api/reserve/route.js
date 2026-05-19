import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    if (!date || !time) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('id')
            .eq('date', date)
            .eq('time', time)
            .maybeSingle();

        if (error) throw error;
        return NextResponse.json({ available: !data });
    } catch (error) {
        console.error("Supabase Check Error:", error);
        return NextResponse.json({ available: true });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        // Basic Validation
        const { fullName, phone, date, time, address } = data;
        if (!fullName || !fullName.trim() || !phone || !phone.trim() || !date || !time || !address) {
            return NextResponse.json({ error: "missingFields" }, { status: 400 });
        }

        // Date/Time Validation (Future only + 3h buffer)
        const reservationDate = new Date(`${date}T${time}`);
        const now = new Date();
        const bufferTime = 3 * 60 * 60 * 1000;

        if (reservationDate < now) {
            return NextResponse.json({ error: "errorPastDate" }, { status: 400 });
        }

        if (reservationDate < new Date(now.getTime() + bufferTime)) {
            return NextResponse.json({ error: "errorLeadTime" }, { status: 400 });
        }

        // Conflict Check (Server-side)
        const { data: conflict, error: checkError } = await supabase
            .from('bookings')
            .select('id')
            .eq('date', date)
            .eq('time', time)
            .maybeSingle();

        if (checkError) throw checkError;
        if (conflict) {
            return NextResponse.json({ error: "alreadyBooked" }, { status: 409 });
        }

        // 1. Save to Supabase first
        const { error: insertError } = await supabase
            .from('bookings')
            .insert([{
                full_name: fullName,
                phone: phone,
                email: data.email || null,
                trip_type: data.tripType,
                airport: data.airport,
                address: address,
                passengers: parseInt(data.passengers),
                luggage: parseInt(data.luggage),
                message: data.message || null,
                date: date,
                time: time
            }]);

        if (insertError) throw insertError;

        // 2. Telegram Notification
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        const telegramMessage = `
🚖 *Nouvelle Réservation KA Taxi*

👤 *Client:* ${fullName}
📞 *Tél:* ${phone}
📧 *Email:* ${data.email || 'N/A'}

📍 *Détails du Trajet:*
- *Type:* ${data.tripType}
- *Aéroport:* ${data.airport}
- *Date:* ${date}
- *Heure:* ${time}
- *Adresse:* ${address}

👥 *Passagers:* ${data.passengers}
🧳 *Bagages:* ${data.luggage}

💬 *Message:* 
${data.message || 'Aucun message.'}
        `;

        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        try {
            await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'Markdown',
                }),
            });
        } catch (botError) {
            console.error("Telegram notification failed (Non-blocking):", botError);
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error("Reservation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
