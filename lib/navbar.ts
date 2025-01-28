export const toggleNavbar = () => {
    const drawer = document.getElementById("drawer-navigation")!;
    const button = document.getElementById("drawer-opener")!;
    const icon = document.getElementById("opener-icon")!;

    drawer.classList.toggle("-translate-x-full");
    button.classList.toggle("translate-x-80");
    icon.classList.toggle("rotate-180");
};

export const closeNavbar = () => {
    const drawer = document.getElementById("drawer-navigation")!;
    const button = document.getElementById("drawer-opener")!;
    const icon = document.getElementById("opener-icon")!;

    drawer.classList.add("-translate-x-full");
    button.classList.remove("translate-x-80");
    icon.classList.remove("rotate-180");
};

export const openNavbar = () => {
    const drawer = document.getElementById("drawer-navigation")!;
    const button = document.getElementById("drawer-opener")!;
    const icon = document.getElementById("opener-icon")!;

    drawer.classList.remove("-translate-x-full");
    button.classList.add("translate-x-80");
    icon.classList.add("rotate-180");
};