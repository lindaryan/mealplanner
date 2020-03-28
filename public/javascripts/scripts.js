// https://www.w3schools.com/howto/howto_js_navbar_sticky.asp


window.onload = () => {
    // back to top button
    const backToTopButton = document.getElementById('toTopBtn');
    // Window width
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    // Window Height
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // Page Header Element
    const pageHeader = document.querySelector('.header');
    // Page Header Height
    const pageHeaderHeight = pageHeader.innerHeight || pageHeader.clientHeight
    // dim the btn
    const dimBackToTopButton = () => {
        backToTopButton.style.opacity='0.5';
    }
    // brighten the btn
    const resetBackToTopButton = () => {
        backToTopButton.style.opacity='1.0';
    }
    // smooth scroll to item
    const scrollIt = (element) => {
        window.scrollTo({
            'behavior': 'smooth',
            'left': 0,
            'top': element.offsetTop
        });
    }
    // scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            'behavior': 'smooth',
            'left': 0,
            'top': 0
        });
    }
    // check the scroll offset distance
    const testScroll = (ev) => {
        if(window.pageYOffset>pageHeaderHeight) {
            resetBackToTopButton();
        } else {
            dimBackToTopButton();
        }
    }
    // check scroll distance to the window's scroll event
    window.onscroll=testScroll
    // dim the btn
    dimBackToTopButton();
    // call on click
    backToTopButton.addEventListener('click', scrollToTop);
};







