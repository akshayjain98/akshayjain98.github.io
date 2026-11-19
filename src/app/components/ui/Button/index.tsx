import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";

type ButtonVariant = "contained" | "outline";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "contained",
  className = "",
  children,
  ...rest
}) => {
  const variants = {
    contained: "btn-apple",
    outline: "btn-apple-outline",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${variants[variant]} ${className} w-fit`}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export default Button;
