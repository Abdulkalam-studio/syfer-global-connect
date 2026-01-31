import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { PremiumNavbar } from '@/components/landing/PremiumNavbar';
import { PremiumFooter } from '@/components/landing/PremiumFooter';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link');
        setIsLoading(false);
        return;
      }

      try {
        // Check token validity
        const { data: tokenData, error: tokenError } = await supabase
          .from('email_verification_tokens')
          .select('*')
          .eq('token', token)
          .eq('used', false)
          .single();

        if (tokenError || !tokenData) {
          setError('This verification link is invalid or has already been used.');
          setIsLoading(false);
          return;
        }

        if (new Date(tokenData.expires_at) < new Date()) {
          setError('This verification link has expired.');
          setIsLoading(false);
          return;
        }

        // Mark profile as verified
        await supabase
          .from('profiles')
          .update({ email_verified: true })
          .eq('user_id', tokenData.user_id);

        // Mark token as used
        await supabase
          .from('email_verification_tokens')
          .update({ used: true })
          .eq('id', tokenData.id);

        setIsVerified(true);
        toast({
          title: 'Email Verified!',
          description: 'Your email has been verified successfully.',
        });
      } catch (err) {
        setError('An error occurred during verification.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, toast]);

  return (
    <div className="min-h-screen bg-navy">
      <PremiumNavbar />
      <div className="min-h-screen flex items-center justify-center pt-20 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 max-w-md w-full mx-4 text-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-display font-bold text-cream mb-2">
                Verifying Your Email...
              </h2>
              <p className="text-muted-foreground">Please wait while we verify your email.</p>
            </>
          ) : isVerified ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-display font-bold text-cream mb-2">
                Email Verified!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your email has been verified successfully. You can now sign in.
              </p>
              <Button onClick={() => navigate('/')} className="premium-button">
                Go to Login
              </Button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-display font-bold text-cream mb-2">
                Verification Failed
              </h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline">
                Go to Home
              </Button>
            </>
          )}
        </motion.div>
      </div>
      <PremiumFooter />
    </div>
  );
};

export default VerifyEmail;
