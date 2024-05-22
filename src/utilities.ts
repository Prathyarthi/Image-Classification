// export const drawRect = (detections, ctx) => {

//     // Looping over all detections
//     detections.forEach(prediction => {
//         const [x, y, width, height] = prediction['bbox'];
//         const text = prediction['class'];

//         // Set styling
//         const color = "green";
//         ctx.strokeStyle = color;
//         ctx.font = '18px Arial';
//         ctx.fillStyle = color;

//         // Draw rectangles and text
//         ctx.beginPath();
//         ctx.fillText(text, x, y);
//         ctx.rect(x, y, width, height);
//         ctx.stroke();
//     })
// }



export const drawRect = (detections: any[], ctx: CanvasRenderingContext2D) => {
    // Looping over all detections
    detections.forEach(prediction => {
        const [x, y, width, height] = prediction['bbox'];
        const text = prediction['class'];

        // Set styling
        const color = "green";
        ctx.strokeStyle = color;
        ctx.font = '18px Arial';
        ctx.fillStyle = color;

        // Draw rectangles and text
        ctx.beginPath();
        ctx.fillText(text, x, y);
        ctx.rect(x, y, width, height);
        ctx.stroke();
    });
};
