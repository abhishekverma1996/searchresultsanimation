import { motion } from "framer-motion";

const SkeletonLoader = ({ count = 3 }) => {
  const skeletonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      variants={skeletonVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-6">
            {/* Skeleton Image */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-white/20 animate-pulse"></div>
            </div>
            
            <div className="flex-1 space-y-3">
              {/* Skeleton Title */}
              <div className="h-6 bg-white/20 rounded-lg animate-pulse"></div>
              {/* Skeleton Subtitle */}
              <div className="h-4 bg-white/15 rounded-lg animate-pulse w-3/4"></div>
            </div>
            
            {/* Skeleton Icon */}
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SkeletonLoader;
