import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

// Dynamically import the TextEditor component with SSR disabled
const TextEditor = dynamic(() => import('../../src/components/TextEditor'), { ssr: false });

const ContentPage: React.FC = () => {
    const router = useRouter();
    const { contentId } = router.query;

    return (
        <div>
            {contentId && <TextEditor contentId={contentId as string}/>}
        </div>
    );
};

export default ContentPage;