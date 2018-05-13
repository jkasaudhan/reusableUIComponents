class Dropdown {    private elements = {};    private onSelectedEvent: Event;    private search: string = "";    private searchRegex: string = /([a-zA-Z]+)/i;    private searchInterval: number = 0;    private activateSearch: boolean = true;    constructor(private widget: HTMLElement) {        if(this.widget === null) {            return;        }        this.init();    }    private init(): void {         this.elements.container = this.widget;         this.elements.selectedElement = this.widget.querySelector("div:first-child");         this.elements.options = this.widget.querySelector(".options");         this.elements.optionArray = this.widget.querySelectorAll(".option");         this.elements.currentOptionIndex = -1;         this.elements.tabElements = document.body.querySelectorAll("[tab-index]");         this.elements.currentFocused = -1;         this.indexOptions();         this.addEventHandlers();         this.exposeApis();    }    /**    * Attach methods on the dropdown DOM element so that it can be used by other    * components of a page.    */    private exposeApis(): void {        this.widget.toggleDropdown = () => { this.toggleDropdown()};    }    private addEventHandlers(): void {       this.keyOptions();       this.mouseOptions();       this.tabFocusOptions();       this.addOpitonSelectedEvent();    }    private addOpitonSelectedEvent(): void {        this.onSelectedEvent = new Event("onSelected");        this.elements.container.addEventListener("onSelected", (e) => {            console.log("Added custom dropdown event");        });    }    private keyOptions(): void {        document.body.addEventListener("keydown", (e) => {            if (!this.elements.container.classList.contains("focused")) {                return;            }            // logic for tab keys            const keyCode = e.keyCode;            switch(keyCode) {                case 9:                    // focus next tabable element                    // this.focusNext();                    break;                case 37:                 // left arrow key                case 38:                    // up arrow                    this.highlightPreviousOption();                    e.preventDefault();                    break;                case 39:                // right arrow                case 40:                    // down arrow                    this.highlightNextOption();                    e.preventDefault();                    break;                case 13:                    // enter key                    this.setSelectedOption();                    break;                case 32:                    // space key                    this.toggleDropdown();                    e.preventDefault();                    break;                 case 27:                    // esc key                    this.closeDropdown();                 break;                default:                    // for shift tab key                    if(e.shiftKey && keyCode === 9) {                        // focus previous tabable element                        // this.focusPrevious();                    }                    if(this.searchRegex.test(e.key)) {                        this.search += e.key;                        this.highlightSearch();                        this.activateSearch = false;                    }            }        });    }    private highlightSearch(): void {        if (!this.activateSearch) {            return;        }        this.searchInterval = window.setTimeout(() => {            this.matchOption();            window.clearTimeout(this.searchInterval);            this.search = "";            this.activateSearch = true;        }, 500);    }    private matchOption(): void {        for(let i = 0; i < this.elements.optionArray.length; i++) {            const content = this.elements.optionArray[i].innerText;            if(content.toLowerCase().indexOf(this.search) >= 0) {                this.elements.currentOptionIndex = i;                this.activateCurrentOption();                break;            }        }    }    private mouseOptions(): void {        this.elements.selectedElement.addEventListener("click", () => {            this.toggleDropdown();        });        this.addClickHandlers();        this.addHoverEffect();    }    private tabFocusOptions(): void {        // focus event handler        this.elements.container.addEventListener("focus", (e) => {            const target = e.target;            if(target === null) {                return;            }            target.classList.add("focused");        });        // focusout event handler        this.elements.container.addEventListener("focusout", (e) => {            const target = e.target;            if(target === null) {                return;            }            target.classList.remove("focused");            this.setSelectedOption();        });    }    private addClickHandlers(): void {        for (let i = 0; i < this.elements.optionArray.length; i++) {            const option = this.elements.optionArray[i];            option.addEventListener("click", (e) => {               const target = e.target;               if (target !== null && !target.classList.contains("option")) {                return;               }               // find current index of clicked item               this.elements.currentOptionIndex = parseInt(option.getAttribute("index") || "");               this.activateCurrentOption();               this.setSelectedOption();            });        }    }    private addHoverEffect(): void {        for (let i = 0; i < this.elements.optionArray.length; i++) {            const option = this.elements.optionArray[i];            option.addEventListener("mouseover", (e) => {               const target = e.target;               if (target !== null && !target.classList.contains("option")) {                return;               }               // find current index of hovered item               this.elements.currentOptionIndex = parseInt(option.getAttribute("index") || "");               this.activateCurrentOption();            });        }    }    private toggleDropdown(): void {        if (this.elements.options !== null) {            this.elements.options.classList.toggle("open");        }    }    private highlightPreviousOption(): void {        // add class name active on previous option        if (this.elements.currentOptionIndex <= 0) {            // initially, if nothing is selected and up arrow or left arrow is prssed, select last option            this.elements.currentOptionIndex = this.elements.optionArray.length - 1;        } else {             this.elements.currentOptionIndex--;        }         this.activateCurrentOption();    }    private highlightNextOption(): void {        // add class name active on next option        if (this.elements.currentOptionIndex >= this.elements.optionArray.length -1) {            this.elements.currentOptionIndex = 0;        } else {             this.elements.currentOptionIndex++;        }        this.activateCurrentOption();    }    private activateCurrentOption(): void {        this.clearOptions();        const option = this.elements.optionArray[this.elements.currentOptionIndex];        option.classList.add("active");    }    private setSelectedOption(): void {        const option = this.elements.optionArray[this.elements.currentOptionIndex];        if (option !== undefined) {            this.elements.selectedElement.innerHTML = option.innerHTML;            this.closeDropdown();            this.elements.container.dispatchEvent(this.onSelectedEvent);        }    }    private focusNext(): void {        this.elements.currentFocused++;        const tabable = this.elements.tabElements[this.elements.currentFocused];        if(tabable !== null && tabable !== undefined) {            this.clearFocused();            tabable.classList.add("focused");        }        if (this.elements.currentFocused >= this.elements.tabElements.length) {            this.currentFocused = this.elements.tabElements.length;        }    }    private focusPrevious(): void {        this.elements.currentFocused--;        const tabable = this.elements.tabElements[this.elements.currentFocused];        if(tabable !== null && tabable !== undefined) {            this.clearFocused();            tabable.classList.add("focused");        }        if (this.elements.currentFocused < 0) {            this.currentFocused = -1;        }    }    private indexOptions(): void {        // add index number in each option        for(let i = 0; i < this.elements.optionArray.length; i++) {            const option = this.elements.optionArray[i];            option.setAttribute("index", i);        }    }    private clearOptions(): void {        for(let i = 0; i < this.elements.optionArray.length; i++) {            const option = this.elements.optionArray[i];            if (option !== null) {                option.classList.remove("active");            }        }    }    private closeDropdown(): void {        if (this.elements.options === null) {            return;        }        this.elements.options.classList.remove("open");    }    private clearFocused(): void {        if(this.elements.tabElements === null || this.elements.tabElements.length <= 0) {            return;        }        for (let i = 0; i < this.elements.tabElements.length; i++) {            const tabable = this.elements.tabElements[i];            tabable.classList.remove("focused");        }    }} // init all dropdowns const dropdowns = document.querySelectorAll(".selectDropdown"); for (let i = 0; i < dropdowns.length; i++) {    const dropdown = dropdowns[i] as HTMLElement;    new Dropdown(dropdown); }class TestWidget {    private elements = {};    constructor(private widget: HTMLElement) {        if(this.widget === null) {            return;        }        this.init();        this.submitOnOptionSelected();    }    private init(): void {        this.elements.container = this.widget;        this.addEvents();    }    private addEvents(): void {        // handle focus event        this.elements.container.addEventListener("focus", (e) => {           const target = e.target;           if (target === null) {            return;           }           target.classList.add("focused");        });        // handle unfocus event        this.elements.container.addEventListener("focusout", (e) => {           const target = e.target;           if (target === null) {            return;           }           target.classList.remove("focused");        });    }    private submitOnOptionSelected(): void {        const dropdown = document.querySelector(".selectDropdown");        if(dropdown === null) {            return;        }        dropdown.addEventListener("onSelected", (e) => {            console.log("Submit form because an option is selected");        });    }}const tabBoxes = document.querySelectorAll(".box");for(let i = 0; i < tabBoxes.length; i++) {    const box = tabBoxes[i];    new TestWidget(box);}