import { useState, useEffect } from 'react';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { db } from './firebase'; 

function useSelect(collectionName, filterColumn = null, filterValue = null) {
    const [data, setData] = useState(null);

    useEffect(() => {
        const collectionRef = ref(db, collectionName);
        let queryRef;

        if (filterColumn && filterValue !== null) {
            queryRef = query(collectionRef, orderByChild(filterColumn), equalTo(filterValue));
        } else {
            queryRef = query(collectionRef);
        }

        get(queryRef)
            .then(snapshot => {
                if (snapshot.exists()) {
                    setData(Object.values(snapshot.val()));
                } else {
                    setData(null);
                }
            })
           
    }, [collectionName, filterColumn, filterValue]);

    return data;
}

export default useSelect;
