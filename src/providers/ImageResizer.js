export const resizeImage = (file, maxWidth = 1000, maxHeight = 1000) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();
    
            reader.onload = () => {
                img.onload = () => {
                    // Create a canvas and set the desired width and height
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
    
                    let width = img.width;
                    let height = img.height;
    
                    // Calculate the new size, keeping the aspect ratio
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }
    
                    // Set the canvas size to the new dimensions
                    canvas.width = width;
                    canvas.height = height;
    
                    // Draw the image on the canvas
                    ctx.drawImage(img, 0, 0, width, height);
    
                    // Convert the canvas back to a file
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const resizedFile = new File([blob], file.name, {
                                type: file.type,
                            });
                            resolve(resizedFile);
                        } else {
                            reject("Failed to resize image");
                        }
                    }, file.type);
                };
    
                img.src = reader.result;
            };
    
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };