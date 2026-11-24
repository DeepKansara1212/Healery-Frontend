import React, { useRef, useEffect, forwardRef } from "react";

// A minimal, dependency-free carousel that matches the API expected by Testimonials.jsx
// Props used by Testimonials.jsx: opts (align, loop, skipSnaps, dragFree), className

export const Carousel = forwardRef(function Carousel({ children, className = "", opts = {}, id }, ref) {
  const localRef = useRef(null);
  useEffect(() => {
    const container = (ref && typeof ref !== "function" ? ref?.current : null) || localRef.current;
    if (!container) return;
    container.setAttribute("data-carousel", "");
  }, [ref]);
  return (
    <div ref={ref || localRef} className={className} data-carousel id={id}>
      {children}
    </div>
  );
});

export const CarouselContent = ({ children, className = "" }) => {
  const scrollerRef = useRef(null);
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        ref={scrollerRef}
        className="flex gap-2 md:gap-4 scroll-smooth snap-x snap-mandatory"
        data-carousel-scroller
      >
        {children}
      </div>
    </div>
  );
};

export const CarouselItem = ({ children, className = "", ...props }) => {
  return (
    <div className={`shrink-0 snap-start ${className}`} {...props}>
      {children}
    </div>
  );
};

const findScroller = (root) => {
  if (!root) return null;
  return root.querySelector("[data-carousel-scroller]");
};

export const CarouselPrevious = ({ className = "", target, ...props }) => {
  const rootRef = useRef(null);
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.setAttribute("data-carousel-prev", "");
    }
  }, []);
  const onClick = (e) => {
    const carouselRoot = target ? document.querySelector(target) : e.currentTarget.closest("[data-carousel]");
    const scroller = findScroller(carouselRoot);
    if (scroller) scroller.scrollBy({ left: -scroller.clientWidth, behavior: "smooth" });
  };
  return (
    <button ref={rootRef} className={className} onClick={onClick} {...props} />
  );
};

export const CarouselNext = ({ className = "", target, ...props }) => {
  const rootRef = useRef(null);
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.setAttribute("data-carousel-next", "");
    }
  }, []);
  const onClick = (e) => {
    const carouselRoot = target ? document.querySelector(target) : e.currentTarget.closest("[data-carousel]");
    const scroller = findScroller(carouselRoot);
    if (scroller) scroller.scrollBy({ left: scroller.clientWidth, behavior: "smooth" });
  };
  return (
    <button ref={rootRef} className={className} onClick={onClick} {...props} />
  );
};

export default Carousel;


