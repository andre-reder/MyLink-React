import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'framer-motion';

export default function OpacityAnimation({ children, delay }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay, type: 'tween', stiffness: 10000 }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

OpacityAnimation.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
};

OpacityAnimation.defaultProps = {
  delay: 0.3,
};
