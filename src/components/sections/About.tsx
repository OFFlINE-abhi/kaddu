export default function About() {
  return (
    <section
      id="about"
      className="px-6 py-12 bg-gray-100 dark:bg-gray-900 transition-colors duration-500"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          🙋‍♂️ About Me
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          I'm a passionate{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Web Developer
          </span>{" "}
          and a{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Nautical Science
          </span>{" "}
          student. I love crafting interactive web experiences and exploring new technologies.
        </p>
      </div>
    </section>
  );
}
