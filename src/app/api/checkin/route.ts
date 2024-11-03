import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const { dni } = await request.json();

    try {
        const user = await prisma.user.findUnique({
            where: { dni },
        });

        if (!user) {
            return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
        }

        const remainingDays = user.remainingDays;
        if (remainingDays <= 0) {
            return NextResponse.json({ message: 'Fecha de vencimiento alcanzada, pasar por Recepcion.' }, { status: 403 });
        }

        await prisma.checkIn.create({
            data: {
                userId: user.id,
            },
        });

        return NextResponse.json({ message: 'Check-in Realizado exitosamente.' }, { status: 200 });
    } catch (error) {
        console.error('Error al registrar el check-in:', error);
        return NextResponse.json({ message: 'Error al realizar el check-in.' }, { status: 500 });
    }
}
