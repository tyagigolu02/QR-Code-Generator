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
let qrCodeStyling = null;

// Wait for the page to load before adding event listeners
document.addEventListener('DOMContentLoaded', function() {
    // ONLY generate QR on button click
    generateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (qrText.value.length > 0) {
            generateQRCode();
        } else {
            alert("Enter the text or URL to generate your QR code");
        }
    });

    // These events only update variables/UI - NO QR generation
    sizes.addEventListener('change', (e) => {
        size = e.target.value;
    });

    format.addEventListener('change', (e) => {
        selectedFormat = e.target.value;
        updateDownloadButtonText();
    });

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

    // Initialize values
    updateDownloadButtonText();
    updateLogoSize();
    updateEmojiSize();
    updateCornerRadius();

    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadQRCode();
    });

    // Clear QR when input is empty
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
    // DO NOT regenerate QR here - only on button click
}

function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedLogo = new Image();
            uploadedLogo.onload = function() {
                logoPreview.innerHTML = `<img src="${uploadedLogo.src}" alt="Logo Preview" style="max-width: 50px; max-height: 50px;" />`;
            };
            uploadedLogo.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    // DO NOT regenerate QR here
}

function handleEmojiSelect(e) {
    // Remove previous selection
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked button
    e.target.classList.add('selected');
    selectedEmoji = e.target.dataset.emoji;
    // DO NOT regenerate QR here
}

function updateLogoSize() {
    logoSizeValue.textContent = logoSize.value + '%';
    // DO NOT regenerate QR here
}

function updateEmojiSize() {
    emojiSizeValue.textContent = emojiSize.value + '%';
    // DO NOT regenerate QR here
}

function updateColors() {
    // DO NOT regenerate QR here
}

function updateCornerRadius() {
    cornerRadiusValue.textContent = cornerRadius.value + 'px';
    // DO NOT regenerate QR here
}

function updateDownloadButtonText() {
    const formatText = selectedFormat.toUpperCase();
    downloadBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
        Download as ${formatText}
    `;
}

function clearQRDisplay() {
    qrContainer.innerHTML = `
        <div class="placeholder-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4z"/>
                <path d="M15 15h1v1h-1zm0 2h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zm-4 2h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1z"/>
            </svg>
            <p>Your QR code will appear here</p>
        </div>
    `;
}

// MAIN QR GENERATION FUNCTION - Only called on button click
function generateQRCode() {
    qrContainer.innerHTML = ""; // Clear previous QR
    
    if (qrCodeStyling) {
        qrCodeStyling = null; // Clean up previous instance
    }

    // Base QR options
    let qrOptions = {
        width: parseInt(size),
        height: parseInt(size),
        data: qrText.value,
        margin: 10,
        qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: 'Q'
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 0
        },
        dotsOptions: {
            color: "#000000",
            type: "square"
        },
        backgroundOptions: {
            color: "#ffffff"
        }
    };

    // Apply customizations based on selected style
    if (customStyle === 'logo' && uploadedLogo) {
        qrOptions.image = uploadedLogo.src;
        qrOptions.imageOptions.imageSize = parseInt(logoSize.value) / 100;
    }
    
    if (customStyle === 'emoji' && selectedEmoji) {
        // Convert emoji to image
        const emojiCanvas = document.createElement('canvas');
        emojiCanvas.width = 120;
        emojiCanvas.height = 120;
        const ctx = emojiCanvas.getContext('2d');
        ctx.font = '96px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(selectedEmoji, 60, 60);
        
        qrOptions.image = emojiCanvas.toDataURL();
        qrOptions.imageOptions.imageSize = parseInt(emojiSize.value) / 100;
    }
    
    if (customStyle === 'colors') {
        qrOptions.dotsOptions.color = fgColor.value;
        qrOptions.backgroundOptions.color = bgColor.value;
    }
    
    if (customStyle === 'rounded') {
        qrOptions.dotsOptions.type = "rounded";
        qrOptions.cornersSquareOptions = {
            type: "extra-rounded"
        };
        qrOptions.cornersDotOptions = {
            type: "dot"
        };
    }

    // Generate QR code
    qrCodeStyling = new QRCodeStyling(qrOptions);
    qrCodeStyling.append(qrContainer);
}

function downloadQRCode() {
    if (!qrCodeStyling) {
        alert("Please generate a QR code first!");
        return;
    }

    const extension = selectedFormat === 'jpg' ? 'jpeg' : selectedFormat;
    
    qrCodeStyling.download({
        name: "QR_Code",
        extension: extension
    }).then(() => {
        showDownloadMessage(selectedFormat);
    }).catch((error) => {
        console.error("Error downloading QR code:", error);
        alert("Error downloading QR code. Please try again.");
    });
}

function showDownloadMessage(format) {
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

    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}

// Add CSS animations
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

// Footer Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Update QR count periodically (simulated)
    let qrCount = 10000;
    setInterval(() => {
        qrCount += Math.floor(Math.random() * 5) + 1;
        const qrCountElement = document.getElementById('qr-count');
        if (qrCountElement) {
            qrCountElement.textContent = qrCount.toLocaleString() + '+';
        }
    }, 30000); // Update every 30 seconds
});

// Footer Interactive Functions
function clearAllInputs() {
    qrText.value = '';
    sizes.value = '250';
    format.value = 'png';
    customization.value = 'default';
    if (logoUpload) logoUpload.value = '';
    if (logoPreview) logoPreview.innerHTML = '<div class="file-preview-text">No logo selected</div>';
    
    // Clear QR display
    qrContainer.innerHTML = `
        <div class="placeholder-content">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4z"/>
                <path d="M15 15h1v1h-1zm0 2h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zm-4 2h1v1h-1zm2 0h1v1h-1zm2 0h1v1h-1z"/>
            </svg>
            <p>Enter text and click Generate to create your QR code</p>
        </div>
    `;
    
    // Reset variables
    uploadedLogo = null;
    selectedEmoji = null;
    customStyle = 'default';
    qrCodeStyling = null;
    
    // Show success animation
    const clearBtn = event.target;
    clearBtn.style.animation = 'successPulse 0.6s ease-out';
    setTimeout(() => {
        clearBtn.style.animation = '';
    }, 600);
}

function generateRandomQR() {
    const sampleTexts = [
        'https://github.com/tyagigolu02',
        'https://codewithtyagi.netlify.app/',
        'Welcome to QR Generator!',
        'https://linkedin.com/in/tyagigolu02',
        'QR codes made simple and stylish',
        'Technology meets creativity',
        'Building the future, one QR at a time',
        'https://www.google.com',
        'Hello World!',
        'Scan me for a surprise!'
    ];
    
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    qrText.value = randomText;
    
    // Optionally generate immediately
    if (confirm('Generate QR code for: "' + randomText + '"?')) {
        generateQRCode();
    }
}

function downloadBatch() {
    if (!qrCodeStyling || !qrText.value) {
        alert('Please generate a QR code first!');
        return;
    }
    
    const formats = ['png', 'jpeg', 'svg'];
    const sizes = [250, 350, 500];
    
    if (confirm('Download QR code in multiple formats and sizes?')) {
        formats.forEach((fmt, index) => {
            setTimeout(() => {
                const originalFormat = selectedFormat;
                const originalSize = size;
                
                selectedFormat = fmt;
                size = sizes[index % sizes.length];
                
                // Create filename with format and size
                const filename = `qr-code-${size}x${size}.${fmt}`;
                
                if (fmt === 'svg') {
                    qrCodeStyling.download({ 
                        name: filename.replace('.svg', ''),
                        extension: 'svg'
                    });
                } else {
                    qrCodeStyling.download({ 
                        name: filename.replace(`.${fmt}`, ''),
                        extension: fmt
                    });
                }
                
                // Restore original settings
                selectedFormat = originalFormat;
                size = originalSize;
            }, index * 1000); // Delay downloads by 1 second each
        });
    }
}

function setQRType(type) {
    const templates = {
        'url': 'https://example.com',
        'email': 'mailto:example@email.com',
        'phone': 'tel:+1234567890',
        'wifi': 'WIFI:T:WPA;S:NetworkName;P:Password;H:false;',
        'text': 'Your custom text here',
        'vcard': 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Company\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD'
    };
    
    if (templates[type]) {
        qrText.value = templates[type];
        qrText.focus();
        
        // Highlight the tag that was clicked
        document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
        event.target.classList.add('active');
        
        setTimeout(() => {
            event.target.classList.remove('active');
        }, 2000);
    }
}

function shareApp() {
    const shareData = {
        title: 'QR Code Generator',
        text: 'Generate beautiful QR codes instantly with this amazing tool!',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('App URL copied to clipboard!');
        }).catch(() => {
            // Final fallback
            prompt('Copy this URL to share:', window.location.href);
        });
    }
}

// Add active state styling for tags
const tagStyle = document.createElement('style');
tagStyle.textContent = `
    .tag.active {
        background: linear-gradient(45deg, #667eea, #764ba2) !important;
        color: white !important;
        transform: translateY(-2px) scale(1.05) !important;
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4) !important;
        border-color: rgba(255, 255, 255, 0.6) !important;
    }
`;
document.head.appendChild(tagStyle);
