var Dropdown = /** @class */ (function () {
    function Dropdown(widget) {
        this.widget = widget;
        this.elements = {};
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
    };
    Dropdown.prototype.keyOptions = function () {
        var _this = this;
        document.body.addEventListener("keydown", function (e) {
            // logic for tab keys
            var keyCode = e.keyCode;
            switch (keyCode) {
                case 9:
                    _this.focusNext();
                    break;
                case 37:
                // left arrow key
                case 38:
                    // up arrow
                    _this.highlightPreviousOption();
                    break;
                case 39:
                // right arrow
                case 40:
                    // down arrow
                    _this.highlightNextOption();
                    break;
                case 13:
                    // enter key
                    _this.setSelectedOption();
                    break;
                default:
                    // for shift tab key
                    if (e.shiftKey && keyCode === 9) {
                        _this.focusPrevious();
                    }
            }
        });
    };
    Dropdown.prototype.mouseOptions = function () {
        var _this = this;
        this.elements.selectedElement.addEventListener("click", function () {
            _this.toggleDropdown();
        });
        this.addClickHandlers();
        this.addHoverEffect();
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
        }
    };
    Dropdown.prototype.focusNext = function () {
    };
    Dropdown.prototype.focusPrevious = function () {
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
        this.elements.options.classList.remove("open");
    };
    return Dropdown;
}());
// init all dropdowns
var dropdowns = document.querySelectorAll(".selectDropdown");
for (var i = 0; i < dropdowns.length; i++) {
    var dropdown = dropdowns[i];
    new Dropdown(dropdown);
}
