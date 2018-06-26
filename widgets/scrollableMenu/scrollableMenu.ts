class ScrollableMenu {
    private topBaseline: number = 0;
    private standardMenuItemHeight: number = 40;
    private elements = {
        container: HTMLElement,
        navItems: []
    };
    private states = {
        currentIndex: 0
    };

    constructor(private widget) {
        if(this.widget === null) {
            return;
        }
        this.elements.container = this.widget;
        this.elements.navItems = this.widget.querySelectorAll("a");
        this.addEvents();
    }

    /**
    * Add necessary event handlers on elements
    **/
    private addEvents(): void {
        this.clickHandler();
        this.scrollHandler();
    }

    private clickHandler(): void {
        // click event
        for(let i = 0; i < this.elements.navItems.length; i++) {
            const item = this.elements.navItems[i];
            console.log("item: ", item);
            // click on anchor link
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const href = item.getAttribute("href");
                if(href === "") {
                    return;
                }
                // this.scrollToElement(href);
            });
        }
    }

    /**
    * Add logic for scroll event
    **/
    private scrollHandler(): void {
        document.addEventListener("scroll", (e) => {
            const navTargets = this.getNavTargets();

            for(let i = 0 ; i < navTargets.length; i++) {
                const target = navTargets[i];
                const breakpoint = this.getMenuItemHeight(i) + this.getTopBaseline();
                console.log(" breakpoint: ", breakpoint);
                if(target.positionTop >=0 && target.positionTop <= breakpoint) {
                    console.log("matched: ", target, i, " breakpoint: ", breakpoint);
                    this.setCurrentMenu(i);
                    break;
                }
            }
        });
    }

    private setCurrentMenu(index: number): void {
    console.log("Setting current menu ", index);
        if(index < 0 || index >= this.elements.navItems.length) {
            return;
        }

        this.clearMenu();
        this.states.currentIndex = index;
        this.elements.navItems[index].classList.add("active");
    }

    private getMenuItemHeight(index: number): number {
        if(index < 0 || index >= this.elements.navItems.length) {
                    return;
        }
        return (index === 0) ? this.standardMenuItemHeight: this.elements.navItems[index].offsetHeight * index;
    }

    private getTopBaseline(): number {
        return this.topBaseline;
    }


    private clearMenu(): void {
        for(let i = 0; i < this.elements.navItems.length; i++) {
            const navItem = this.elements.navItems[i];
            navItem.classList.remove("active");
        }
    }

    private scrollToElement(href: string): void {

        const element = document.querySelector(href);
        if (element === null) {
            return;
        }

        window.requestAnimationFrame(() => {
            const scrollTop = element.getBoundingClientRect().top;
            this.updateScroll(window.scrollY + scrollTop);
        });
    }

    private updateScroll(scrollTop: number): void {

        const scrollDistance = window.scrollY + 5;
        console.log("rAF: ", scrollTop, scrollDistance);
        window.scrollTo(0, scrollDistance);

        if(scrollDistance < scrollTop) {
         console.log("rAF1: ", scrollTop, scrollDistance);
            return;
        }
        window.requestAnimationFrame(() => this.updateScroll(scrollTop));
    }

    private getNavItemsPositions() {
        let navItemsPositions = [];
        for(let i = 0 ; i < this.elements.navItems.length; i++) {
            const navItem = this.elements.navItems[i];
            navItemsPositions.push({
                index: i,
                positionTop: navItem.getBoundingClientRect().top
            });
        }
        return navItemsPositions;
    }

    private getNavTargets() {
        let navTargets = [];
        for(let i = 0 ; i < this.elements.navItems.length; i++) {
            const targetID= this.elements.navItems[i].getAttribute("href");
            const targetElement = document.querySelector(targetID);

            if(targetElement !== null) {
                navTargets.push({
                    id: targetID,
                    positionTop: targetElement.getBoundingClientRect().top
                });
            }

        }
        return navTargets;
    }
}

const widgets = document.querySelectorAll(".sidebar");

for (let i = 0; i < widgets.length; i++) {
    new ScrollableMenu(widgets[i]);
}