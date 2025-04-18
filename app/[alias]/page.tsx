import { redirect } from 'next/navigation';
import getCollection, { POSTS_COLLECTION } from '@/db';

// This triggers redirect on server before rendering
export async function generateMetadata({ params }: { params: { alias: string } }) {
    const { alias } = params;

    try {
        const collection = await getCollection(POSTS_COLLECTION);
        const result = await collection.findOne({ alias });

        if (!result) {
            redirect('/');
        }

        redirect(result.url);
    } catch (err) {
        console.error('Redirect error:', err);
        redirect('/');
    }
}

// Required export (though not used)
export default function EmptyPage() {
    return null;
}
