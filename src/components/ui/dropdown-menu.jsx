import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

const DropdownMenuContext = createContext();

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef(({ asChild, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);
  
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  if (asChild) {
    return React.cloneElement(children, { 
      ref, 
      onClick: handleClick,
      ...props 
    });
  }
  return (
    <button ref={ref} onClick={handleClick} {...props}>
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef(({ 
  className, 
  align = "center", 
  children, 
  ...props 
}, ref) => {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        align === "start" && "left-0",
        align === "center" && "left-1/2 transform -translate-x-1/2",
        align === "end" && "right-0",
        "top-full mt-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(({ 
  className, 
  children, 
  disabled,
  onClick,
  ...props 
}, ref) => {
  const { setIsOpen } = useContext(DropdownMenuContext);
  
  const handleClick = (e) => {
    if (!disabled) {
      if (onClick) {
        onClick(e);
      }
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        !disabled && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
});
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
};
