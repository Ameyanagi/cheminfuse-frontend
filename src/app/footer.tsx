const footer = (
  <footer className="bottom-0 left-0 z-0 w-full p-4 bg-white border-t border-gray-200 md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
      © 2023{" "}
      <a href="https://cheminfuse.com/" className="hover:underline">
        Cheminfuse
      </a>
      . All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
      <li>
        <a href="/" className="mr-4 hover:underline md:mr-6 ">
          About
        </a>
      </li>
      <li>
        <a href="/tools" className="mr-4 hover:underline md:mr-6">
          Tools
        </a>
      </li>
      <li>
        <a href="/privacy-policy" className="mr-4 hover:underline md:mr-6">
          Privacy Policy
        </a>
      </li>
      <li>
        <a href="/blog" className="mr-4 hover:underline md:mr-6">
          Blog
        </a>
      </li>
      <li>
        <a href="/bontact" className="hover:underline">
          Contact
        </a>
      </li>
    </ul>
  </footer>
);

export default footer;

