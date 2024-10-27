import { UUID } from 'mongodb';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {v4 as uuidV4} from 'uuid';

const TextEditor = dynamic(() => import('../../src/components/TextEditor'), { ssr: false });

const HomePage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            router.push(`/content/${uuidV4()}`); // Redirect to a default content ID if none is provided
        }
    }, [id, router]);

    return (
        <div>
            {id && <TextEditor />}
        </div>
    );
};

export default HomePage;
