import { useRef } from 'react'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDocument, GlobalWorkerOptions, version } from '../scripts/pdfjs-dist'

const UploadPdf = ({ onThumbnailUrlChange }) => {

    GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.mjs`
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const storage = getStorage();

    const aspectAdjuster = (pdfWidth, pdfHeight, boundsWidth, boundsHeight) => {
        let scale;
        if (pdfWidth >= pdfHeight) {
            scale = boundsWidth / pdfWidth
            pdfHeight = pdfHeight * (boundsWidth / pdfWidth)
            pdfWidth = boundsWidth
        } else {
            scale = boundsHeight / pdfHeight
            pdfWidth = pdfWidth * (boundsHeight / pdfHeight)
            pdfHeight = boundsHeight
        }
        return [pdfWidth, pdfHeight, scale]
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            try {
                const fileReader = new FileReader();

                fileReader.onload = async (e) => {
                    const typedarray = new Uint8Array(e.target.result);
                    const pdf = await getDocument(typedarray).promise;
                    const page = await pdf.getPage(1);

                    const initViewport = page.getViewport({ scale: 1 });
                    const canvas = canvasRef.current;
                    const canvasDims = aspectAdjuster(initViewport.width, initViewport.height, 200, 200)
                    canvas.width = canvasDims[0];
                    canvas.height = canvasDims[1];
                    const viewport = page.getViewport({ scale: canvasDims[2] })

                    const ctx = canvas.getContext('2d');
                    const renderContext = {
                        canvasContext: ctx,
                        viewport: viewport,
                    };
                    await page.render(renderContext).promise;

                    const thumbnailBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                    const timestamp = Date.now(); // Optional: Add a timestamp to the filename for uniqueness
                    const fileName = `thumbnails/pdf-thumbnail-${timestamp}.png`;
                    console.log(fileName);

                    try {
                        const thumbnailRef = ref(storage, `thumbnails/${file.name.split('.')[0]}_thumbnail.png`);
                        await uploadBytes(thumbnailRef, thumbnailBlob);
                        const url = await getDownloadURL(thumbnailRef);
                        onThumbnailUrlChange(url)

                    } catch (error) {
                        console.error('Error uploading thumbnail:', error);
                    }
                };

                fileReader.readAsArrayBuffer(file);
            } catch (error) {
                console.error(error);
            }
        } else if (file && file.type.startsWith('image/')) {
            console.log("Trying an IMAGE");
            
            try {
                const fileReader = new FileReader()
                fileReader.onload = async (e) => {
                    const img = new Image()
                    img.src = e.target.result
                    img.onload = async () => {
                        const imgDims = aspectAdjuster(img.width, img.height, 200, 200)
                        const canvas = canvasRef.current;
                        canvas.width = imgDims[0]
                        canvas.height = imgDims[1]
                        const ctx = canvas.getContext('2d')
                        ctx.drawImage(img, 0, 0, imgDims[0], imgDims[1])
                        const thumbnailBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                        const timestamp = Date.now(); // Optional: Add a timestamp to the filename for uniqueness
                        const fileName = `thumbnails/pdf-thumbnail-${timestamp}.png`;
                        console.log(fileName);

                        try {
                            const thumbnailRef = ref(storage, `thumbnails/${file.name.split('.')[0]}_thumbnail.png`);
                            await uploadBytes(thumbnailRef, thumbnailBlob);
                            const url = await getDownloadURL(thumbnailRef);
                            onThumbnailUrlChange(url)
    
                        } catch (error) {
                            console.error('Error uploading thumbnail:', error);
                        }
                    }

                }
                fileReader.readAsDataURL(file);
            } catch (error) {
                console.log("Whoops");
                console.error(error);
            }
        }
        else {
            alert('Please upload a valid PDF file.');
        }
    };


    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.png,.jpeg,.jpg"
                onChange={handleFileChange}
            />
            <canvas id={"pdfThumbCanvas"} ref={canvasRef} style={{ display: 'none', border: '1px solid black', width: '200px', height: 'auto' }} />
        </div>
    );
}

export default UploadPdf