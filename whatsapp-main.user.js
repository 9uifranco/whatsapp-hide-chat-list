// ==UserScript==
// @name         WhatsApp Hide Chat List
// @namespace    http://tampermonkey.net/
// @version      0.6
// @license      MIT
// @description  Hide WhatsApp Web chat list
// @author       Guilherme Franco (9uifranco)
// @match        https://web.whatsapp.com/
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js
// @downloadURL https://update.greasyfork.org/scripts/480773/WhatsApp%20Hide%20Chat%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/480773/WhatsApp%20Hide%20Chat%20List.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let overlayButton, customToolbar;
    let hasInitialized = false;
    let isElementHidden = false;
    const hideThreshold = 40;

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

        if (mouseX > window.innerWidth - 20 || isMouseOver(customToolbar)) {
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
        const chatList = document.querySelector('div._aigw.x9f619.x1n2onr6.x5yr21d.x17dzmu4.x1i1dayz.x2ipvbc.x1w8yi2h.x78zum5.xdt5ytf.xa1v5g2.x1plvlek.xryxfnj.xd32934.x1m6msm');

        if (chatList) {
            const headerElement = chatList.querySelector('header');
            const sideElement = chatList.querySelector('#side');

            const isMouseOverElement = isMouseOver(chatList);

            if (!hasInitialized) {
                chatList.style.display = 'flex';
                chatList.style.flex = 'unset';
                chatList.style.maxWidth = '400px';
                chatList.style.width = '0%';
                chatList.style.backgroundColor = '#111b21';
                chatList.style.transition = 'width .5s ease-out 0s';

                sideElement.style.opacity = '0';
                sideElement.style.transition = 'opacity .5s ease-out 0s';

                headerElement.style.opacity = '0';
                headerElement.style.transition = 'all .5s ease-out 0s';

                hasInitialized = true;
            }

            if (isMouseOverElement || event.clientX <= hideThreshold) {
                // Show
                chatList.style.width = '100%';
                sideElement.style.opacity = '1';
                headerElement.style.opacity = '1';
                isElementHidden = false;
            } else {
                // Hide
                chatList.style.width = '0%';
                sideElement.style.opacity = '0';
                headerElement.style.opacity = '0';
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
                    updateGalleryVisibility();
                }
            }
        });
    });

    // Update gallery visibility
    function updateGalleryVisibility() {
        const gallery = document.querySelector('div.x10l6tqk.x1ey2m1c.xaivifb.x9f619.x78zum5.xdt5ytf.x6s0dn4.x1nhvcw1.xh8yej3.xpyat2d.x6ikm8r.x10wlt62.x13fuv20.x178xt8z.x1sdoubt.xg01cxk.xqu7myx');

        if (gallery) {
            gallery.style.height = '0';

            const isMouseOverElement = isMouseOver(gallery);

            if (isMouseOverElement || (event.clientY >= (document.body.scrollHeight - hideThreshold))) {
                // Show
                gallery.style.height = '6.25rem';
            } else {
                // Hide
                gallery.style.height = '0';
            }
        }
    }

    // Start observing the document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initialize the script
    function init() {
        console.log(`%c

.d888 d8b            d8b
d88P" "88b           Y8P
888    888
 "Y8888888 888   888 888
       888 888   888 888
       888 888   888 888
      d88P Y8b.  X88 888
  88888P"   "Y8888P' 888 f r a n c o


  github.com/9uifranco


                                                            `, "font-family:monospace; color: orange;");
        createToolbar();
        overlayButton.addEventListener('click', toggleOverlay);
        document.addEventListener('mousemove', function (event) {
            adjustToolbarPosition(event);
            updateChatListVisibility(event);
            updateGalleryVisibility(event);
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
    updateChatListVisibility();
})();