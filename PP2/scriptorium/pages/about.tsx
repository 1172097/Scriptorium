import React from "react";

const About: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)] pt-20 px-4 md:px-0">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
        About Scriptorium
      </h1>
      <p className="text-base md:text-lg text-center max-w-3xl">
        Scriptorium is an innovative online platform where you can write, execute, and share code in multiple programming languages. Inspired by the ancient concept of a scriptorium, a place where manuscripts were crafted and preserved, Scriptorium modernizes this idea for the digital age. It offers a secure environment for geeks, nerds, and coding enthusiasts to experiment, refine, and save their work as reusable templates. Whether you’re testing a quick snippet or building a reusable code example, Scriptorium is what you need to bring your ideas to life.
      </p>
    </div>
  );
};

export default About;
