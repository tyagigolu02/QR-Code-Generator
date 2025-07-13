const qrText = document.getElementById('qr-text');
const sizes = document.getElementById('sizes');
const format = document.getElementById('format');
const customization = document.getElementById('customization');
const customOptions = document.getElementById('custom-options');
const logoUpload = document.getElementById('logo-upload');
const logoPreview = document.getElementById('logo-preview');
const logoSize = document.getElementById('logo-size');
const logoSizeValue = document.getElementById('logo-size-value');
const emojiSize = document.getElementById('emoji-size');
const emojiSizeValue = document.getElementById('emoji-size-value');
const fgColor = document.getElementById('fg-color');
const bgColor = document.getElementById('bg-color');
const cornerRadius = document.getElementById('corner-radius');
const cornerRadiusValue = document.getElementById('corner-radius-value');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrContainer = document.querySelector('.qr-body');

let size = sizes.value;
let selectedFormat = format.value;
let uploadedLogo = null;
let selectedEmoji = null;
let customStyle = 'default';

// Wait for the page to load before adding event listeners
document.addEventListener('DOMContentLoaded', function() {
    generateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isEmptyInput();
    });

    sizes.addEventListener('change', (e) => {
        size = e.target.value;
        // Only regenerate if there's already a QR code displayed
        if (qrText.value.length > 0 && qrContainer.querySelector('canvas, img')) {
            generateQRCode();
        }
    });

    format.addEventListener('change', (e) => {
        selectedFormat = e.target.value;
        updateDownloadButtonText();
    });

    // Initialize download button text
    updateDownloadButtonText();

    // Customization event listeners
    customization.addEventListener('change', handleCustomizationChange);
    logoUpload.addEventListener('change', handleLogoUpload);
    logoSize.addEventListener('input', updateLogoSize);
    emojiSize.addEventListener('input', updateEmojiSize);
    fgColor.addEventListener('change', updateColors);
    bgColor.addEventListener('change', updateColors);
    cornerRadius.addEventListener('input', updateCornerRadius);

    // Emoji button event listeners
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', handleEmojiSelect);
    });

    // Initialize slider values
    updateLogoSize();
    updateEmojiSize();
    updateCornerRadius();

    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadQRCode();
    });

    // Add input event listener to clear QR when input is empty
    qrText.addEventListener('input', () => {
        if (qrText.value.length === 0) {
            clearQRDisplay();
        }
    });
});

function handleCustomizationChange() {
    customStyle = customization.value;
    
    // Hide all custom options first
    document.querySelectorAll('.custom-option').forEach(option => {
        option.style.display = 'none';
    });
    
    // Show/hide custom options container
    if (customStyle === 'default') {
        customOptions.style.display = 'none';
    } else {
        customOptions.style.display = 'block';
        
        // Show relevant option
        switch(customStyle) {
            case 'logo':
                document.getElementById('logo-option').style.display = 'block';
                break;
            case 'emoji':
                document.getElementById('emoji-option').style.display = 'block';
                break;
            case 'colors':
                document.getElementById('color-option').style.display = 'block';
                break;
            case 'rounded':
                document.getElementById('rounded-option').style.display = 'block';
                break;
        }
    }
    
    // Regenerate QR code if text exists
    if (qrText.value.length > 0) {
        generateQRCode();
    }
}

function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedLogo = new Image();
            uploadedLogo.onload = function() {
                logoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo Preview">`;
                if (qrText.value.length > 0) {
                    generateQRCode();
                }
            };
            uploadedLogo.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function handleEmojiSelect(e) {
    // Remove previous selection
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    e.target.classList.add('selected');
    selectedEmoji = e.target.dataset.emoji;
    
    // Regenerate QR code if text exists
    if (qrText.value.length > 0) {
        generateQRCode();
    }
}

function updateLogoSize() {
    logoSizeValue.textContent = logoSize.value + '%';
    if (uploadedLogo && qrText.value.length > 0) {
        generateQRCode();
    }
}

function updateEmojiSize() {
    emojiSizeValue.textContent = emojiSize.value + '%';
    if (selectedEmoji && qrText.value.length > 0) {
        generateQRCode();
    }
}

function updateColors() {
    if (qrText.value.length > 0) {
        generateQRCode();
    }
}

function updateCornerRadius() {
    cornerRadiusValue.textContent = cornerRadius.value + 'px';
    if (qrText.value.length > 0) {
        generateQRCode();
    }
}

function updateDownloadButtonText() {
    const downloadBtn = document.getElementById('downloadBtn');
    const formatText = selectedFormat.toUpperCase();
    downloadBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download as ${formatText}
    `;
}

function downloadQRCode() {
    let img = document.querySelector('.qr-body img');
    let canvas = document.querySelector('.qr-body canvas');

    if (!img && !canvas) {
        alert("Please generate a QR code first!");
        return;
    }

    // Get the canvas element (create one if we only have an img)
    let downloadCanvas = canvas;
    if (!downloadCanvas && img) {
        downloadCanvas = document.createElement('canvas');
        const ctx = downloadCanvas.getContext('2d');
        downloadCanvas.width = img.width;
        downloadCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    }

    if (selectedFormat === 'svg') {
        downloadSVG();
        return;
    }

    try {
        let mimeType = getMimeType(selectedFormat);
        let dataURL = downloadCanvas.toDataURL(mimeType, 0.9);
        
        // Create download link
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `QR_Code.${selectedFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        showDownloadMessage(selectedFormat);
    } catch (error) {
        console.error("Error downloading QR code:", error);
        alert("Error downloading QR code. Please try again.");
    }
}

function getMimeType(format) {
    switch(format) {
        case 'png':
            return 'image/png';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'webp':
            return 'image/webp';
        default:
            return 'image/png';
    }
}

function downloadSVG() {
    // For SVG, we need to create an SVG representation of the QR code
    let canvas = document.querySelector('.qr-body canvas');
    if (!canvas) {
        alert("SVG format is not available for this QR code. Please try PNG instead.");
        return;
    }

    try {
        // Create SVG string from canvas
        const svgString = createSVGFromCanvas(canvas);
        
        // Create blob and download
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'QR_Code.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        showDownloadMessage('svg');
    } catch (error) {
        console.error("Error creating SVG:", error);
        alert("Error creating SVG. Please try PNG instead.");
    }
}

function createSVGFromCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">`;
    
    // Add white background
    svgString += `<rect width="100%" height="100%" fill="white"/>`;
    
    // Convert pixels to SVG rectangles
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            // If pixel is dark (QR code module)
            if (r < 128 && g < 128 && b < 128) {
                svgString += `<rect x="${x}" y="${y}" width="1" height="1" fill="black"/>`;
            }
        }
    }
    
    svgString += '</svg>';
    return svgString;
}

function showDownloadMessage(format) {
    // Create a temporary success message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    message.textContent = `QR Code downloaded as ${format.toUpperCase()}!`;
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

function isEmptyInput() {
    if (qrText.value.length > 0) {
        generateQRCode();
    } else {
        alert("Enter the text or URL to generate your QR code");
    }
}

function clearQRDisplay() {
    qrContainer.innerHTML = `
        <div class="placeholder-content">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <path d="m5 5 2 2"/>
                <path d="m5 17 2-2"/>
                <path d="m19 5-2 2"/>
                <path d="m19 17-2-2"/>
            </svg>
            <p>Your QR code will appear here</p>
        </div>
    `;
}

function generateQRCode() {
    // Check if QRCode library is available
    if (typeof QRCode === 'undefined') {
        alert("QR Code library is not loaded. Please refresh the page.");
        return;
    }

    // Clear previous QR code
    qrContainer.innerHTML = "";
    
    try {
        // Get colors based on customization
        let foregroundColor = customStyle === 'colors' ? fgColor.value : '#000000';
        let backgroundColor = customStyle === 'colors' ? bgColor.value : '#ffffff';
        
        // Create QR code
        const qr = new QRCode(qrContainer, {
            text: qrText.value,
            height: size,
            width: size,
            colorLight: backgroundColor,
            colorDark: foregroundColor,
            correctLevel: QRCode.CorrectLevel.M
        });
        
        // Wait for QR code to be generated, then apply customizations
        setTimeout(() => {
            applyCustomizations();
        }, 100);
        
    } catch (error) {
        console.error("Error generating QR code:", error);
        alert("Error generating QR code. Please try again.");
    }
}

function applyCustomizations() {
    const canvas = qrContainer.querySelector('canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Apply rounded corners
    if (customStyle === 'rounded') {
        applyRoundedCorners(canvas, ctx);
    }
    
    // Add logo or emoji overlay
    if (customStyle === 'logo' && uploadedLogo) {
        addLogoOverlay(canvas, ctx);
    } else if (customStyle === 'emoji' && selectedEmoji) {
        addEmojiOverlay(canvas, ctx);
    }
    
    // Add size information
    addSizeInfo();
    
    // Add animation
    setTimeout(() => {
        canvas.style.animation = 'zoomIn 0.5s ease-out';
    }, 50);
}

function applyRoundedCorners(canvas, ctx) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const radius = parseInt(cornerRadius.value);
    
    // Create a temporary canvas for rounded effect
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw rounded rectangle mask
    tempCtx.beginPath();
    tempCtx.roundRect(0, 0, canvas.width, canvas.height, radius);
    tempCtx.clip();
    
    // Draw original image data
    tempCtx.putImageData(imageData, 0, 0);
    
    // Replace original canvas content
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
}

function addLogoOverlay(canvas, ctx) {
    if (!uploadedLogo) return;
    
    const logoSizePercent = parseInt(logoSize.value);
    const logoPixelSize = (canvas.width * logoSizePercent) / 100;
    
    // Calculate position (center)
    const x = (canvas.width - logoPixelSize) / 2;
    const y = (canvas.height - logoPixelSize) / 2;
    
    // Add white background circle for logo
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, logoPixelSize / 2 + 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw logo
    ctx.drawImage(uploadedLogo, x, y, logoPixelSize, logoPixelSize);
}

function addEmojiOverlay(canvas, ctx) {
    if (!selectedEmoji) return;
    
    const emojiSizePercent = parseInt(emojiSize.value);
    const emojiPixelSize = (canvas.width * emojiSizePercent) / 100;
    
    // Add white background circle for emoji
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, emojiPixelSize / 2 + 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw emoji
    ctx.font = `${emojiPixelSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedEmoji, canvas.width / 2, canvas.height / 2);
}

function addSizeInfo() {
    // Add size information with proper labels
    const sizeInfo = document.createElement('div');
    sizeInfo.className = 'qr-size-info';
    let sizeLabel = '';
    
    switch(size) {
        case '150':
            sizeLabel = 'Small';
            break;
        case '250':
            sizeLabel = 'Medium';
            break;
        case '350':
            sizeLabel = 'Large';
            break;
        default:
            sizeLabel = 'Custom';
    }
    
    let styleLabel = customStyle === 'default' ? '' : ` - ${customStyle.charAt(0).toUpperCase() + customStyle.slice(1)} Style`;
    sizeInfo.textContent = `${sizeLabel} QR Code - ${size}x${size}px${styleLabel}`;
    qrContainer.appendChild(sizeInfo);
}

// Add roundRect polyfill for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

