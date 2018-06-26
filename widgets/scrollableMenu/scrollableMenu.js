var ScrollableMenu = /** @class */ (function () {
    function ScrollableMenu(widget) {
        this.widget = widget;
        this.topBaseline = 0;
        this.standardMenuItemHeight = 40;
        this.elements = {
            container: HTMLElement,
            navItems: []
        };
        this.states = {
            currentIndex: 0
        };
        if (this.widget === null) {
            return;
        }
        this.elements.container = this.widget;
        this.elements.navItems = this.widget.querySelectorAll("a");
        this.addEvents();
    }
    /**
    * Add necessary event handlers on elements
    **/
    ScrollableMenu.prototype.addEvents = function () {
        this.clickHandler();
        this.scrollHandler();
    };
    ScrollableMenu.prototype.clickHandler = function () {
        var _loop_1 = function (i) {
            var item = this_1.elements.navItems[i];
            console.log("item: ", item);
            // click on anchor link
            item.addEventListener("click", function (e) {
                e.preventDefault();
                var href = item.getAttribute("href");
                if (href === "") {
                    return;
                }
                // this.scrollToElement(href);
            });
        };
        var this_1 = this;
        // click event
        for (var i = 0; i < this.elements.navItems.length; i++) {
            _loop_1(i);
        }
    };
    /**
    * Add logic for scroll event
    **/
    ScrollableMenu.prototype.scrollHandler = function () {
        var _this = this;
        document.addEventListener("scroll", function (e) {
            var navTargets = _this.getNavTargets();
            for (var i = 0; i < navTargets.length; i++) {
                var target = navTargets[i];
                var breakpoint = _this.getMenuItemHeight(i) + _this.getTopBaseline();
                console.log(" breakpoint: ", breakpoint);
                if (target.positionTop >= 0 && target.positionTop <= breakpoint) {
                    console.log("matched: ", target, i, " breakpoint: ", breakpoint);
                    _this.setCurrentMenu(i);
                    break;
                }
            }
        });
    };
    ScrollableMenu.prototype.setCurrentMenu = function (index) {
        console.log("Setting current menu ", index);
        if (index < 0 || index >= this.elements.navItems.length) {
            return;
        }
        this.clearMenu();
        this.states.currentIndex = index;
        this.elements.navItems[index].classList.add("active");
    };
    ScrollableMenu.prototype.getMenuItemHeight = function (index) {
        if (index < 0 || index >= this.elements.navItems.length) {
            return;
        }
        return (index === 0) ? this.standardMenuItemHeight : this.elements.navItems[index].offsetHeight * index;
    };
    ScrollableMenu.prototype.getTopBaseline = function () {
        return this.topBaseline;
    };
    ScrollableMenu.prototype.clearMenu = function () {
        for (var i = 0; i < this.elements.navItems.length; i++) {
            var navItem = this.elements.navItems[i];
            navItem.classList.remove("active");
        }
    };
    ScrollableMenu.prototype.scrollToElement = function (href) {
        var _this = this;
        var element = document.querySelector(href);
        if (element === null) {
            return;
        }
        window.requestAnimationFrame(function () {
            var scrollTop = element.getBoundingClientRect().top;
            _this.updateScroll(window.scrollY + scrollTop);
        });
    };
    ScrollableMenu.prototype.updateScroll = function (scrollTop) {
        var _this = this;
        var scrollDistance = window.scrollY + 5;
        console.log("rAF: ", scrollTop, scrollDistance);
        window.scrollTo(0, scrollDistance);
        if (scrollDistance < scrollTop) {
            console.log("rAF1: ", scrollTop, scrollDistance);
            return;
        }
        window.requestAnimationFrame(function () { return _this.updateScroll(scrollTop); });
    };
    ScrollableMenu.prototype.getNavItemsPositions = function () {
        var navItemsPositions = [];
        for (var i = 0; i < this.elements.navItems.length; i++) {
            var navItem = this.elements.navItems[i];
            navItemsPositions.push({
                index: i,
                positionTop: navItem.getBoundingClientRect().top
            });
        }
        return navItemsPositions;
    };
    ScrollableMenu.prototype.getNavTargets = function () {
        var navTargets = [];
        for (var i = 0; i < this.elements.navItems.length; i++) {
            var targetID = this.elements.navItems[i].getAttribute("href");
            var targetElement = document.querySelector(targetID);
            if (targetElement !== null) {
                navTargets.push({
                    id: targetID,
                    positionTop: targetElement.getBoundingClientRect().top
                });
            }
        }
        return navTargets;
    };
    return ScrollableMenu;
}());
var widgets = document.querySelectorAll(".sidebar");
for (var i = 0; i < widgets.length; i++) {
    new ScrollableMenu(widgets[i]);
}
