
import { useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/components/AuthPage';
import { EnhancedUserProfile } from '@/components/EnhancedUserProfile';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen pb-20">
      <EnhancedUserProfile />
      <BottomNavigation onPlanClass={() => navigate('/plan')} />
    </div>
  );
};

export default Profile;
