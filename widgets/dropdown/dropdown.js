var Dropdown = /** @class */ (function () {
    function Dropdown(widget) {
        this.widget = widget;
        this.elements = {};
        this.search = "";
        this.searchRegex = /([a-zA-Z]+)/i;
        this.searchInterval = 0;
        this.activateSearch = true;
        if (this.widget === null) {
            return;
        }
        this.init();
    }
    Dropdown.prototype.init = function () {
        this.elements.container = this.widget;
        this.elements.selectedElement = this.widget.querySelector("div:first-child");
        this.elements.options = this.widget.querySelector(".options");
        this.elements.optionArray = this.widget.querySelectorAll(".option");
        this.elements.currentOptionIndex = -1;
        this.elements.tabElements = document.body.querySelectorAll("[tab-index]");
        this.elements.currentFocused = -1;
        this.indexOptions();
        this.addEventHandlers();
        this.exposeApis();
    };
    /**
    * Attach methods on the dropdown DOM element so that it can be used by other
    * components of a page.
    */
    Dropdown.prototype.exposeApis = function () {
        var _this = this;
        this.widget.toggleDropdown = function () { _this.toggleDropdown(); };
    };
    Dropdown.prototype.addEventHandlers = function () {
        this.keyOptions();
        this.mouseOptions();
        this.tabFocusOptions();
        this.addOpitonSelectedEvent();
    };
    Dropdown.prototype.addOpitonSelectedEvent = function () {
        this.onSelectedEvent = new Event("onSelected");
        this.elements.container.addEventListener("onSelected", function (e) {
            console.log("Added custom dropdown event");
        });
    };
    Dropdown.prototype.keyOptions = function () {
        var _this = this;
        document.body.addEventListener("keydown", function (e) {
            if (!_this.elements.container.classList.contains("focused")) {
                return;
            }
            // logic for tab keys
            var keyCode = e.keyCode;
            switch (keyCode) {
                case 9:
                    // focus next tabable element
                    // this.focusNext();
                    break;
                case 37:
                // left arrow key
                case 38:
                    // up arrow
                    _this.highlightPreviousOption();
                    e.preventDefault();
                    break;
                case 39:
                // right arrow
                case 40:
                    // down arrow
                    _this.highlightNextOption();
                    e.preventDefault();
                    break;
                case 13:
                    // enter key
                    _this.setSelectedOption();
                    break;
                case 32:
                    // space key
                    _this.toggleDropdown();
                    e.preventDefault();
                    break;
                case 27:
                    // esc key
                    _this.closeDropdown();
                    break;
                default:
                    // for shift tab key
                    if (e.shiftKey && keyCode === 9) {
                        // focus previous tabable element
                        // this.focusPrevious();
                    }
                    if (_this.searchRegex.test(e.key)) {
                        _this.search += e.key;
                        _this.highlightSearch();
                        _this.activateSearch = false;
                    }
            }
        });
    };
    Dropdown.prototype.highlightSearch = function () {
        var _this = this;
        if (!this.activateSearch) {
            return;
        }
        this.searchInterval = window.setTimeout(function () {
            _this.matchOption();
            window.clearTimeout(_this.searchInterval);
            _this.search = "";
            _this.activateSearch = true;
        }, 500);
    };
    Dropdown.prototype.matchOption = function () {
        for (var i = 0; i < this.elements.optionArray.length; i++) {
            var content = this.elements.optionArray[i].innerText;
            if (content.toLowerCase().indexOf(this.search) >= 0) {
                this.elements.currentOptionIndex = i;
                this.activateCurrentOption();
                break;
            }
        }
    };
    Dropdown.prototype.mouseOptions = function () {
        var _this = this;
        this.elements.selectedElement.addEventListener("click", function () {
            _this.toggleDropdown();
        });
        this.addClickHandlers();
        this.addHoverEffect();
    };
    Dropdown.prototype.tabFocusOptions = function () {
        var _this = this;
        // focus event handler
        this.elements.container.addEventListener("focus", function (e) {
            var target = e.target;
            if (target === null) {
                return;
            }
            target.classList.add("focused");
        });
        // focusout event handler
        this.elements.container.addEventListener("focusout", function (e) {
            var target = e.target;
            if (target === null) {
                return;
            }
            target.classList.remove("focused");
            _this.setSelectedOption();
        });
    };
    Dropdown.prototype.addClickHandlers = function () {
        var _this = this;
        var _loop_1 = function (i) {
            var option = this_1.elements.optionArray[i];
            option.addEventListener("click", function (e) {
                var target = e.target;
                if (target !== null && !target.classList.contains("option")) {
                    return;
                }
                // find current index of clicked item
                _this.elements.currentOptionIndex = parseInt(option.getAttribute("index") || "");
                _this.activateCurrentOption();
                _this.setSelectedOption();
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.elements.optionArray.length; i++) {
            _loop_1(i);
        }
    };
    Dropdown.prototype.addHoverEffect = function () {
        var _this = this;
        var _loop_2 = function (i) {
            var option = this_2.elements.optionArray[i];
            option.addEventListener("mouseover", function (e) {
                var target = e.target;
                if (target !== null && !target.classList.contains("option")) {
                    return;
                }
                // find current index of hovered item
                _this.elements.currentOptionIndex = parseInt(option.getAttribute("index") || "");
                _this.activateCurrentOption();
            });
        };
        var this_2 = this;
        for (var i = 0; i < this.elements.optionArray.length; i++) {
            _loop_2(i);
        }
    };
    Dropdown.prototype.toggleDropdown = function () {
        if (this.elements.options !== null) {
            this.elements.options.classList.toggle("open");
        }
    };
    Dropdown.prototype.highlightPreviousOption = function () {
        // add class name active on previous option
        if (this.elements.currentOptionIndex <= 0) {
            // initially, if nothing is selected and up arrow or left arrow is prssed, select last option
            this.elements.currentOptionIndex = this.elements.optionArray.length - 1;
        }
        else {
            this.elements.currentOptionIndex--;
        }
        this.activateCurrentOption();
    };
    Dropdown.prototype.highlightNextOption = function () {
        // add class name active on next option
        if (this.elements.currentOptionIndex >= this.elements.optionArray.length - 1) {
            this.elements.currentOptionIndex = 0;
        }
        else {
            this.elements.currentOptionIndex++;
        }
        this.activateCurrentOption();
    };
    Dropdown.prototype.activateCurrentOption = function () {
        this.clearOptions();
        var option = this.elements.optionArray[this.elements.currentOptionIndex];
        option.classList.add("active");
    };
    Dropdown.prototype.setSelectedOption = function () {
        var option = this.elements.optionArray[this.elements.currentOptionIndex];
        if (option !== undefined) {
            this.elements.selectedElement.innerHTML = option.innerHTML;
            this.closeDropdown();
            this.elements.container.dispatchEvent(this.onSelectedEvent);
        }
    };
    Dropdown.prototype.focusNext = function () {
        this.elements.currentFocused++;
        var tabable = this.elements.tabElements[this.elements.currentFocused];
        if (tabable !== null && tabable !== undefined) {
            this.clearFocused();
            tabable.classList.add("focused");
        }
        if (this.elements.currentFocused >= this.elements.tabElements.length) {
            this.currentFocused = this.elements.tabElements.length;
        }
    };
    Dropdown.prototype.focusPrevious = function () {
        this.elements.currentFocused--;
        var tabable = this.elements.tabElements[this.elements.currentFocused];
        if (tabable !== null && tabable !== undefined) {
            this.clearFocused();
            tabable.classList.add("focused");
        }
        if (this.elements.currentFocused < 0) {
            this.currentFocused = -1;
        }
    };
    Dropdown.prototype.indexOptions = function () {
        // add index number in each option
        for (var i = 0; i < this.elements.optionArray.length; i++) {
            var option = this.elements.optionArray[i];
            option.setAttribute("index", i);
        }
    };
    Dropdown.prototype.clearOptions = function () {
        for (var i = 0; i < this.elements.optionArray.length; i++) {
            var option = this.elements.optionArray[i];
            if (option !== null) {
                option.classList.remove("active");
            }
        }
    };
    Dropdown.prototype.closeDropdown = function () {
        if (this.elements.options === null) {
            return;
        }
        this.elements.options.classList.remove("open");
    };
    Dropdown.prototype.clearFocused = function () {
        if (this.elements.tabElements === null || this.elements.tabElements.length <= 0) {
            return;
        }
        for (var i = 0; i < this.elements.tabElements.length; i++) {
            var tabable = this.elements.tabElements[i];
            tabable.classList.remove("focused");
        }
    };
    return Dropdown;
}());
// init all dropdowns
var dropdowns = document.querySelectorAll(".selectDropdown");
for (var i = 0; i < dropdowns.length; i++) {
    var dropdown = dropdowns[i];
    new Dropdown(dropdown);
}
var TestWidget = /** @class */ (function () {
    function TestWidget(widget) {
        this.widget = widget;
        this.elements = {};
        if (this.widget === null) {
            return;
        }
        this.init();
        this.submitOnOptionSelected();
    }
    TestWidget.prototype.init = function () {
        this.elements.container = this.widget;
        this.addEvents();
    };
    TestWidget.prototype.addEvents = function () {
        // handle focus event
        this.elements.container.addEventListener("focus", function (e) {
            var target = e.target;
            if (target === null) {
                return;
            }
            target.classList.add("focused");
        });
        // handle unfocus event
        this.elements.container.addEventListener("focusout", function (e) {
            var target = e.target;
            if (target === null) {
                return;
            }
            target.classList.remove("focused");
        });
    };
    TestWidget.prototype.submitOnOptionSelected = function () {
        var dropdown = document.querySelector(".selectDropdown");
        if (dropdown === null) {
            return;
        }
        dropdown.addEventListener("onSelected", function (e) {
            console.log("Submit form because an option is selected");
        });
    };
    return TestWidget;
}());
var tabBoxes = document.querySelectorAll(".box");
for (var i = 0; i < tabBoxes.length; i++) {
    var box = tabBoxes[i];
    new TestWidget(box);
}
