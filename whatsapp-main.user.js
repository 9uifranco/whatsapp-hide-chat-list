// ==UserScript==
// @name         WhatsApp Hide Chat List
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Hide WhatsApp Web chat list
// @author       Guilherme Franco (9uifranco)
// @match        https://web.whatsapp.com/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isElementHidden = false;
    const hideThreshold = 20;

    // Hide/show chat list div
    function updateChatListVisibility() {
        const chatList = document.querySelector("body > div > div > div > div:nth-child(4)");
        const headerElement = document.querySelector(".lyvj5e2u");

        if (chatList) {
            const isMouseOverElement = isMouseOver(chatList);

            // Set initial values
            chatList.style.display = 'flex';
            chatList.style.flex = '0 0';
            chatList.style.maxWidth = '80%';
            chatList.style.width = '100%';
            chatList.style.transition = 'width .5s ease-out 0s';

            headerElement.style.paddingLeft = '16px';
            headerElement.style.transition = 'all .5s ease-out 0s';

            if (isMouseOverElement || event.clientX <= hideThreshold) {
                // Show
                chatList.style.width = '100%';
                headerElement.style.paddingLeft = '16px';
                isElementHidden = false;
            } else {
                // Hide
                chatList.style.width = '0%';
                headerElement.style.paddingLeft = '0px';
                isElementHidden = true;
            }
        }
    }

    // Check if mouse is over the chat list or any of its children
    function isMouseOver(element) {
        return element.contains(event.target);
    }

    updateChatListVisibility();

    // Watch for changes in the DOM
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                // If there are added nodes, update the element visibility
                if (mutation.addedNodes.length > 0) {
                    updateChatListVisibility();
                }
            }
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add event listener for mouse move
    document.addEventListener('mousemove', function (event) {
        updateChatListVisibility();
    });

    // Add event listener for mouse leave on the element
    document.addEventListener('mouseleave', function (event) {
        updateChatListVisibility();
    });
})();