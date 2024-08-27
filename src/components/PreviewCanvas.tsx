import { useRef, useEffect } from "react";

function PreviewCanvas({height, width, bleed}) {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
        
      let bleedWidth = width + (bleed * 2)
      let bleedHeight = height + (bleed * 2)


      // Calculate the height based on the width of 200px while maintaining the aspect ratio
      const targetWidth = 200;
      const targetHeight = (targetWidth / bleedWidth) * bleedHeight;
  
      // Set canvas dimensions
      canvas.width = targetWidth;
      canvas.height = targetHeight;
  
      // Draw the white rectangle
      context.fillStyle = 'white';
      context.fillRect(0, 0, targetWidth, targetHeight);
    }, [width, height, bleed]);
  
    return <canvas style={{maxWidth: '200px', maxHeight: '400px'}} ref={canvasRef} />;
  
}

export default PreviewCanvas