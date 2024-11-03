import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { name, surname, phone, dni, hasAccess, expirationDate, remainingDays } = await request.json();

    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                surname,
                phone,
                dni,
                hasAccess,
                expirationDate: new Date(expirationDate),
                remainingDays,
            },
        });
        return NextResponse.json(newUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const { id, name, surname, phone, dni, hasAccess, expirationDate, remainingDays } = await request.json();

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                surname,
                phone,
                dni,
                hasAccess,
                expirationDate: new Date(expirationDate),
                remainingDays,
            },
        });
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { id } = await request.json();

    try {
        await prisma.user.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
    }
}
