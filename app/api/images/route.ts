import { NextRequest, NextResponse } from 'next/server';
import { getImageUrl, searchImages } from '@/lib/bing-image-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const count = parseInt(searchParams.get('count') || '1');
    const type = searchParams.get('type') || 'single'; // 'single' or 'multiple'
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    if (type === 'single') {
      // Get single image URL for placeholder
      const imageUrl = await getImageUrl(query);
      return NextResponse.json({ imageUrl });
    } else {
      // Get multiple images for selection
      const images = await searchImages(query, count);
      return NextResponse.json({ images });
    }

  } catch (error) {
    console.error('Image search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search images' },
      { status: 500 }
    );
  }
}

// Handle POST requests for batch image searches
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { queries } = body;

    if (!Array.isArray(queries)) {
      return NextResponse.json(
        { error: 'Queries must be an array' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      queries.map(async (query: string) => ({
        query,
        imageUrl: await getImageUrl(query)
      }))
    );

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Batch image search error:', error);
    return NextResponse.json(
      { error: 'Failed to process batch search' },
      { status: 500 }
    );
  }
} 