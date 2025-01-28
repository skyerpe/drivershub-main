/** @type {import("tailwindcss").Config} */
module.exports = {
    content: [
        "./node_modules/flowbite-react/**/*.js",
        "./components/**/*.{ts,tsx}",
        "./pages/**/*.{ts,tsx}"
    ],
    plugins: [
        require("flowbite/plugin")
    ]
};