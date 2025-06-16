// cursor-trail.js

document.addEventListener('DOMContentLoaded', () => {
    const chessPieceImages = [
        'images/chess_pawn.svg',
        'images/chess_knight.svg',
        'images/chess_rook.svg',
        'images/chess_bishop.svg',
        'images/chess_king.svg'
    ];

    const darkBackgroundSelectors = ['.courses', '.teams', 'footer', '.gallery', '.fixed-left-buttons'];
    // Note: .navbar.sticky is handled by specific crimson check now.

    let canCreatePiece = true;
    let lastX = 0;
    let lastY = 0;
    const minMoveDistance = 10;

    document.addEventListener('mousemove', (e) => {
        const distance = Math.sqrt(Math.pow(e.pageX - lastX, 2) + Math.pow(e.pageY - lastY, 2));
        if (distance < minMoveDistance && !canCreatePiece) {
            if (canCreatePiece) {
                lastX = e.pageX;
                lastY = e.pageY;
            }
            return;
        }

        if (!canCreatePiece) {
            return;
        }

        lastX = e.pageX;
        lastY = e.pageY;
        canCreatePiece = false;
        setTimeout(() => {
            canCreatePiece = true;
        }, 75);

        const piece = document.createElement('img');
        const randomPieceSrc = chessPieceImages[Math.floor(Math.random() * chessPieceImages.length)];

        piece.src = randomPieceSrc;
        piece.classList.add('chess-trail-piece');

        let onDarkBackground = false;
        let onCrimsonBackground = false;
        const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);

        if (elementUnderCursor) {
            let currentElement = elementUnderCursor;
            while (currentElement && currentElement !== document.body) {
                const computedStyle = window.getComputedStyle(currentElement);
                const bgColor = computedStyle.backgroundColor;

                if (bgColor && bgColor !== 'transparent' && !bgColor.startsWith('rgba(0, 0, 0, 0)')) { // Only check non-transparent backgrounds
                    const rgbMatch = bgColor.match(/^rgb[a]?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
                    if (rgbMatch) {
                        const r = parseInt(rgbMatch[1]);
                        const g = parseInt(rgbMatch[2]);
                        const b = parseInt(rgbMatch[3]);
                        const alpha = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1;

                        if (alpha > 0.8) { // Only consider opaque or nearly opaque backgrounds
                            // Check for crimson (rgb(220, 20, 60)) - allow some tolerance
                            if (r >= 210 && r <= 230 && g >= 10 && g <= 30 && b >= 50 && b <= 70) {
                                onCrimsonBackground = true;
                                break;
                            }

                            // Check for general dark selectors (if not crimson)
                            if (darkBackgroundSelectors.some(selector => currentElement.matches(selector))) {
                                onDarkBackground = true;
                                // Don't break, allow specific color checks on children to override
                            }

                            // Check for general dark color by brightness (if not crimson)
                            if ((r + g + b) < 200) {
                                onDarkBackground = true;
                            }

                            // If a definitive light opaque background is found, stop if not already on dark/crimson.
                            // This helps prevent a light child from overriding a dark parent unnecessarily unless it's crimson.
                            // if (!onDarkBackground && (r + g + b) >= 200) {
                            //    break;
                            // }
                        }
                    }
                }
                 if (onCrimsonBackground) break; // Crimson found, highest precedence for this element path
                currentElement = currentElement.parentElement;
            }
        }

        // Fallback for body if nothing specific found by element traversal
        if (!onCrimsonBackground && !onDarkBackground) {
            const bodyBgColor = window.getComputedStyle(document.body).backgroundColor;
            if (bodyBgColor) {
                const bodyRgbMatch = bodyBgColor.match(/^rgb[a]?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
                if (bodyRgbMatch) {
                    const r = parseInt(bodyRgbMatch[1]);
                    const g = parseInt(bodyRgbMatch[2]);
                    const b = parseInt(bodyRgbMatch[3]);
                    const alpha = bodyRgbMatch[4] ? parseFloat(bodyRgbMatch[4]) : 1;
                    if (alpha > 0.8) {
                         // Check if body itself is crimson (unlikely but possible)
                        if (r >= 210 && r <= 230 && g >= 10 && g <= 30 && b >= 50 && b <= 70) {
                            onCrimsonBackground = true;
                        } else if ((r + g + b) < 200) { // General dark threshold for body
                            onDarkBackground = true;
                        }
                    }
                }
            }
        }

        if (onCrimsonBackground) {
            piece.classList.add('trail-piece-white');
        } else if (onDarkBackground) {
            piece.classList.add('trail-piece-red');
        } else {
            piece.classList.add('trail-piece-black');
        }

        piece.style.left = (e.pageX - 10) + 'px';
        piece.style.top = (e.pageY - 10) + 'px';

        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;

        document.body.appendChild(piece);
        // Force a reflow
        void piece.offsetHeight;

        piece.style.opacity = '0';
        piece.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.5)`;

        piece.addEventListener('transitionend', () => {
            if (piece.parentElement) {
                piece.parentElement.removeChild(piece);
            }
        });

        setTimeout(() => {
            if (piece.parentElement) {
                piece.parentElement.removeChild(piece);
            }
        }, 800);
    });
});
