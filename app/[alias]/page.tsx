import { redirect } from 'next/navigation';
import getCollection, { POSTS_COLLECTION } from '@/db';

export async function generateMetadata({
  params,
}: {
  params: { alias: string };
}) {
  try {
    const collection = await getCollection(POSTS_COLLECTION);
    const result = await collection.findOne({ alias: params.alias });

    if (!result) {
      redirect('/');
    }

    redirect(result.url);
  } catch (err) {
    console.error('Redirect error:', err);
    redirect('/');
  }
}

// Required export, renders nothing
export default function AliasPage() {
  return null;
}
