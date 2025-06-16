// cursor-trail.js

document.addEventListener('DOMContentLoaded', () => {
    const chessPieceImages = [
        'images/chess_pawn.svg',
        'images/chess_knight.svg',
        'images/chess_rook.svg',
        'images/chess_bishop.svg'
    ];

    let canCreatePiece = true; // Simple throttle flag

    document.addEventListener('mousemove', (e) => {
        if (!canCreatePiece) {
            return;
        }

        canCreatePiece = false;
        setTimeout(() => {
            canCreatePiece = true;
        }, 75); // Throttle: create a piece every 75ms max

        const piece = document.createElement('img');
        const randomPieceSrc = chessPieceImages[Math.floor(Math.random() * chessPieceImages.length)];

        piece.src = randomPieceSrc;
        piece.classList.add('chess-trail-piece');

        // Set initial position to cursor
        // Adjusting slightly so the cursor isn't directly on top of the image center
        piece.style.left = (e.pageX - 10) + 'px';
        piece.style.top = (e.pageY - 10) + 'px';

        // Randomize end position slightly for a "sprinkle" effect
        const offsetX = (Math.random() - 0.5) * 40; // Moves piece +/- 20px horizontally
        const offsetY = (Math.random() - 0.5) * 40; // Moves piece +/- 20px vertically

        document.body.appendChild(piece);

        // Force a reflow to ensure the transition starts
        piece.offsetHeight;

        // Start fade out and movement animation (defined in CSS)
        piece.style.opacity = '0';
        piece.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(0.5)`; // Shrinks and moves

        // Remove the piece after the animation
        piece.addEventListener('transitionend', () => {
            if (piece.parentElement) {
                piece.parentElement.removeChild(piece);
            }
        });

        // Fallback remover in case transitionend doesn't fire (e.g. if display becomes none)
        setTimeout(() => {
            if (piece.parentElement) {
                piece.parentElement.removeChild(piece);
            }
        }, 800); // Should be slightly longer than CSS transition

    });
});
