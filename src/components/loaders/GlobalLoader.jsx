import { useLoading } from '../../contexts/LoadingContext';
import Loader from '../common/Loader';

const GlobalLoader = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return <Loader />;
};

export default GlobalLoader;