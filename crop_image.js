const sharp = require('sharp');
const fs = require('fs');

/**
 * Retrieve the data info image
 * @param image 
 * @returns 
 */
function getInfoImage(image) {
    return sharp(image).metadata();
}

/**
 * Resize the image to size
 * @param image 
 * @param size 
 * @returns 
 */
function resizeImage(image, size) {
    return sharp(image).resize(size).toBuffer();
}

/**
 * Define the sizes to resize image
 * @param widthActually
 * @returns 
 */
function defineArrayTamaniosResize(widthActually) {
    let tamanios = [1920, 720, 320, 180, 100];
    return tamanios.filter(t => t < widthActually);
}

const data = fs.readFileSync('./img_admin_landing.png')

getInfoImage(data).then((info) => {
    if (info.width) {
        let sizes = defineArrayTamaniosResize(info.width);

        Promise.all(
            sizes.map(size => resizeImage(data, size))
        ).then(rpt => {

            for (let index = 0; index < rpt.length; index++) {
                const file = rpt[index];
                fs.writeFileSync(`img_admin_landing_x${sizes[index]}.png`, file)
            }
        })

    }
})