import { useState, useEffect } from 'react';

const UploadPdf64Conversion = () => {
    console.log("Running...");
    
    const [base64Data, setBase64Data] = useState('');

    const handleFileSelect = (event) => {
        console.log('HandleFileSelect Running...');
        
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            convertToBase64(file).then(setBase64Data);
        } else {
            console.error('Please select a valid PDF file.');
        }
    };

    const convertToBase64 = (file) => {
        console.log('convertToBase64 Running...');

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result); // Base64 string
            };
            reader.readAsDataURL(file);
        });
    };

    const renderPDF = () => {
        console.log('renderPDF Running...');
        const img = new Image();
        img.src = base64Data;
        img.onload = () => {
        console.log('onImageLoad Running...');
            const canvas = document.getElementById('pdf-canvas');
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            context.drawImage(img, 0, 0);
        };
    };

    // Render the PDF image when the base64Data changes
    useEffect(() => {
        if (base64Data) {
            renderPDF();
        }
    }, [base64Data]);

    return (
        <div>
            <input type="file" accept="application/pdf" onChange={handleFileSelect} />
            <canvas id="pdf-canvas" width="600" height="800"></canvas>
        </div>
    );
};

export default UploadPdf64Conversion;
