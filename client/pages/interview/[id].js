import {useRouter} from 'next/router';

export default function Interview() {
    const router = useRouter();
    const {id} = router.query;

    return <div id="interview">
        {id}
    </div>
}