import { useMediaQuery } from 'react-responsive';

const useIsLargeScreen = () => {
    return useMediaQuery({ query: '(min-width: 1025px)' });
};

export default useIsLargeScreen;
