<!-- src/lib/Navbar.svelte -->
<nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between px-6 py-4 mx-auto">
    <a href="/" class="flex items-center space-x-2">
      <img class="w-8" src="./logo.svg" alt="News Logo" />
      <span class="text-2xl font-semibold text-gray-900 dark:text-white">News Factory</span>
    </a>
    <!-- Mobile menu button (optional, uncomment if needed) -->
    <!--
    <button
      data-collapse-toggle="navbar-default"
      type="button"
      class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      aria-controls="navbar-default"
      aria-expanded="false"
    >
      <span class="sr-only">Open main menu</span>
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
      </svg>
    </button>
    -->
    <div class="hidden w-full md:flex md:w-auto px-4" id="navbar-default">
      <ul class="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
        <!-- Connect Wallet Block -->
        <li>
          <a href="./connect-wallet" class="block py-2 px-4 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200">
            Connect Wallet
          </a>
        </li>
        <!-- Dashboard Block -->
        <li>
          <a href="/dashboard" class="block py-2 px-4 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200">
            Dashboard
          </a>
        </li>
        <!-- About Us Block -->
        <li>
          <a href="/about-us" class="block py-2 px-4 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200">
            About Us
          </a>
        </li>
        <!-- Contact Us Block -->
        <li>
          <a href="/contact" class="block py-2 px-4 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200">
            Contact Us
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav>
