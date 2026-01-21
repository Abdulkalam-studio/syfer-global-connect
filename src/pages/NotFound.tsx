import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <span className="text-9xl font-bold text-gold">404</span>
        </motion.div>
        
        <h1 className="text-3xl font-display font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="gold">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link to="/products">
              <Search className="w-4 h-4 mr-2" />
              Browse Products
            </Link>
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground">
            Need help? <Link to="/contact" className="text-gold hover:underline">Contact our support team</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
