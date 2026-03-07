import { useReducer, useEffect } from 'react';

const vacationsReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null,
                vacations: action.payload,
            };
        case 'FETCH_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

/**
 * Custom Hook sebagai ViewModel untuk mengambil data percutian.
 * Centralizes data fetching logic, loading states, and error handling using useReducer.
 */
export const useVacations = (island, category) => {
    const [state, dispatch] = useReducer(vacationsReducer, {
        vacations: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;
        const fetchVacations = async () => {
            dispatch({ type: 'FETCH_INIT' });
            try {
                let url = '/api/v1/vacations';
                const params = new URLSearchParams();
                if (island) params.append('island', island);
                if (category) params.append('category', category);

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();

                if (isMounted) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: data });
                }
            } catch (err) {
                if (isMounted) {
                    console.error("useVacations Error:", err);
                    dispatch({ type: 'FETCH_FAILURE', payload: err.message });
                }
            }
        };

        fetchVacations();

        return () => {
            isMounted = false;
        };
    }, [island, category]);

    return { vacations: state.vacations, loading: state.loading, error: state.error };
};
