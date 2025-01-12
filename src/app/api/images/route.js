import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const newImage = await prisma.image.create({
      data: { url },
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error processing request:', error);

    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const images = await prisma.image.findMany();
    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error('Error fetching images:', error);

    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
