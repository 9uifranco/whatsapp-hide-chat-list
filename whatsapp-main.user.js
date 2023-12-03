// ==UserScript==
// @name         WhatsApp Hide Chat List
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide WhatsApp Web chat list
// @author       Guilherme Franco (9uifranco)
// @match        https://web.whatsapp.com/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js
// ==/UserScript==

(function () {
    'use strict';

    let overlayButton, customToolbar;
    let hasInitialized = false;
    let isElementHidden = false;
    const hideThreshold = 20;

    // Create toolbar
    function createToolbar() {
        let toolbar = document.createElement('div');
        toolbar.innerHTML = `<nav id="customToolbar">
        <button title="Blur Screen" id="overlayButton" class="eye"><i class="fas fa-eye-slash fa-xs"></i></button>
        <a title="GitHub Repo" id="githubLink" href="https://github.com/9uifranco/whatsapp-hide-chat-list#whatsapp-hide-chat-list" target="_blank"><i class="fa-brands fa-github fa-xs"></i></a>
        </nav>`;
        document.body.insertBefore(toolbar, document.body.firstChild);

        overlayButton = document.getElementById('overlayButton');
        customToolbar = document.getElementById('customToolbar');
    }

    // Toggle overlay
    function toggleOverlay() {
        let overlay = document.getElementById('overlay') || createOverlay();

        overlay.classList.toggle('visible');

        let isOverlayVisible = overlay.classList.contains('visible');
        overlayButton.innerHTML = isOverlayVisible ? '<i class="fas fa-eye fa-xs"></i>' : '<i class="fas fa-eye-slash fa-xs"></i>';
    }

    // Create and return the overlay
    function createOverlay() {
        let overlay = document.createElement('div');
        overlay.id = 'overlay';
        document.body.appendChild(overlay);
        return overlay;
    }

    // Adjust toolbar position based on mouse movement
    function adjustToolbarPosition(event) {
        let mouseX = event.clientX;

        if (mouseX > window.innerWidth - 5 || isMouseOver(customToolbar)) {
            customToolbar.style.right = '0';
        } else {
            customToolbar.style.right = '-200px';
        }
    }

    // Check if mouse is over the element or its children
    function isMouseOver(element) {
        return element.contains(event.target);
    }

    // Update chat list visibility
    function updateChatListVisibility() {
        const chatList = document.querySelector("body > div > div > div > div:nth-child(3)");
        const headerElement = document.querySelector(".lyvj5e2u");

        if (chatList && (chatList.classList.contains('_2Ts6i') && chatList.classList.contains("_3RGKj"))) {
            if (!hasInitialized) {
                chatList.style.display = 'flex';
                chatList.style.flex = '0 0';
                chatList.style.maxWidth = '80%';
                chatList.style.width = '0%';
                chatList.style.transition = 'width .5s ease-out 0s';

                headerElement.style.paddingLeft = '0px';
                headerElement.style.transition = 'all .5s ease-out 0s';

                hasInitialized = true;
            }

            const isMouseOverElement = isMouseOver(chatList);

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

    // Set up MutationObserver
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

    // Initialize the script
    function init() {
        createToolbar();
        overlayButton.addEventListener('click', toggleOverlay);
        document.addEventListener('mousemove', function (event) {
            adjustToolbarPosition(event);
            updateChatListVisibility(event);
        });
        document.addEventListener('mouseleave', updateChatListVisibility);
    }

    // Add styles
    let styles = `
        #customToolbar {
            background-color: #333;
            color: white;
            padding: 10px;
            position: fixed;
            height: 100%;
            width: 3rem;
            right: -200px; /* initially hide to the right */
            top: 0;
            z-index: 9999999;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
            gap: .5rem;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
        }

        #overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 9999998;
            backdrop-filter: blur(10px);
        }

        #overlay.visible {
            display: block;
        }

        #overlayButton.eye {
            font-size: 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
            color: white;
        }

        #githubLink {
            font-size: 1.5rem;
            background: none;
            border: none;
            cursor: pointer;
            color: white;
            text-decoration: none;
        }

        .chat-list-hidden #side {
            display: none !important;
        }

        .chat-list-hidden #main {
            margin-left: 0 !important;
        }
    `;

    let styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    init();
})();