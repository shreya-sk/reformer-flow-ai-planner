
import { useLocation, useNavigate } from 'react-router-dom';
import { ClassTeachingMode } from '@/components/ClassTeachingMode';
import { ClassPlan } from '@/types/reformer';

const Teaching = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classPlan = location.state?.classPlan as ClassPlan;

  if (!classPlan) {
    navigate('/');
    return null;
  }

  return (
    <ClassTeachingMode
      classPlan={classPlan}
      onClose={() => navigate('/')}
    />
  );
};

export default Teaching;
