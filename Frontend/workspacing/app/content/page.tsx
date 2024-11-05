"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { v4 as uuidV4 } from 'uuid';

const ContentPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Generate a new contentId and redirect to `/content/[contentId]`
        const newContentId = uuidV4();
        router.replace(`/content/${newContentId}`);
    }, [router]);

    // Optionally, render a loading state while redirecting
    return <div>Loading...</div>;
};

export default ContentPage;
